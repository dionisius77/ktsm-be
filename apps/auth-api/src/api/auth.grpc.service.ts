import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Management, CreateBranchReqI, Branch } from "@app/entities";
import { Repository } from "typeorm";
import { RpcException } from "@nestjs/microservices";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

@Injectable()
export class GrpcAuthService {
  private readonly scryptAsync = promisify(scrypt);
  @InjectRepository(Management)
  private readonly managementRepository: Repository<Management>;
  @InjectRepository(Branch)
  private readonly branchRepository: Repository<Branch>;

  private async encodePassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buf = await this.scryptAsync(password, salt, 64);

    return `${buf.toString()}.${salt}`;
  }

  public async register(
    body: CreateBranchReqI,
  ): Promise<{ id: string } | never> {
    const { email, operatingAreaId, name }: CreateBranchReqI = body;
    const user: Branch = await this.branchRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new RpcException("Email already exist");
    }

    const hashedPassword = await this.encodePassword("SuperPassword123!");
    const newUser = new Branch();
    newUser.email = email;
    newUser.name = name;
    newUser.operatingAreaId = operatingAreaId;
    newUser.password = hashedPassword;
    newUser.createdAt = new Date();

    const saved = await this.branchRepository.save(newUser);
    return { id: saved.id };
  }

  public getManagementGrpc = async (id: string): Promise<Management> => {
    try {
      const user = await this.managementRepository.findOne({ where: { id } });
      if (!user) {
        throw new RpcException("User not Found");
      }
      return user;
    } catch (error) {
      console.error(error);
    }
  };

  public getBranchGrpc = async (id: string) => {
    try {
      const user = await this.branchRepository.findOne({ where: { id } });
      if (!user) {
        throw new RpcException("User not Found");
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  };

  public getAllBranchGrpc = async (): Promise<Branch[]> => {
    try {
      const branches = await this.branchRepository.find({
        relations: { operatingArea: true },
      });
      return branches;
    } catch (error) {
      console.error(error);
    }
  };
}
