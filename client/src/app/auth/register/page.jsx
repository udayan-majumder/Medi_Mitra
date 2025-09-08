import { useState } from "react";
import { UserStore } from "@/hooks/userauth.hooks";
import { LanguageStore } from "@/store/Dictionary.store";
import CapacitorInfoStore from "@/store/capacitorInfo.store";
import { useRouter } from "next/navigation";
import { RegisterHandler } from "@/services/user.services";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  {
    /*Store variables */
  }
  const { LanguageType, setUser } = UserStore();
  const { Language } = LanguageStore();
  const { IsMobileView } = CapacitorInfoStore();

  {
    /*Custom Hooks */
  }
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [Location, setLocation] = useState("");
  const [UserType, setUserType] = useState("patient");
  const [DiseasesType, setDiseasesType] = useState([]);
  const [Age, setAge] = useState(null);
  const [showPassword, setshowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Password !== RePassword) {
        return toast.error("Password Don't Match");
      }
      if (UserType === "patient") {
        if (DiseasesType.length <= 0 || Age === null || Age <= 0) {
          return toast.error("All fields are mandatory");
        }
      }
      toast.loading("Registering");
      const res = await RegisterHandler(
        Username,
        Email,
        Password,
        Location,
        UserType,
        DiseasesType,
        Age
      );
      if (res?.errortype) {
        toast.dismissAll();
        return toast.error("Invalid email/password ");
      }

      if (res?.status === 200) {
        toast.dismissAll();
        toast.success("User Registered Successfully");

        setTimeout(() => {
          router.replace("/auth/login");
        }, 1500);
      }
    } catch (e) {
      toast.dismissAll();
      toast.error("Something went wrong");
    }
  };
  {
    /*Important --- Kaushani Form Use Krbi ... dekh Login er Design change korechi div er jai form use krbi 
    and e.preventDefault() use krbi jate reload na hoi jai baki sob setup kore diechi */
  }
  return <div>RegisterPage </div>;
}
