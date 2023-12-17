import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getEnvPath } from "./common/helper/env.helper";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { ManagementMessageModule } from "./api/management/message.module";
import { ScheduleModule } from '@nestjs/schedule';
import { BranchMessageModule } from "./api/branch/message.module";

const envFilePath: string = getEnvPath(`${__dirname}/common/helper`);

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ManagementMessageModule,
    BranchMessageModule,
  ],
})
export class ApiModule {}
