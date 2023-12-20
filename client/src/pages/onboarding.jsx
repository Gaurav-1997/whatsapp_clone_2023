import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import { setUser, setNewUser } from "@/features/user/userSlice";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function onboarding() {
  console.log("Reached /onbarding page");

  // const [{ userInfo }] = useStateProvider();
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  console.log("onbarding userInfo: ",userInfo);
  const newUser = useSelector((state) => state.newUser);
  // console.log(userInfo);

  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(
    userInfo?.profilePicture || "/default_avatar.png"
  );

  useEffect(() => {
    // if new user is there : newUser:false & email:null
    if (!newUser && !userInfo?.email) router.push("/login");
    // redirect to chat page
    // newUser: false & email: true
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);

  const onBoardUserHandler = async () => {
    try {
      if (validateDetails()) {
        const email = userInfo.email;
        console.log(
          "onboarding(): before post user",
          email,
          name,
          image,
          about
        );
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          profilePicture:image,
          about,
        });
        console.log("User onboarded");
        console.log("backend response :", data);
        if (data.status) {
          dispatch(setNewUser(true));
          dispatch(
            setUser({
              email,
              name,
              profilePicture: image,
              status: about,
            })
          );
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateDetails = () => {
    if (name.length < 3) return false;
    return true;
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create Your Profile</h2>
      <div className="flex gap-6 mt-6 bg-teal-900 rounded-md p-5 shadow-lg">
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
              onClick={onBoardUserHandler}
            >
              Create profile
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default onboarding;
