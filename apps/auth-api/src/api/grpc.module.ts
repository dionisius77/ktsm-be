import { Module } from "@nestjs/common";
import { AuthGrpcController } from "./auth.grpc.controller";
import { Branch, Management } from "@app/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { MailModule } from "@app/helpers";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { GrpcAuthService } from "./auth.grpc.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Management]),
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
  controllers: [AuthGrpcController],
  providers: [GrpcAuthService],
})
export class GrpcModule {}
