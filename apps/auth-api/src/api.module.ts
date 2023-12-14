import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getEnvPath } from "./common/helper/env.helper";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { ManagementAuthModule } from "./api/management/auth.module";
import { GrpcModule } from "./api/grpc.module";
import { BranchAuthModule } from "./api/branch/auth.module";

const envFilePath: string = getEnvPath(`${__dirname}/common/helper`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ManagementAuthModule,
    BranchAuthModule,
    GrpcModule,
  ],
})
export class ApiModule {}
