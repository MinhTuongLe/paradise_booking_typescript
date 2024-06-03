import { client, deploymentName } from "@/const";
import { RequestStatus, ViolentCode } from "@/enum";
import Cookie from "js-cookie";
import { toast } from "react-toastify";

export const filterViolentComment = async (message: string) => {
  const lang = Cookie.get("lang");

  let result = true;
  await client
    .getCompletions(deploymentName, [message])
    .then((res) => {})
    .catch((err) => {
      result = false;
      let messageCode = "";
      if (err?.code === RequestStatus.Exceeded)
        messageCode =
          lang === "vi"
            ? "Yêu cầu vượt quá giới hạn. Vui lòng thử lại sau 3 giây"
            : "Request exceeded rate limit. Please try again in 3 seconds";
      else {
        if (
          err?.status === RequestStatus.BadRequest &&
          err?.code === ViolentCode.ContentFilter
        ) {
          messageCode =
            lang === "vi"
              ? "Tin nhắn vi phạm tiêu chuẩn của chúng tôi. Vui lòng kiểm tra lại lời văn"
              : "Message was found to violate our standards. Please check the wording";
        } else
          messageCode =
            lang === "vi"
              ? "Lỗi trong khi tạo câu trả lời. Vui lòng thử lại"
              : "Error while generating answer. Please try again";
      }
      toast.error(messageCode);
    });

  return result;
};
