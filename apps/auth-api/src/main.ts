import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ApiModule } from "./api.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(ApiModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>("PORT");
  const gRPCPort: number = config.get<number>("AUTH_GRPC_PORT");

  const appGRPC = await NestFactory.createMicroservice<MicroserviceOptions>(
    ApiModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${gRPCPort}`,
        package: "auth",
        // protoPath: path.resolve(__dirname, '../../../contract/auth-api.proto'),
        protoPath: "contract/auth-api.proto",
      },
    },
  );

  app.set("trust proxy", 1);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configSwagger = new DocumentBuilder()
    .setTitle("KTSM User Auth Service")
    .setDescription("API for User data")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(port, () => {
    console.log("[REST]", `http://localhost:${port}`);
  });

  await appGRPC.listen();
}

bootstrap();
