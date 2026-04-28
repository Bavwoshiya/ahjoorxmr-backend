import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DisputePenaltyDto {
  @ApiProperty({
    description: 'The reason for contesting the penalty',
    example: 'Network congestion caused late contribution',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Supporting Stellar transaction hash (optional)',
    example: '6b44760451a94379a528652391080922f30b2014603f9b207869677332219973',
    required: false,
  })
  @IsString()
  @IsOptional()
  txHash?: string;
}
