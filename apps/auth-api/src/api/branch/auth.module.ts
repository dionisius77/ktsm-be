import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch, OperatingArea } from "@app/entities";
import { BranchAuthController } from "./auth.controller";
import { BranchAuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { BranchAuthHelper, BranchJwtStrategy, MailModule } from "@app/helpers";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthRedisService } from "../redis.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "branch", property: "branch" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_KEY_BRANCH"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
    }),
    TypeOrmModule.forFeature([Branch, OperatingArea]),
    MailModule,
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: "AUTH_PACKAGE",
        useFactory: (config: ConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              package: "auth",
              protoPath: "contract/auth-api.proto",
              // url: `0.0.0.0:21000`,
              url: config.get<string>("AUTH_SERVICE"),
            },
          };
        },
      },
    ]),
  ],
  controllers: [BranchAuthController],
  providers: [
    BranchAuthService,
    BranchAuthHelper,
    BranchJwtStrategy,
    AuthRedisService,
  ],
})
export class BranchAuthModule {}
