// src/wallet/dto/recharge-wallet.dto.ts
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class RechargeWalletDto {
  @IsNotEmpty()
  @Matches(/^\+509\d{8}$/, { message: 'Invalid phone number' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  pin: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
