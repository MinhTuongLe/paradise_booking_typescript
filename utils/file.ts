import Cookies from "js-cookie";
import { getApiRoute } from "./api";
import axios from "axios";
import { RouteKey } from "@/routes";
import { toast } from "react-toastify";

export const handleImageFilesUpload = async ({
  setIsLoading,
  uploadedImages,
  t,
}: any) => {
  try {
    setIsLoading(true);
    const accessToken = Cookies.get("accessToken");

    const formData = new FormData();

    uploadedImages.forEach((file: File) => {
      formData.append(`files`, file);
    });

    const response = await axios.post(
      getApiRoute(RouteKey.UploadImage),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const imageUrl = response.data.data.map((item: any) => item.url);
    toast.success(t("toast.uploading-photo-successfully"));
    return imageUrl;
  } catch (error) {
    toast.error(t("toast.uploading-photo-failed"));
  } finally {
    setIsLoading(false);
  }
};

export const isLocalFileUpload = (input: string) => {
  return input.startsWith("data:");
};

export const isUrl = (input: string) => {
  const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
  return urlPattern.test(input);
};
