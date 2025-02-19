import ImageBetter from "@/lib/components/ui/Image";
import { apix } from "@/lib/utils/apix";
import { get_user } from "@/lib/utils/get_user";
import { siteurl } from "@/lib/utils/siteurl";
import { Settings, LogOut } from "lucide-react";

const ProfileCard = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-[#FAFAFA] rounded-md border border-gray-300  w-64">
      <div className="relative w-24 h-24 mb-4">
        <ImageBetter
          src={siteurl(
            get_user("profile.avatar")
              ? get_user("profile.avatar")
              : get_user("photo")
          )}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
          defaultSrc={siteurl("/404-img.jpg")}
        />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">{get_user("name")}</h2>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="flex items-center gap-2 text-gray-700 hover:text-black"
          onClick={() => {
            navigate(`${siteurl(`/guest/user-setting`)}`);
          }}
        >
          <Settings className="w-5 h-5" />
          <span>Setting</span>
        </button>
        <button
          className="flex items-center gap-2 text-gray-700 hover:text-black"
          onClick={async () => {
            await apix({
              port: "public",
              method: "delete",
              path: "/api/destroy-cookies",
            });
            localStorage.removeItem("user");
            if (typeof window === "object")
              navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/logout`);
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
