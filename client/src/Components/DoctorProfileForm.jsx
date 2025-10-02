import { useState } from "react";
import { User, Stethoscope, Calendar, Award, Heart } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export const DoctorProfileForm = ({ onCreateProfile }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    specialization: "",
    experience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await onCreateProfile(
        formData.name,
        parseInt(formData.age),
        formData.specialization,
        parseInt(formData.experience)
      );

      if (success) {
        toast.success("Doctor profile created successfully!");
      } else {
        toast.error("Failed to create doctor profile. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6 poppins">
      {/* Background Medical Illustration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 opacity-10">
          <Heart className="w-32 h-32 text-green-500" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <Stethoscope className="w-32 h-32 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Doctor Profile
          </h2>
          <p className="text-gray-600">
            Please fill in your professional details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2 text-green-600" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-gray-900 text-gray-900"
              placeholder="Enter your full name"
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2 text-green-600" />
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="18"
              max="150"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-gray-900"
              placeholder="Enter your age"
            />
          </div>

          {/* Specialization Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="w-4 h-4 inline mr-2 text-green-600" />
              Specialization
            </label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-gray-900"
            >
              <option value="">Select your specialization</option>
              <option value="Nephrologist">Nephrologist</option>
              <option value="General Physician">General Physician</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Cardiologist">Cardiologist</option>
            </select>
          </div>

          {/* Experience Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-2 text-green-600" />
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-gray-900"
              placeholder="Enter years of experience"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Profile...
              </div>
            ) : (
              "Create Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
