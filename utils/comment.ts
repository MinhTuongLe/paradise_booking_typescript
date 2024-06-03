import { client, deploymentName } from "@/const";
import { RequestStatus, ViolentCode } from "@/enum";
import { toast } from "react-toastify";

export const filterViolentComment = async (message: string) => {
  let result = true;
  await client
    .getCompletions(deploymentName, [message])
    .then((res) => {})
    .catch((err) => {
      result = false;
      let messageCode = "";
      if (err?.code === RequestStatus.Exceeded)
        messageCode =
          "Request exceeded rate limit. Please try again in 3 seconds";
      else {
        if (
          err?.status === RequestStatus.BadRequest &&
          err?.code === ViolentCode.ContentFilter
        ) {
          messageCode =
            "Message was found to violate our standards. Please check the wording";
        } else messageCode = "Error while generating answer. Please try again";
      }
      toast.error(messageCode);
    });

  return result;
};
