// import React from 'react'
import Avatar from "react-avatar";
import cover from "../assets/cover.png";
import emoji from "../assets/emoji.svg";
import { useEffect, useState } from "react";

const ImageUploader = () => {
  const [avatarSize, setAvatarSize] = useState("160px");

  const updateAvatarSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 320 && screenWidth <= 672) {
      setAvatarSize("96px");
    } else {
      setAvatarSize("160px");
    }
  };

  useEffect(() => {
    updateAvatarSize(); 
    window.addEventListener('resize', updateAvatarSize); 
    return () => window.removeEventListener('resize', updateAvatarSize); 
  }, []);

  return (
    <div className=" md:p-10 xs:px-7">
      <div className="max-w-[768px]  rounded-md md:max-w-screen-[672px]">
        <div className="rounded-md shadow-md">
          <img src={cover} alt="Banner" className="rounded-t-md xs:h-32 h-44" />
          <div className="absolute transform -translate-y-1/2 md:ml-8 xs:ml-4 border-4  rounded-full">
            <Avatar
              src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg"
              size={avatarSize}
              // height="120px"
              className="sm:h-24 sm:w-24"
              round={true}
            />
          </div>
          <div className="text-right mt-4 mr-4">
            <button className=" xs:px-3.5 xs:py-2 md:py-3 hover:bg-gray-200 rounded-md md:px-5 border border-[#E5E5E5] md:text-base xs:text-sm font-medium text-[#171717]">
              Update picture
            </button>
          </div>
          <div className="px-4 pb-[70px]">
            <h1 className="font-bold text-xl text-start py-6">Jack Smith</h1>
            <div className="flex items-start xs:flex-col md:flex-row justify-start text-xl font-normal text-neutral-900">
            <p className="text-base font-normal">@kingjack</p>
            <p className="flex items-center xs:mt-3 md:mt-0 text-xl font-normal"><div className="mx-3 h-1.5 w-1 rounded-full  bg-neutral-400 xs:hidden md:block"></div>Senior Product Designer</p>
            <p className="flex items-center xs:mt-3 md:mt-0 text-xl font-normal"><span className="text-neutral-600">at</span><img src={emoji} alt="emoji" className="mx-2"/>Webflow</p>
            <p className="text-neutral-600 flex items-center text-xl font-normal"><div className="mx-3 h-1.5 w-1 rounded-full bg-neutral-400 "></div>He/Him</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

