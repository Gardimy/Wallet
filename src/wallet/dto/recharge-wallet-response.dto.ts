// // src/wallet/dto/recharge-wallet-response.dto.ts
// import { ApiProperty } from '@nestjs/swagger';

// export class WalletTransactionDto {
//   @ApiProperty({ example: 'TXN_123' })
//   id: string;

//   @ApiProperty({ example: 'wallet_recharge' })
//   type: string;

//   @ApiProperty({ example: 5000 })
//   amount: number;

//   @ApiProperty({ example: { ownerName: 'Jean Baptiste' } })
//   metadata: any;
// }

// export class LedgerTransactionDto {
//   @ApiProperty({ example: 'TXN_124' })
//   id: string;

//   @ApiProperty({ example: 'ledger_debit' })
//   type: string;

//   @ApiProperty({ example: 5000 })
//   amount: number;
// }

// export class RechargeWalletResponseDataDto {
//   @ApiProperty({ type: WalletTransactionDto })
//   walletTransaction: WalletTransactionDto;

//   @ApiProperty({ type: LedgerTransactionDto })
//   ledgerTransaction: LedgerTransactionDto;

//   @ApiProperty({ example: 500000 })
//   newBalance: number;

//   @ApiProperty({ example: 9500000 })
//   ledgerBalance: number;
// }

// export class RechargeWalletResponseDto {
//   @ApiProperty({ example: true })
//   success: boolean;

//   @ApiProperty({ type: RechargeWalletResponseDataDto })
//   data: RechargeWalletResponseDataDto;
// }
