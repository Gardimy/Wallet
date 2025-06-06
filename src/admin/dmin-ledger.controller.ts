// src/admin/admin-ledger.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
// import { LedgerService } from './ledger.service';

@ApiTags('Admin / Ledger')
@Controller('admin/ledger')
export class AdminLedgerController {
//   constructor(private readonly ledgerService: LedgerService) {}

  @Get('status')
  @ApiOperation({ summary: 'Statut du Ledger (admin)' })
  async getLedgerStatus() {
    // return this.ledgerService.getLedgerStatus();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Historique du Ledger (admin)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre maximum de transactions à retourner (par défaut: 50)',
  })
  async getLedgerTransactions(@Query('limit') limit: number) {
    // return this.ledgerService.getLedgerTransactions(limit);
  }
}
