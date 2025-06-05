import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export enum TransactionType {
  WALLET_RECHARGE = 'wallet_recharge',
  WALLET_TRANSFER = 'wallet_transfer',
  BILL_PAYMENT = 'bill_payment',
  LEDGER_DEBIT = 'ledger_debit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Transaction {
  @PrimaryKey()
  id: string = v4();

  @Property({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Property()
  fromAccountId!: string;

  @Property({ nullable: true })
  toAccountId?: string;

  @Property()
  amount!: number;

  @Property()
  fees!: number;

  @Property()
  description!: string;

  @Property()
  timestamp: Date = new Date();

  @Property({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus = TransactionStatus.PENDING;
}
