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
      if (err?.status === RequestStatus.BadRequest) {
        result = false;
        let messageCode =
          lang === "vi"
            ? "Lỗi trong khi tạo câu trả lời. Vui lòng thử lại"
            : "Error while generating answer. Please try again";

        if (err?.code === ViolentCode.ContentFilter)
          messageCode =
            lang === "vi"
              ? "Tin nhắn vi phạm tiêu chuẩn của chúng tôi. Vui lòng kiểm tra lại lời văn"
              : "Message was found to violate our standards. Please check the wording";
        toast.error(messageCode);
      }
    });

  return result;
};
