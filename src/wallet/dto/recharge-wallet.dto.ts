// src/wallet/dto/recharge-wallet.dto.ts
import { IsNotEmpty, IsNumber, IsString, Matches, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RechargeWalletDto {
  @ApiProperty({
    example: '+50912345678',
    description: 'Numéro de téléphone du wallet au format haïtien',
  })
  @IsNotEmpty()
  @Matches(/^\+509\d{8}$/, { message: 'Invalid phone number' })
  phoneNumber: string;

  @ApiProperty({
    example: '1234',
    description: 'PIN du wallet (4 chiffres)',
  })
  @IsNotEmpty()
  @IsString()
  pin: string;

  @ApiProperty({
    example: 5000,
    description: 'Montant de la recharge (entre 50 et 50,000 HTG)',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(50, { message: 'Minimum recharge amount is 50 HTG' })
  @Max(50000, { message: 'Maximum recharge amount is 50000 HTG' })
  amount: number;
}
