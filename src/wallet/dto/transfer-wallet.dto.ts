import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class TransferWalletDto {
  @ApiProperty({ example: '+50912345678', description: 'Numéro du wallet émetteur' })
  @IsNotEmpty()
  @IsString()
  fromPhone: string;

  @ApiProperty({ example: '+50998765432', description: 'Numéro du wallet destinataire' })
  @IsNotEmpty()
  @IsString()
  toPhone: string;

  @ApiProperty({ example: 5000, description: 'Montant à transférer (HTG)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(10)
  @Max(25000)
  amount: number;

  @ApiProperty({ example: 'Remboursement', description: 'Description du transfert' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
