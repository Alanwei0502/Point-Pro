import { http } from "./http";
import { updateImgPayload, updateImgResponse } from "~/types/api";

export class ImgurApi {
  public static path = "imgur";

  static uploadImg(payload: updateImgPayload) {
    return http.post<string, updateImgResponse>(ImgurApi.path, payload, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
}
