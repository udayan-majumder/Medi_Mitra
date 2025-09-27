"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePatientStore } from "@/hooks/usePatient.hooks";
import { Plus, X } from "lucide-react";
import DiseasesStore from "@/store/Diseases.store";
import { Map, Marker } from "@vis.gl/react-google-maps";
import toast, { Toaster } from "react-hot-toast";
import { AddnewProfile } from "@/services/patient.services";
import { UserStore } from "@/hooks/userauth.hooks";
import CapacitorInfoStore from "@/store/capacitorInfo.store";

export default function App() {
  {
    /*Default hooks */
  }
  const router = useRouter();
  const { User } = UserStore();
  const { AllProfiles, setcurrentProfileId, setReload } = usePatientStore();
  const { DiseasesList, AllergiesList } = DiseasesStore();
  const { IsMobileView } = CapacitorInfoStore();

  {
    /*custom hooks */
  }
  const [Popup, setPopup] = useState(false);
  const [Username, setUsername] = useState("");
  const [Age, setAge] = useState(null);
  const [Diseases, setDiseases] = useState([DiseasesList[0]]);
  const [Allergies, setAllergies] = useState([AllergiesList[0]]);
  const [Location, setLocation] = useState("");
  const [Coords, setCoords] = useState({});

  useEffect(() => {
    if (IsMobileView) {
      MobileFetchCoordinates();
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
          location: Location,
        });
      });
    }
  }, []);

  async function MobileFetchCoordinates() {
    const position = await Geolocation.getCurrentPosition();
    setCoords({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      location: Location,
    });
  }

  const handleSubmit = async (e) => {
    try {
      toast.loading("Creating new profile");
      e.preventDefault();
      if (
        Username.length < 0 ||
        Age === null ||
        location.length <= 0 ||
        !Coords?.lat
      ) {
        toast.dismissAll();
        return toast.error("Invalid or empty field");
      }
      console.log(User?.id, Username, Diseases, Allergies, Coords);
      const res = await AddnewProfile(
        User?.id,
        Username,
        Diseases,
        Age,
        Allergies,
        Coords
      );

      if (!res) {
        toast.dismissAll();
        return toast.error("unable to add user");
      }
      toast.dismissAll();
      setReload(true);
      setUsername("");
      setAge(null);
      setDiseases(DiseasesList[0]);
      setAllergies(AllergiesList[0]);
      setLocation("");
      setCoords({});
      setPopup(false);
      return toast.success("profile created successfully");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    //main div
    <div className="absolute h-screen w-full bg-[#0D0D0D] flex justify-center items-center poppins">
      <Toaster />
      {/*Sub div */}
      <div className="h-[90%] w-[95%] flex flex-col justify-start items-center p-4 space-y-2">
        {/*Heading Div */}
        <div className="h-[10%] w-full p-2 text-[30px] ">
          Welcome User
          <p className="text-base p-1 text-gray-400">Select Your Profile</p>
        </div>

        {/*All Profile Show */}
        <div className="h-[90%] w-full p-10 grid grid-cols-2 auto-rows-[120px] gap-1 overflow-y-scroll place-items-center">
          {AllProfiles?.length > 0
            ? AllProfiles?.map((patient) => (
                <button
                  key={patient?.profileid}
                  className="min-h-[100px] min-w-[100px] bg-green-600 rounded-lg active:bg-green-400"
                  onClick={() => setcurrentProfileId(patient?.profileid)}
                >
                  {patient?.name}
                </button>
              ))
            : null}
          <button
            className="min-h-[100px] min-w-[100px] border-[1px] border-gray-100 rounded-lg active:bg-green-400 flex justify-center items-center"
            onClick={() => setPopup(true)}
          >
            <Plus size={40} />
          </button>
        </div>
      </div>

      {/*Pop for add new profile */}
      {Popup ? (
        <form
          onSubmit={handleSubmit}
          className="absolute h-full w-full bg-blur-md space-y-2 bg-green-800"
        >
          {/*button div */}
          <div className="h-[6%] w-full  flex justify-end items-center p-2">
            <button className="p-1" onClick={() => setPopup(false)}>
              <X />
            </button>
          </div>

          {/*Input main div */}
          <div className="h-[90%] w-full flex flex-col justify-start items-center space-y-2">
            {/*username div */}
            <div className="h-[10%] w-full flex flex-col jusitify-start items-start space-y-1 p-3">
              <div>Username</div>
              <input
                className="min-h-30px border border-gray-300 rounded-[6px] p-1"
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setUsername(e.target.value);
                }}
                value={Username}
                placeholder="e.g - user1"
              ></input>
            </div>

            {/*Age */}
            <div className="h-[10%] w-full flex flex-col jusitify-start items-start space-y-1 p-3">
              <div>Age</div>
              <input
                className="min-h-30px border border-gray-300 w-[40%] rounded-[6px] p-1"
                type="number"
                placeholder="e.g - 18"
                onChange={(e) => {
                  e.preventDefault();
                  setAge(e.target.value);
                }}
              ></input>
            </div>

            {/*Diseases List */}
            <div className="h-[10%] w-full flex flex-col jusitify-start items-start space-y-1 p-3">
              <div>Diseases</div>
              <select
                className="w-[80%] border border-gray-300 p-1"
                onChange={(e) => {
                  e.preventDefault();
                  setDiseases((prev) => [...prev, e.target.value]);
                }}
              >
                {DiseasesList?.length > 0
                  ? DiseasesList?.map((items) => (
                      <option key={items} className="text-white bg-black">
                        {items}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            {/*Allergies List */}
            <div className="h-[10%] w-full flex flex-col jusitify-start items-start space-y-1 p-3">
              <div>Allergies</div>
              <select
                className="w-[80%] border border-gray-300 p-1"
                onChange={(e) => {
                  e.preventDefault();
                  setAllergies((prev) => [...prev, e.target.value]);
                }}
              >
                {AllergiesList?.length > 0
                  ? AllergiesList?.map((items) => (
                      <option key={items} className="text-white bg-black">
                        {items}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            {/*Location Div */}
            <div className="h-[50%] w-full flex flex-col jusitify-start items-start space-y-4 p-3">
              <div>Select Location</div>
              <input
                type="text"
                className="min-h-30px border border-gray-300 rounded-[6px] p-1"
                placeholder="e.g - kolkata"
                value={Location}
                onChange={(e) => {
                  e.preventDefault();
                  setLocation(e.target.value);
                  setCoords((prev) => ({ ...prev, location: e.target.value }));
                }}
              ></input>
              <Map
                style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                defaultCenter={Coords}
                defaultZoom={6}
                gestureHandling="greedy"
                disableDefaultUI
                onClick={(e) => {
                  setCoords({
                    lat: e.detail.latLng.lat,
                    lng: e.detail.latLng.lng,
                    location: Location,
                  });
                }}
              >
                <Marker position={Coords}></Marker>
              </Map>
            </div>

            <button className="bg-blue-400" type="submit">
              done
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
