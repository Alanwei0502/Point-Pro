export enum MemberRole {
  MERCHANT = "MERCHANT",
  CUSTOMER = "CUSTOMER"
}

export interface Member {
  id: string;
  account: string;
  email: string;
  name: string;
  role: MemberRole;
}
