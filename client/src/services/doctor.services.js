import { api } from "@/lib/axios.lib.js";

export const AddnewDoctorProfile = async (
  doctorid,
  name,
  age,
  specialization,
  experience
) => {
  try {
    if (
      !doctorid ||
      name.length <= 0 ||
      age === null ||
      specialization.length <= 0 ||
      experience === null
    ) {
      return false;
    }
    const res = await api.post("/user/doctor-profile-add", {
      doctorid: doctorid,
      name: name,
      age: age,
      specialization: specialization,
      experience: experience,
    });
    if (!res) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const GetDoctorProfileInfo = async (doctorid) => {
  try {
    if (!doctorid) {
      return null;
    }
    const res = await api.get(`/user/doctor-profile/`, {
      params: { doctorid },
    });
    if (!res || res.data.error) {
      return null;
    }
    return res.data.data;
  } catch (e) {
    // Handle 404 specifically - this means doctor profile doesn't exist
    if (e.response?.status === 404) {
      console.log(
        "Doctor profile not found (404) - this is expected if profile doesn't exist"
      );
      return null;
    }
    // Handle other errors
    console.error("Error fetching doctor profile:", e);
    return null;
  }
};
