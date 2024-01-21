import axios from "axios";
import { API_URL, LIMIT } from "@/const";
import { PlaceVendorAPI } from "@/models/api";

export default async function getPlaceByVendorId({ vendor_id, page, limit }: PlaceVendorAPI) {
  try {
    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
      },
    };
    const response = await axios.get(
      `${API_URL}/places/owner/${vendor_id}`,
      config
    );

    const places = response?.data?.data;
    const paging = response?.data?.paging;

    return { places, paging };
  } catch (error) {
    console.log("Something went wrong");
  }
}
