import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletOwner } from './entities/wallet-owner.entity';
import { Wallet } from './entities/wallet.entity';
import { LedgerAccount } from './entities/ledger-account.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class WalletService {
  constructor(private readonly em: EntityManager) {}

  async createWallet(dto: CreateWalletDto) {
    const { firstName, lastName, phoneNumber, dateOfBirth, nationalId, pin } = dto;

    const birthDate = dayjs(dateOfBirth);
    if (!birthDate.isValid() || dayjs().diff(birthDate, 'year') < 16) {
      throw new BadRequestException("L'utilisateur doit avoir au moins 16 ans.");
    }

    const existing = await this.em.findOne(WalletOwner, { phoneNumber });
    if (existing) {
      throw new BadRequestException('Un wallet existe déjà avec ce numéro.');
    }

    let ledger = await this.em.findOne(LedgerAccount, { id: 'LEDGER_MASTER' });
    if (!ledger) {
      ledger = new LedgerAccount();
      ledger.id = 'LEDGER_MASTER';
      ledger.balance = 10000000; // Exemple de solde initial (10M HTG)
      await this.em.persistAndFlush(ledger);
    }

    const owner = new WalletOwner();
    owner.firstName = firstName;
    owner.lastName = lastName;
    owner.phoneNumber = phoneNumber;
    owner.dateOfBirth = dateOfBirth;
    owner.nationalId = nationalId;

    const wallet = new Wallet();
    wallet.owner = owner;
    wallet.pin = pin;

    owner.wallet = wallet;

    const transaction = new Transaction();
    transaction.type = TransactionType.LEDGER_DEBIT;
    transaction.fromAccountId = ledger.id;
    transaction.toAccountId = wallet.id;
    transaction.amount = 0;
    transaction.fees = 0;
    transaction.description = 'Wallet creation';
    transaction.status = TransactionStatus.COMPLETED;

    await this.em.persistAndFlush([owner, wallet, transaction]);

    return {
      success: true,
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        owner: {
          firstName: owner.firstName,
          lastName: owner.lastName,
          phoneNumber: owner.phoneNumber,
        },
      },
    };
  }

  // Recharge depuis le Ledger vers Wallet
  async recharge(phoneNumber: string, pin: string, amount: number) {
    if (amount < 50 || amount > 50000) {
      throw new BadRequestException('Le montant doit être entre 50 et 50,000 HTG.');
    }

    const owner = await this.em.findOne(WalletOwner, { phoneNumber }, { populate: ['wallet'] });
    if (!owner || !owner.wallet) {
      throw new NotFoundException("Wallet introuvable.");
    }

    if (owner.wallet.pin !== pin) {
      throw new BadRequestException('PIN invalide.');
    }

    const ledger = await this.em.findOne(LedgerAccount, { id: 'LEDGER_MASTER' });
    if (!ledger) {
      throw new NotFoundException('Compte principal Ledger introuvable.');
    }

    const fees = Math.round(amount * 0.015);
    const totalDebit = amount + fees;

    if (ledger.balance < totalDebit) {
      throw new BadRequestException('Fonds insuffisants dans le Ledger.');
    }

    ledger.balance -= totalDebit;
    owner.wallet.balance += amount;

    const walletTransaction = new Transaction();
    walletTransaction.type = TransactionType.WALLET_RECHARGE;
    walletTransaction.fromAccountId = ledger.id;
    walletTransaction.toAccountId = owner.wallet.id;
    walletTransaction.amount = amount;
    walletTransaction.fees = fees;
    walletTransaction.description = `Recharge wallet ${amount} HTG pour ${owner.firstName} ${owner.lastName}`;
    walletTransaction.status = TransactionStatus.COMPLETED;

    const ledgerTransaction = new Transaction();
    ledgerTransaction.type = TransactionType.LEDGER_DEBIT;
    ledgerTransaction.fromAccountId = ledger.id;
    ledgerTransaction.toAccountId = owner.wallet.id;
    ledgerTransaction.amount = totalDebit;
    ledgerTransaction.fees = 0;
    ledgerTransaction.description = `Débit Ledger ${totalDebit} HTG pour recharge wallet ${amount} HTG`;
    ledgerTransaction.status = TransactionStatus.COMPLETED;

    await this.em.persistAndFlush([ledger, owner.wallet, walletTransaction, ledgerTransaction]);

    return {
      success: true,
      data: {
        walletTransaction: {
          id: walletTransaction.id,
          type: walletTransaction.type,
          amount: walletTransaction.amount,
          metadata: { ownerName: `${owner.firstName} ${owner.lastName}` },
        },
        ledgerTransaction: {
          id: ledgerTransaction.id,
          type: ledgerTransaction.type,
          amount: ledgerTransaction.amount,
        },
        newBalance: owner.wallet.balance,
        ledgerBalance: ledger.balance,
      },
    };
  }

  // GET /wallet/:phoneNumber/profile
  async getProfile(phoneNumber: string, pin: string) {
    const owner = await this.em.findOne(WalletOwner, { phoneNumber }, { populate: ['wallet'] });
    if (!owner || !owner.wallet) {
      throw new NotFoundException("Wallet introuvable.");
    }

    if (owner.wallet.pin !== pin) {
      throw new BadRequestException('PIN invalide.');
    }

    return {
      success: true,
      profile: {
        firstName: owner.firstName,
        lastName: owner.lastName,
        phoneNumber: owner.phoneNumber,
        dateOfBirth: owner.dateOfBirth,
        nationalId: owner.nationalId,
        walletId: owner.wallet.id,
        balance: owner.wallet.balance,
      },
    };
  }

  // GET /wallet/:phoneNumber/balance
  async getBalance(phoneNumber: string, pin: string) {
    const owner = await this.em.findOne(WalletOwner, { phoneNumber }, { populate: ['wallet'] });
    if (!owner || !owner.wallet) {
      throw new NotFoundException("Wallet introuvable.");
    }

    if (owner.wallet.pin !== pin) {
      throw new BadRequestException('PIN invalide.');
    }

    return {
      success: true,
      balance: owner.wallet.balance,
    };
  }

  // POST /wallet/transfer
