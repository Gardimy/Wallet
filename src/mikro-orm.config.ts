import { Options } from '@mikro-orm/core';
import { Wallet } from './entities/wallet.entity';
import { WalletOwner } from './entities/wallet-owner.entity';
import { LedgerAccount } from './entities/ledger-account.entity';
import { Transaction } from './entities/transaction.entity';

const config: Options = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'votre_mot_de_passe',
  dbName: 'haitipay',
  entities: [WalletOwner, Wallet, LedgerAccount, Transaction], // ✅ Still fine here
  debug: true,
};

export default config;
