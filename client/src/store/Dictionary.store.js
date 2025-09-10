import { create } from "zustand";

export const LanguageStore = create((set) => ({
  Language: {
    english: {
      username: "username",
      EmailID : "Email ID",
      loginheading : "Don't have an account? Sign up.",
      Password : "Password",
      forgotpassword : "Forgot Password?",
      patient : "Patient",
      doctor: "Doctor",
      pharmacy:"Pharmacy",
      loginbtn :"Log In",
      signupheading:"Already have an account? Log in.",
      englishtext:"EN",
      hinditext:"हि",
      usernametext:"Username",
      repasswordtext:"Confirm password",
      locationtext:"Location",
      agetext:"Age"
    },
    hindi: {
      username: "यूजरनेम",
      EmailID: "ईमेल",
      loginheading:"खाता नहीं है? साइन अप करें।",
      Password: "पासवर्ड",
      forgotpassword: "पासवर्ड भूल गए?",
      patient : "मरीज़",
      doctor : "चिकित्सक",
      pharmacy : " फार्मेसी",
      loginbtn :"लॉग इन ",
      signupheading:"पहले से ही खाता है? लॉग इन करें।",
      englishtext:"EN",
      hinditext:"हि",
      usernametext:"यूज़रनेम",
      repasswordtext:"पासवर्ड दुबारा डालें",
      locationtext:"जगह",
      agetext:"उम्र"
    },
  },
}));