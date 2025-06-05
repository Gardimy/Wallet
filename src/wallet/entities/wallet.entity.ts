// src/wallet/entities/wallet.entity.ts
import { Entity, Property, PrimaryKey, OneToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { WalletOwner } from './wallet-owner.entity';

@Entity()
export class Wallet {
  @PrimaryKey()
  id: string = v4();

  @OneToOne(() => WalletOwner, owner => owner.wallet, { owner: true }) // 👈 Add owner: true here
  owner!: WalletOwner;

  @Property()
  balance: number = 0;

  @Property()
  pin!: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  lastActivity: Date = new Date();
}
