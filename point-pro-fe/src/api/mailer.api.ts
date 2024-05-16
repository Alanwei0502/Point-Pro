import { http } from "./http";
import { MailerRequestBody } from "~/types";

export class MailerApi {
  public static path = "mail";

  static sendMailRequest = (payload: MailerRequestBody) => {
    return http.post<string, string>(`/mail`, payload);
  };
}
