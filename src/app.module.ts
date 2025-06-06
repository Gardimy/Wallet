import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    WalletModule,
    // Tu ajouteras tes modules ici plus tard
  ],
})
export class AppModule {}


