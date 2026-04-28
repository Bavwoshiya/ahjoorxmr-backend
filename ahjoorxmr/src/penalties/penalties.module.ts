import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Penalty } from './entities/penalty.entity';
import { PenaltyService } from './services/penalty.service';
import { PenaltyAssessmentJob } from './services/penalty-assessment.job';
import { PenaltiesController } from './penalties.controller';
import { Group } from '../groups/entities/group.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { Contribution } from '../contributions/entities/contribution.entity';
import { NotificationsModule } from '../notification/notifications.module';
import { AuditModule } from '../audit/audit.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Penalty, Group, Membership, Contribution]),
        NotificationsModule,
        AuditModule,
    ],
    controllers: [PenaltiesController],
    providers: [PenaltyService, PenaltyAssessmentJob],
    exports: [PenaltyService, PenaltyAssessmentJob],
})
export class PenaltiesModule { }
