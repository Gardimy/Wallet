// src/wallet/wallet.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  async create(@Body() body: CreateWalletDto) {
    return this.walletService.createWallet(body);
  }
}
