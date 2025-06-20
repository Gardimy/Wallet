// src/wallet/entities/wallet-owner.entity.ts
import { Entity, Property, PrimaryKey, OneToOne } from '@mikro-orm/core';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletOwner {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ unique: true })
  phoneNumber!: string;

  @Property()
  dateOfBirth!: string;

  @Property({ nullable: true })
  nationalId?: string;

  @OneToOne(() => Wallet, wallet => wallet.owner) // This is the inverse side
  wallet!: Wallet;
}
