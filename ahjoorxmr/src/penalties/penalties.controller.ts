import {
    Controller,
    Post,
    Patch,
    Get,
    Param,
    Body,
    UseGuards,
    Request,
    Version,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PenaltyService } from './services/penalty.service';
import { Penalty } from './entities/penalty.entity';
import { WaivePenaltyDto } from './dtos/waive-penalty.dto';
import { DisputePenaltyDto } from './dtos/dispute-penalty.dto';
import { ResolvePenaltyDto } from './dtos/resolve-penalty.dto';
import { AuditLog } from '../audit/decorators/audit-log.decorator';

@ApiTags('Penalties')
@Controller('penalties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PenaltiesController {
    constructor(private readonly penaltyService: PenaltyService) { }

    @Get('pending')
    @Version('1')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Get pending penalties for current user',
        description: 'Returns all pending penalties for the authenticated user across all groups.',
    })
    @ApiResponse({ status: 200, type: [Penalty] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getPendingPenalties(
        @Request() req: { user: { id: string } },
    ): Promise<Penalty[]> {
        // This would need to be enhanced to get all penalties for the user
        // For now, return empty array
        return [];
    }

    @Post(':id/waive')
    @Version('1')
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    @AuditLog({ action: 'PENALTY_WAIVED', resource: 'Penalty' })
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Waive a penalty (admin only)',
        description: 'Mark a penalty as waived with a reason. Only group admins can waive penalties.',
    })
    @ApiResponse({ status: 200, type: Penalty })
    @ApiResponse({ status: 400, description: 'Invalid penalty ID or status' })
    @ApiResponse({ status: 403, description: 'Forbidden - not a group admin' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async waivePenalty(
        @Param('id', ParseUUIDPipe) penaltyId: string,
        @Body() dto: WaivePenaltyDto,
        @Request() req: { user: { id: string } },
    ): Promise<Penalty> {
        return this.penaltyService.waivePenalty(penaltyId, dto.reason, req.user.id);
    }

    @Post(':id/dispute')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    @AuditLog({ action: 'PENALTY_DISPUTE_SUBMITTED', resource: 'Penalty' })
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Dispute a penalty',
        description: 'Submit a dispute for a pending penalty with a reason and optional transaction hash.',
    })
    @ApiResponse({ status: 201, type: Penalty })
    @ApiResponse({ status: 400, description: 'Invalid penalty status' })
    @ApiResponse({ status: 403, description: 'Forbidden - not your penalty' })
    @ApiResponse({ status: 404, description: 'Penalty not found' })
    async disputePenalty(
        @Param('id', ParseUUIDPipe) penaltyId: string,
        @Body() dto: DisputePenaltyDto,
        @Request() req: { user: { id: string } },
    ): Promise<Penalty> {
        return this.penaltyService.disputePenalty(penaltyId, req.user.id, dto);
    }

    @Patch(':id/resolve')
    @Version('1')
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    @AuditLog({ action: 'PENALTY_DISPUTE_RESOLVED', resource: 'Penalty' })
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Resolve a penalty dispute (admin only)',
        description: 'Accept (waive) or reject a penalty dispute. Only admins can resolve disputes.',
    })
    @ApiResponse({ status: 200, type: Penalty })
    @ApiResponse({ status: 400, description: 'Invalid penalty status' })
    @ApiResponse({ status: 403, description: 'Forbidden - not an admin' })
    @ApiResponse({ status: 404, description: 'Penalty not found' })
    async resolveDispute(
        @Param('id', ParseUUIDPipe) penaltyId: string,
        @Body() dto: ResolvePenaltyDto,
        @Request() req: { user: { id: string } },
    ): Promise<Penalty> {
        return this.penaltyService.resolveDispute(penaltyId, req.user.id, dto);
    }
}
