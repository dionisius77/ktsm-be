import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRedisService } from "../redis.service";
import {
  AuthServiceClient,
  Branch,
  Management,
  OperatingArea,
} from "@app/entities";
import { IsNull, Repository } from "typeorm";
import { RegisterDto, LoginDto, CreateBranchDto } from "./auth.dto";
import { ManagementAuthHelper } from "@app/helpers";
import { ClientGrpc } from "@nestjs/microservices";

@Injectable()
export class ManagementAuthService implements OnModuleInit {
  constructor(
    @Inject("AUTH_PACKAGE") private client: ClientGrpc,
    private readonly redisService: AuthRedisService,
  ) {}
  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>("AuthService");
  }

  @InjectRepository(Management)
  private readonly repository: Repository<Management>;
  @InjectRepository(OperatingArea)
  private readonly operatingAreaRepository: Repository<OperatingArea>;

  @Inject(ManagementAuthHelper)
  private readonly helper: ManagementAuthHelper;

  public async register(body: RegisterDto): Promise<void | never> {
    const { email, password }: RegisterDto = body;
    const user: Management = await this.repository.findOne({
      where: [{ email }],
    });

    if (user) {
      throw new HttpException("Email already exist", HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.helper.encodePassword(password);
    const newUser = new Management();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.createdAt = new Date();

    await this.repository.save(newUser);
  }

  public login = async (body: LoginDto) => {
    const { email, password }: LoginDto = body;
    const attempsCount = await this.redisService.getValue(email);

    if (+attempsCount > 2) {
      throw new HttpException(
        `Account Blocked, Please Contact Administrator`,
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.repository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        `Email not registered or not verified`,
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatched = await this.helper.isPasswordValid(
      user.password,
      password,
    );

    if (!passwordMatched) {
      const newCount = attempsCount ? +attempsCount + 1 : 1;
      await this.redisService.setValue(email, newCount.toString(), 600);
      throw new HttpException(
        `Invalid Password, Count = ${newCount.toString()} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;
    return { user, token: this.helper.generateUserToken(user) };
  };

  public createOperatingArea = async (name: string) => {
    await this.operatingAreaRepository.save({ name });
  };

  public updateOperatingArea = async (id: string, name: string) => {
    const operatingArea = await this.operatingAreaRepository.findOne({
      where: { id },
    });
    if (!operatingArea) {
      throw new HttpException(
        "No operating area ID found!",
        HttpStatus.NOT_FOUND,
      );
    }
    await this.operatingAreaRepository.update(id, {
      name,
      updatedAt: new Date(),
    });
  };

  public deleteOperatingArea = async (id: string) => {
    const operatingArea = await this.operatingAreaRepository.findOne({
      where: { id },
    });
    if (!operatingArea) {
      throw new HttpException(
        "No operating area ID found!",
        HttpStatus.NOT_FOUND,
      );
    }
    await this.operatingAreaRepository.update(id, { deletedAt: new Date() });
  };

  public getAllOperatingArea = async (): Promise<OperatingArea[]> => {
    return await this.operatingAreaRepository.find({
      where: { deletedAt: IsNull() },
    });
  };

  public createBranch = async (body: CreateBranchDto) => {
    const branchUser = await this.authService
      .createBranch({
        email: body.email,
        operatingAreaId: body.operatingAreaId,
        name: body.name,
      })
      .toPromise();
    if (!branchUser) {
      throw new HttpException(
        `Email already registered`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  };

  public getAllBranch = async (): Promise<Branch[]> => {
    const branch = await this.authService
      .getAllBranch({})
      .toPromise();
    return branch.res;
  };
}
