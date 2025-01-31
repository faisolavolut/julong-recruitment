import { siteurl } from "@/lib/utils/siteurl";
import { Edit, Settings, LogOut } from "lucide-react";

const ProfileCard = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-[#FAFAFA] rounded-md border border-gray-300  w-64">
      <div className="relative w-24 h-24 mb-4">
        <img
          src={siteurl("/dog.jpg")} // Ganti dengan URL gambar profil
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">John</h2>
        <Edit className="w-4 h-4 text-gray-500 cursor-pointer" />
      </div>
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-2 text-gray-700 hover:text-black">
          <Settings className="w-5 h-5" />
          <span>Setting</span>
        </button>
        <button className="flex items-center gap-2 text-gray-700 hover:text-black">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
