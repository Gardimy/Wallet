//wallet/dto/create-wallet.dto.ts
import { IsNotEmpty, IsString, Matches, IsDateString, Length, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @Matches(/^\+509\d{8}$/, { message: 'Phone number must be in +509XXXXXXXX format' })
  phoneNumber!: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth!: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'PIN must be exactly 4 digits' })
  pin!: string;
}