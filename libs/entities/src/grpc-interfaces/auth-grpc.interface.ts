import { Branch, Management } from "@app/entities";
import { Observable } from "rxjs";

export interface CreateBranchReqI {
  email: string;
  operatingAreaId: string;
}

// export interface BranchResp {
//   id: string;
//   email: string;
//   username: string;
//   operatingAreaId: string;
// }

export interface AuthServiceClient {
  getManagement: (body: { id: string }) => Observable<Management>;
  getBranch: (body: { id: string }) => Observable<Branch>;
  createBranch: (body: CreateBranchReqI) => Observable<{ id: string }>;
  getAllBranch: (body: {
    userId: string;
  }) => Observable<{ res: Array<Branch> }>;
}
