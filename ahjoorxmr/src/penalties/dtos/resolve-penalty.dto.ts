import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PenaltyResolution {
  WAIVE = 'WAIVE',
  REJECT = 'REJECT',
}

export class ResolvePenaltyDto {
  @ApiProperty({
    description: 'The resolution action for the dispute',
    enum: PenaltyResolution,
  })
  @IsEnum(PenaltyResolution)
  resolution: PenaltyResolution;

  @ApiProperty({
    description: 'Notes or reasoning for the resolution',
    example: 'Verified transaction delay on-chain',
  })
  @IsString()
  @IsNotEmpty()
  notes: string;
}
