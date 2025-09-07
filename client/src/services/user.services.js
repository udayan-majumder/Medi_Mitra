import { api } from "@/lib/axios.lib";

export const GetUserDetails = async() => {
  try {
    const res = await api.get("/user/userdetails");
    if (res?.data?.id) {
      return res?.data;
    }
  } catch (e) {
    return null;
  }
};