async transfer(fromPhoneNumber: string, pin: string, toPhoneNumber: string, amount: number, description: string) {
  if (amount < 10) {
    throw new BadRequestException('Le montant minimum de transfert est de 10 HTG.');
  }

  if (fromPhoneNumber === toPhoneNumber) {
    throw new BadRequestException('Le transfert vers le même wallet est interdit.');
  }

  const fromOwner = await this.em.findOne(WalletOwner, { phoneNumber: fromPhoneNumber }, { populate: ['wallet'] });
  if (!fromOwner || !fromOwner.wallet) {
    throw new NotFoundException("Wallet émetteur introuvable.");
  }

  if (fromOwner.wallet.pin !== pin) {
    throw new BadRequestException('PIN invalide pour le wallet émetteur.');
  }

  const toOwner = await this.em.findOne(WalletOwner, { phoneNumber: toPhoneNumber }, { populate: ['wallet'] });
  if (!toOwner || !toOwner.wallet) {
    throw new NotFoundException("Wallet destinataire introuvable.");
  }

  // Commission : 2% (0.02)
  const fees = Math.round(amount * 0.02);
  const totalDebit = amount + fees;

  if (fromOwner.wallet.balance < totalDebit) {
    throw new BadRequestException('Solde insuffisant pour effectuer ce transfert.');
  }

  // Débit wallet émetteur
  fromOwner.wallet.balance -= totalDebit;

  // Crédit wallet destinataire
  toOwner.wallet.balance += amount;

  // Transaction de transfert
  const transferTransaction = new Transaction();
  transferTransaction.type = TransactionType.WALLET_TRANSFER;
  transferTransaction.fromAccountId = fromOwner.wallet.id;
  transferTransaction.toAccountId = toOwner.wallet.id;
  transferTransaction.amount = amount;
  transferTransaction.fees = fees;
  transferTransaction.description = description;
  transferTransaction.status = TransactionStatus.COMPLETED;

  // Enregistrer
  await this.em.persistAndFlush([fromOwner.wallet, toOwner.wallet, transferTransaction]);

  return {
    success: true,
    transaction: {
      id: transferTransaction.id,
      type: 'wallet_transfer',
      from: fromPhoneNumber,
      to: toPhoneNumber,
      amount: amount,
      fees: fees,
      description: description,
    },
    fromNewBalance: fromOwner.wallet.balance,
    toNewBalance: toOwner.wallet.balance,
    ledgerCommission: fees,
  };
}
async getTransactions(phoneNumber: string, pin: string, limit: number = 20) {
  const owner = await this.em.findOne(WalletOwner, { phoneNumber }, { populate: ['wallet'] });
  if (!owner || !owner.wallet) {
    throw new NotFoundException("Wallet introuvable.");
  }

  if (owner.wallet.pin !== pin) {
    throw new BadRequestException('PIN invalide.');
  }

  //Historique des transactions
  // On récupère les transactions où le wallet est soit source soit destination
  const transactions = await this.em.find(
    Transaction,
    {
      $or: [
        { fromAccountId: owner.wallet.id },
        { toAccountId: owner.wallet.id },
      ],
    },
    {
      orderBy: { timestamp: 'DESC' },
      limit: limit,
    }
  );

  const data = transactions.map((txn) => ({
    id: txn.id,
    type: txn.type,
    fromAccountId: txn.fromAccountId,
    toAccountId: txn.toAccountId,
    amount: txn.amount,
    fees: txn.fees,
    description: txn.description,
    status: txn.status,
    timestamp: txn.timestamp?.toISOString() ?? new Date().toISOString(),
    metadata: {
      ownerName: `${owner.firstName} ${owner.lastName}`,
    },
  }));

  return {
    success: true,
    data,
  };
}

// GET Ledger Status
async getLedgerStatus() {
  const ledger = await this.em.findOne(LedgerAccount, { id: 'LEDGER_MASTER' });

  if (!ledger) {
    throw new NotFoundException('Compte Ledger principal introuvable.');
  }

  return {
    success: true,
    data: {
      ledgerId: ledger.id,
      balance: ledger.balance,
    },
  };
}

// GET Ledger Transactions
async getLedgerTransactions(limit: number = 50) {
  const transactions = await this.em.find(
    Transaction,
    {
      $or: [
        { fromAccountId: 'LEDGER_MASTER' },
        { toAccountId: 'LEDGER_MASTER' },
      ],
    },
    {
      orderBy: { timestamp: 'DESC' },
      limit,
    },
  );

  return {
    success: true,
    data: transactions.map(txn => ({
      id: txn.id,
      type: txn.type,
      fromAccountId: txn.fromAccountId,
      toAccountId: txn.toAccountId,
      amount: txn.amount,
      fees: txn.fees,
      description: txn.description,
      status: txn.status,
      timestamp: txn.timestamp?.toISOString() ?? new Date().toISOString(),
    })),
  };
 }
}
