"use client";
import React from "react";
import { UserStore } from "@/hooks/userauth.hooks";
import Image from "next/image";
import { LogoutHandler } from "@/services/user.services";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LanguageStore } from "@/store/Dictionary.store";

const BeforeMatchDoctor = ({
  userState,
  status,
  error,
  onJoin,
  onDisconnect,
}) => {
  const { User, setUser, LanguageType } = UserStore();
  const router = useRouter();
  const { Language } = LanguageStore();

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...");
      const logoutSuccess = await LogoutHandler();
      if (logoutSuccess) {
        toast.dismissAll();
        toast.success("Logged out successfully");
        setUser(null);
        localStorage.removeItem("languagetype");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      } else {
        toast.dismissAll();
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.dismissAll();
      toast.error("Something went wrong. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center p-6">
        {/* Doctor Profile - Top Left */}
        <div className="px-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-lg">👤</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {Language?.[LanguageType]?.hello}, {User?.username}
              </h1>
              <p className="text-gray-500">{User?.location}</p>
            </div>
          </div>
        </div>

        {/* MEDIMITRA Logo - Top Right */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="MEDIMITRA" width={100} height={100} />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl text-gray-700 italic mb-8">
            Ready for your next consultation?
          </h1>

          {!userState.type ? (
            <div className="space-y-4">
              <button
                onClick={onJoin}
                disabled={!userState.isConnected}
                className="w-64 bg-white border-2 border-green-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors hover:bg-green-50 disabled:opacity-50"
              >
                Available
              </button>
              <div>
                <button
                  onClick={onJoin}
                  disabled={!userState.isConnected}
                  className="w-64 bg-green-800 hover:bg-green-900 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Join meet
                </button>
                {/* Status */}
                <div className="py-4">
                  <p className="text-lg text-black">{status}</p>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button className="w-64 bg-white border-2 border-green-300 text-gray-700 font-medium py-3 px-6 rounded-lg">
                Available
              </button>
              <div>
                <button
                  onClick={onDisconnect}
                  className="w-64 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
              <p className="text-gray-500 mt-4">Waiting for a patient...</p>
              {userState.position && (
                <p className="text-gray-400 text-sm">
                  Position in queue: {userState.position}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Medical Professionals Illustration - Bottom */}
      <div className="p-6">
        <div className="flex justify-center items-end space-x-8">
          <Image src="/doctors-vector.png" alt="Doctor" width={800} height={800} />
        </div>
      </div>
    </div>
  );
};

export default BeforeMatchDoctor;
