import { GetUserTier, UpdateUserTier, GetCompleteUserInfo } from "../models/user.models.js";

export const GetUserTierController = async (req, res) => {
  try {
    const userid = req.user?.id;
    
    if (!userid) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userTier = await GetUserTier(userid);
    
    if (userTier === false) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ 
      userId: userid,
      userTier: userTier 
    });
  } catch (e) {
    console.error("Error in GetUserTierController:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateUserTierController = async (req, res) => {
  try {
    const { userid, tier } = req.body;
    
    if (!userid || !tier) {
      return res.status(400).json({ message: "Invalid parameters" });
    }
    
    if (!['regular', 'premium'].includes(tier)) {
      return res.status(400).json({ message: "Invalid tier value. Must be 'regular' or 'premium'" });
    }
    
    const result = await UpdateUserTier(userid, tier);
    
    if (!result) {
      return res.status(400).json({ message: "Failed to update user tier" });
    }
    
    return res.status(200).json({ 
      message: "User tier updated successfully",
      userId: result.id,
      userTier: result.user_tier
    });
  } catch (e) {
    console.error("Error in UpdateUserTierController:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetCompleteUserInfoController = async (req, res) => {
  try {
    const userid = req.user?.id;
    
    if (!userid) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userInfo = await GetCompleteUserInfo(userid);
    
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json(userInfo);
  } catch (e) {
    console.error("Error in GetCompleteUserInfoController:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

