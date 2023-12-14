import { Controller, Inject } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
  Branch,
  CreateBranchReqI,
  Management,
  SuperAdmin,
} from "@app/entities";
import { GrpcAuthService } from "./auth.grpc.service";

@Controller()
export class AuthGrpcController {
  @Inject(GrpcAuthService)
  private readonly authService: GrpcAuthService;

  @GrpcMethod("AuthService", "GetManagement")
  async getUser(body: { id: string }): Promise<Management> {
    const user = await this.authService.getManagementGrpc(body.id);
    return user;
  }

  @GrpcMethod("AuthService", "GetBranch")
  async getBranch(body: { id: string }): Promise<Branch> {
    const user = await this.authService.getBranchGrpc(body.id);
    return user;
  }

  @GrpcMethod("AuthService", "CreateBranch")
  async createBranch(body: CreateBranchReqI): Promise<{ id: string }> {
    console.log(body);
    const user = await this.authService.register(body);
    return user;
  }

  @GrpcMethod("AuthService", "GetAllBranch")
  async getAllBranch(body: { userId: string }) {
    const branch = await this.authService.getAllBranchGrpc();
    return { res: branch };
  }
}
