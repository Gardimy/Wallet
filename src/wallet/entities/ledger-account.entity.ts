//wallet/entities/ledger-account.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class LedgerAccount {
  @PrimaryKey()
  id: string = 'LEDGER_MASTER';

  @Property()
  name: string = 'Master Ledger';

  @Property()
  balance: number = 0;

  @Property()
  createdAt: Date = new Date();
}
