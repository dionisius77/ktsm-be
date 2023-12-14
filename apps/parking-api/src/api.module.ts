import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getEnvPath } from "./common/helper/env.helper";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { SuperAdminParkingModule } from "./api/super-admin/parking.module";
import { UserParkingModule } from "./api/user/parking.module";

const envFilePath: string = getEnvPath(`${__dirname}/common/helper`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    SuperAdminParkingModule,
    UserParkingModule,
  ],
})
export class ApiModule {}
