import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid'; // Rename 'v4' to avoid name conflict

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
  id: string = uuidv4();

  // ✅ Remove invalid 'enum' keyword, set type to string, and keep enum logic in the TypeScript type
  @Property({ type: 'string' })
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

  @Property({ type: 'string' })
  status: TransactionStatus = TransactionStatus.PENDING;
}
