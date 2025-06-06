import { Controller, Post, Body, Get, Param, Headers } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiHeader,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { RechargeWalletResponseDto } from './dto/recharge-wallet-response.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';
import { Query } from '@nestjs/common';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  @ApiOperation({ summary: 'Créer un wallet utilisateur' })
  async create(@Body() body: CreateWalletDto) {
    return this.walletService.createWallet(body);
  }

  @Post('recharge')
  @ApiOperation({ summary: 'Recharger un wallet à partir du Ledger' })
  @ApiBody({
    type: RechargeWalletDto,
    examples: {
      rechargeExample: {
        summary: 'Exemple de recharge',
        value: {
          phoneNumber: '+50912345678',
          pin: '1234',
          amount: 5000,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Recharge effectuée avec succès',
    type: RechargeWalletResponseDto,
  })
  async recharge(@Body() body: RechargeWalletDto) {
    return this.walletService.recharge(body.phoneNumber, body.pin, body.amount);
  }

  @Get(':phoneNumber/profile')
  @ApiOperation({ summary: 'Consulter le profil d’un wallet' })
  @ApiParam({ name: 'phoneNumber', required: true })
  @ApiHeader({ name: 'x-pin', required: true, description: 'PIN du wallet' })
  async getProfile(
    @Param('phoneNumber') phoneNumber: string,
    @Headers('x-pin') pin: string,
  ) {
    return this.walletService.getProfile(phoneNumber, pin);
  }

  @Get(':phoneNumber/balance')
  @ApiOperation({ summary: 'Obtenir le solde d’un wallet' })
  @ApiParam({ name: 'phoneNumber', required: true })
  @ApiHeader({ name: 'x-pin', required: true, description: 'PIN du wallet' })
  async getBalance(
    @Param('phoneNumber') phoneNumber: string,
    @Headers('x-pin') pin: string,
  ) {
    return this.walletService.getBalance(phoneNumber, pin);
  }

  @Post('transfer')
@ApiOperation({ summary: 'Transfert entre Wallets' })
@ApiBody({
  type: TransferWalletDto,
  examples: {
    transferExample: {
      summary: 'Exemple de transfert',
      value: {
        fromPhone: '+50912345678',
        toPhone: '+50987654321',
        amount: 100000,
        description: 'Remboursement',
      },
    },
  },
})
@ApiOkResponse({
  description: 'Transfert effectué avec succès',
})
@ApiHeader({ name: 'x-pin', required: true, description: 'PIN du wallet émetteur' })
async transfer(
  @Body() body: TransferWalletDto,
  @Headers('x-pin') pin: string,
) {
  return this.walletService.transfer(
    body.fromPhone,
    pin,
    body.toPhone,
    body.amount,
    body.description
  );
}
@Get(':phoneNumber/transactions')
@ApiOperation({ summary: "Historique des transactions d'un wallet" })
@ApiParam({ name: 'phoneNumber', required: true })
@ApiHeader({ name: 'x-pin', required: true, description: 'PIN du wallet' })
@ApiOkResponse({
  description: 'Liste des transactions du wallet',
})
async getTransactions(
  @Param('phoneNumber') phoneNumber: string,
  @Headers('x-pin') pin: string,
  @Query('limit') limit = '20'
): Promise<any> {
  return this.walletService.getTransactions(phoneNumber, pin, parseInt(limit, 10));
}
// GET /admin/ledger/status
@Get('/admin/ledger/status')
@ApiOperation({ summary: 'Statut actuel du Ledger' })
async getLedgerStatus() {
  return this.walletService.getLedgerStatus();
}

// GET /admin/ledger/transactions
@Get('/admin/ledger/transactions')
@ApiOperation({ summary: 'Historique des transactions du Ledger' })
@ApiParam({ name: 'limit', required: false, description: 'Nombre max de transactions à retourner' })
async getLedgerTransactions(@Param('limit') limitParam?: string) {
  const limit = limitParam ? parseInt(limitParam, 10) : 50;
  return this.walletService.getLedgerTransactions(limit);
  }
}
