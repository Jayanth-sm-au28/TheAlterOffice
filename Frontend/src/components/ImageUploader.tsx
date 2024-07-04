// import React from 'react'
import Avatar from "react-avatar";
import cover from "../assets/cover.png";

const ImageUploader = () => {
  return (
    <div className=" p-4">
      <div className="w-[768px] h-[176px] rounded-md ">
        <div className="rounded-md shadow-md">
          <img src={cover} alt="Banner" className="rounded-md" />{" "}
          <div className="absolute top-[150px] ml-8 border-4 border-white rounded-full">
            <Avatar
              src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg"
              size="120"
              round={true}
            />
          </div>
          <div className="text-right m-4">
            <button className=" py-3 hover:bg-gray-200 rounded-md px-5 border border-gray-400 text-base font-medium text-[#171717]">
              Update picture
            </button>
          </div>
          <div className="mt-4 pb-10">
            <h1 className="font-bold text-xl text-start ml-8">Jack Smith</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
