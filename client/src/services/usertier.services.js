import { api } from "@/lib/axios.lib.js";

export const GetUserTier = async () => {
  try {
    const res = await api.get("/user/user-tier");
    if (!res || !res.data) {
      return { userTier: 'regular' };
    }
    return res.data;
  } catch (e) {
    console.error("Error getting user tier:", e);
    return { userTier: 'regular' };
  }
};

export const UpdateUserTier = async (userid, tier) => {
  try {
    if (!userid || !tier) {
      return false;
    }
    
    if (!['regular', 'premium'].includes(tier)) {
      return false;
    }
    
    const res = await api.post("/user/update-user-tier", {
      userid: userid,
      tier: tier,
    });
    
    if (!res || !res.data) {
      return false;
    }
    return res.data;
  } catch (e) {
    console.error("Error updating user tier:", e);
    return false;
  }
};

export const GetCompleteUserInfo = async () => {
  try {
    const res = await api.get("/user/complete-user-info");
    if (!res || !res.data) {
      return false;
    }
    return res.data;
  } catch (e) {
    console.error("Error getting complete user info:", e);
    return false;
  }
};

