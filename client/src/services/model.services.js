import { modelapi, api } from "@/lib/axios.lib";

export const ModelSymptompAnalysis = async (symptoms, language) => {
  try {
    const res = await modelapi.post("/check_symptoms", {
      symptoms: symptoms,
      language: language,
    });

    if (!res?.data) {
      return false;
    }
    console.log(res?.data);
    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const AddToChatHistory = async (user_id, sender, message) => {
  try {
    const res = await api.post("/user/add-chat", {
      id: user_id,
      sender: sender,
      message: message,
    });

  } catch (e) {
    console.log(e);
  }
};

export const GetChatHistory = async (user_id) => {
  try {
    const res = await api.get(`/user/get-chat?id=${user_id}`);
    
    if (!res?.data) {
      return false;
    }
    
    return res?.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const DeleteChatHistory = async (user_id) => {
  try {
    const res = await api.post("/user/delete-chat", {
      id: user_id,
    });
    
    if (!res?.data) {
      return false;
    }
    
    return res?.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};
