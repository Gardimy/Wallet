import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsDateString, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ example: '+50912345678' })
  @IsNotEmpty()
  @Matches(/^\+509\d{8}$/, { message: 'Phone number must be in +509XXXXXXXX format' })
  phoneNumber!: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'PIN must be exactly 4 digits' })
  pin!: string;
}
