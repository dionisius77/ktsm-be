import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRedisService } from "../redis.service";
import { Branch } from "@app/entities";
import { Repository } from "typeorm";
import { AdminLoginDto, AdminResetPasswordDTO } from "./auth.dto";
import { BranchAuthHelper, MailService } from "@app/helpers";

@Injectable()
export class BranchAuthService {
  constructor(private readonly redisService: AuthRedisService) {}

  @InjectRepository(Branch)
  private readonly repository: Repository<Branch>;

  @Inject(BranchAuthHelper)
  private readonly helper: BranchAuthHelper;

  @Inject(MailService)
  private readonly mailService: MailService;

  public async requestResetPassword(email: string): Promise<void> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedEmail = this.helper.generateResetPwToken(email);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    // TODO: send reset password link to email
    await this.redisService.setValue(hashedEmail, user.id, 1800);
  }

  public async verifyToken(token: string): Promise<string> {
    const storedToken = await this.redisService.getValue(token);
    if (!storedToken) {
      throw new HttpException(`Token not valid`, HttpStatus.BAD_REQUEST);
    }
    return storedToken;
  }

  public async changePassword(id: string, payload: AdminResetPasswordDTO): Promise<void> {
    const hashedPassword = await this.helper.encodePassword(payload.password);
    await this.repository.update({ id }, { password: hashedPassword });
  }

  public login = async (body: AdminLoginDto) => {
    const { email, password }: AdminLoginDto = body;
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
    return { user, token: this.helper.generateBranchToken(user) };
  };
}
