import { create } from "zustand";

export const LanguageStore = create((set) => ({
  Language: {
    english: {
      username: "username",
      EmailID : "Email ID",
      loginheading : "Already have an account? Log in.",
      Password : "Password",
      forgotpassword : "Forgot Password?",
      patient : "Patient",
      doctor: "Doctor",
      pharmacy:"Pharmacy",
      loginbtn :"Log In"
    },
    hindi: {
      username: "यूजरनेम",
      EmailID: "ईमेल",
      loginheading:"पहले से खाता है? लॉग इन करें",
      Password: "पासवर्ड",
      forgotpassword: "पासवर्ड भूल गए?",
      patient : "मरीज़",
      doctor : "चिकित्सक",
      pharmacy : " फार्मेसी",
      loginbtn :"लॉग इन "
    },
  },
}));