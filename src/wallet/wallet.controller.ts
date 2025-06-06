import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  async create(@Body() body: CreateWalletDto) {
    return this.walletService.createWallet(body);
  }

  @Post('recharge')
  async recharge(@Body() body: RechargeWalletDto) {
    return this.walletService.rechargeWallet(body.phoneNumber, body.amount, body.pin);
  }
}
