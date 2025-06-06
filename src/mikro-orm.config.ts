// mikro-orm.config.ts

import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Wallet } from './entities/wallet.entity';
import { WalletOwner } from './entities/wallet-owner.entity';
import { LedgerAccount } from './entities/ledger-account.entity';
import { Transaction } from './entities/transaction.entity';

const config: MikroOrmModuleOptions = {
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'gardy', // replace with your real password
  dbName: 'haiti_pay',
  entities: [WalletOwner, Wallet, LedgerAccount, Transaction],
  debug: true,
};

export default config;
