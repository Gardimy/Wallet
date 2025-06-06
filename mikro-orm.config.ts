// mikro-orm.config.ts

import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Wallet } from './src/wallet/entities/wallet.entity';
import { WalletOwner } from './src/wallet/entities/wallet-owner.entity';
import { LedgerAccount } from './src/wallet/entities/ledger-account.entity';
import { Transaction } from './src/wallet/entities/transaction.entity';

const config: MikroOrmModuleOptions = {
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'gardy', // replace with your real password
  dbName: 'haiti_pay',
  entities: [WalletOwner, Wallet, LedgerAccount, Transaction],
  debug: true,
  migrations: {
    path: './src/migrations', // chemin vers les fichiers de migration
    pathTs: './src/migrations', // nécessaire pour le support TypeScript
    glob: '!(*.d).{ts,js}',     // expression pour détecter les fichiers de migration
  },
};

export default config;
