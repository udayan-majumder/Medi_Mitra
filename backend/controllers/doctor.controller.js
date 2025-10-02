import { AddDoctorFunction, GetDoctorFunction } from "../models/user.models.js";

export const CreateDoctorProfile = async (req, res) => {
  try {
    const { doctorid, name, age, specialization, experience } = req.body;
    if (
      !doctorid ||
      name.length <= 0 ||
      age === null ||
      specialization.length <= 0 ||
      experience === null
    ) {
      return res.status(400).json({ message: "Invalid Parameters" });
    }
    const isAddedDoctor = await AddDoctorFunction(
      doctorid,
      name,
      age,
      specialization,
      experience
    );
    if (!isAddedDoctor) {
      return res
        .status(400)
        .json({ message: "Failed to Create Doctor Profile" });
    }
    return res
      .status(200)
      .json({ message: "Doctor Profile Created Successfully" });
  } catch (e) {
    console.error("Error in CreateDoctorProfile:", e);
  }
};

export const GetDoctorProfile = async (req, res) => {
  try {
    const { doctorid } = req.query;

    if (!doctorid) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const doctorProfile = await GetDoctorFunction(doctorid);

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    return res.status(200).json({ data: doctorProfile });
  } catch (e) {
    console.error("Error in GetDoctorProfile:", e);
  }
};
