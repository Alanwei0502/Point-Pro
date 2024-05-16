import { MailerRequestBody } from "~/types/api";
import { http } from "./http";

export class MailerApi {
  public static path = "mail";

  static sendMailRequest = (payload: MailerRequestBody) => {
    return http.post<string, string>(`/mail`, payload);
  };
}
