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

  async rechargeWallet(phoneNumber: string, amount: number, pin: string) {
  if (amount <= 0) {
    throw new BadRequestException('Le montant de la recharge doit être supérieur à zéro.');
  }

  const owner = await this.em.findOne(WalletOwner, { phoneNumber }, { populate: ['wallet'] });

  if (!owner || !owner.wallet) {
    throw new NotFoundException('Wallet introuvable.');
  }

  if (owner.wallet.pin !== pin) {
    throw new BadRequestException('PIN invalide.');
  }

  owner.wallet.balance += amount;

  const transaction = new Transaction();
  transaction.type = TransactionType.WALLET_RECHARGE;
  transaction.fromAccountId = 'EXTERNAL_RECHARGE';
  transaction.toAccountId = owner.wallet.id;
  transaction.amount = amount;
  transaction.fees = 0;
  transaction.description = `Recharge de ${amount} HTG sur le wallet de ${phoneNumber}`;
  transaction.status = TransactionStatus.COMPLETED;

  await this.em.persistAndFlush([owner.wallet, transaction]);

  return {
    success: true,
    message: 'Recharge effectuée avec succès.',
    transactionId: transaction.id,
    newBalance: owner.wallet.balance,
  };
}

  // ✅ Recharge Method
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

 // Récupérer le ledger principal
    const ledger = await this.em.findOne(LedgerAccount, { id: 'LEDGER_MASTER' });
    if (!ledger) {
      throw new NotFoundException('Compte principal Ledger introuvable.');
    }

    //calcul des frais et du montant total à débiter
    const fees = Math.round(amount * 0.015);
    const totalDebit = amount + fees;

    if (ledger.balance < totalDebit) {
      throw new BadRequestException('Fonds insuffisants dans le Ledger.');
    }

    //transaction de recharge
    ledger.balance -= totalDebit;
    owner.wallet.balance += amount;

    const transaction = new Transaction();
    transaction.type = TransactionType.LEDGER_DEBIT;
    transaction.fromAccountId = ledger.id;
    transaction.toAccountId = owner.wallet.id;
    transaction.amount = amount;
    transaction.fees = fees;
    transaction.description = `Recharge de ${amount} HTG sur wallet ${phoneNumber}`;
    transaction.status = TransactionStatus.COMPLETED;

    await this.em.persistAndFlush([ledger, owner.wallet, transaction]);

    return {
      success: true,
      message: `Wallet crédité avec ${amount} HTG (frais : ${fees} HTG)`,
      balance: owner.wallet.balance,
      transactionId: transaction.id,
    };
  }
}
