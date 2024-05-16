import { ApiResponse } from "./api";
import { Member } from "./user.type";

type LoginResponse = ApiResponse<{
  authToken: string;
  member: Member;
}>;
