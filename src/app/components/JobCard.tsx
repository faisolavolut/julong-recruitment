import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { get_user } from "@/lib/utils/get_user";
import { siteurl } from "@/lib/utils/siteurl";
import { useState } from "react";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
export const JobCard: React.FC<any> = ({
  data,
  hidden_save,
}: {
  data: any;
  hidden_save?: boolean;
}) => {
  const [favorite, setFavorite] = useState(data?.is_saved ? true : false);
  const [isZooming, setIsZooming] = useState(false);
  const handleClick = () => {
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 300); // Durasi animasi 300ms
  };
  return (
    <div
      className="border rounded-lg shadow-md p-4 w-72 bg-white"
      onClick={() => {
        let _url: any = siteurl(`/job-posting/${data?.id}`);
        window.open(_url, "_blank");
      }}
    >
      <div className="flex justify-between items-center">
        <div className="text-black font-bold text-xl">
          <div className="w-12 h-12">
            <img
              src={siteurl("/dog.jpg")}
              alt="John Cena"
              className="rounded-full w-full h-full object-cover border-2 border-white"
            />
          </div>
        </div>
        {data?.is_applied ? (
          <div className="text-blue-600  px-3 py-1 text-sm font-bold">
            Applied
          </div>
        ) : (
          <button
            className="text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-600 hover:text-white transition cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("CLICK APPLY");
            }}
          >
            Apply Now
          </button>
        )}
      </div>

      {/* Judul dan Lokasi */}
      <h2 className="mt-3 font-bold text-lg">{data?.job_name}</h2>
      <p className="text-gray-600 text-sm line-clamp-1">
        {data?.for_organization_name} &bull; {data?.for_organization_location}
      </p>

      {/* Deskripsi */}
      <div
        className={cx("mt-2 text-gray-500 text-sm line-clamp-1")}
        dangerouslySetInnerHTML={{ __html: data?.content_description }}
      ></div>

      {/* Tags */}
      <div className="flex gap-2 mt-4 flex-row justify-between items-center">
        <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-3 py-1 rounded-full line-clamp-1">
          {data?.recruitment_type}
        </span>
        <div
          className={cx(
            `cursor-pointer text-primary transition-transform ${
              isZooming ? "scale-110" : "scale-100"
            }`
          )}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClick();
            setFavorite(!favorite);
            const w: any = window as unknown as {
              user: any;
            };
            if (typeof w === "object" && typeof w?.user === "object") {
              await actionToast({
                task: async () => {
                  await apix({
                    port: "recruitment",
                    value: "data.data.job_postings",
                    path: "/api/job-postings/save?job_posting_id=" + data?.id,
                    method: "get",
                  });
                },
                after: () => {},
                msg_load: "Saving your favorite job ",
                msg_error: "Failed to save your favorite job ",
                msg_succes: "Your favorite job has been saved successfully! ",
              });
            }
          }}
        >
          {get_user("id") && favorite ? <IoBookmark /> : <IoBookmarkOutline />}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
