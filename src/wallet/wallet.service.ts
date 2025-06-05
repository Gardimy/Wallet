// src/wallet/wallet.service.ts
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

  async transfer(fromPhone: string, toPhone: string, amount: number, pin: string) {
    if (amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à zéro.');
    }

    // const fromOwner = await this.em.findOne(WalletOwner, { phoneNumber: fromPhone }, ['wallet']);
    // const toOwner = await this.em.findOne(WalletOwner, { phoneNumber: toPhone }, ['wallet']);
const fromOwner = await this.em.findOne(WalletOwner, { phoneNumber: fromPhone }, { populate: ['wallet'] });
const toOwner = await this.em.findOne(WalletOwner, { phoneNumber: toPhone }, { populate: ['wallet'] });

    if (!fromOwner || !fromOwner.wallet) {
      throw new NotFoundException("Wallet source introuvable.");
    }
    if (!toOwner || !toOwner.wallet) {
      throw new NotFoundException("Wallet destinataire introuvable.");
    }
    if (fromOwner.wallet.pin !== pin) {
      throw new BadRequestException('PIN invalide.');
    }
    if (fromOwner.wallet.balance < amount) {
      throw new BadRequestException('Fonds insuffisants.');
    }

    fromOwner.wallet.balance -= amount;
    toOwner.wallet.balance += amount;

    const transaction = new Transaction();
    transaction.type = TransactionType.WALLET_TRANSFER;
    transaction.fromAccountId = fromOwner.wallet.id;
    transaction.toAccountId = toOwner.wallet.id;
    transaction.amount = amount;
    transaction.fees = 0;
    transaction.description = `Transfert de ${amount} de ${fromPhone} vers ${toPhone}`;
    transaction.status = TransactionStatus.COMPLETED;

    await this.em.persistAndFlush([fromOwner.wallet, toOwner.wallet, transaction]);

    return {
      success: true,
      message: 'Transfert effectué avec succès.',
      transactionId: transaction.id,
    };
  }
}
