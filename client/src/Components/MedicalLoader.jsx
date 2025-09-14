import { Heart, Stethoscope, Activity } from "lucide-react";

export default function MedicalLoader() {
  return (
    <div
      className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 flex justify-center items-center"
      suppressHydrationWarning={true}
    >
      <div className="text-center">
        <div className="relative mb-8">
          {/* Pulsing background circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-green-400 opacity-20 animate-pulse"></div>

          {/* Main loader container */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Rotating outer ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-green-500 rounded-full animate-spin"></div>

            {/* Rotating inner ring */}
            <div
              className="absolute inset-2 border-3 border-transparent border-b-blue-400 border-l-green-400 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>

            {/* Center medical icon */}
            <div className="relative z-10 p-2">
              <div className="animate-pulse">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
              </div>
            </div>
          </div>

          {/* Floating medical icons */}
          <div
            className="absolute -top-4 -left-4 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            <Stethoscope className="w-6 h-6 text-blue-500" />
          </div>
          <div
            className="absolute -top-4 -right-4 animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            <Activity className="w-6 h-6 text-green-500" />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 animate-pulse">
            Medi Mitra
          </h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
