// src/wallet/wallet.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletOwner } from './entities/wallet-owner.entity';
import { Wallet } from './entities/wallet.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class WalletService {
  constructor(private readonly em: EntityManager) {}

  async createWallet(dto: CreateWalletDto) {
    const { firstName, lastName, phoneNumber, dateOfBirth, nationalId, pin } = dto;

    // Vérification de l’âge
    const birthDate = dayjs(dateOfBirth);
    if (!birthDate.isValid() || dayjs().diff(birthDate, 'year') < 16) {
      throw new BadRequestException("L'utilisateur doit avoir au moins 16 ans.");
    }

    // Unicité du numéro
    const existing = await this.em.findOne(WalletOwner, { phoneNumber });
    if (existing) {
      throw new BadRequestException('Un wallet existe déjà avec ce numéro.');
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

    await this.em.persistAndFlush([owner, wallet]);

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
}
