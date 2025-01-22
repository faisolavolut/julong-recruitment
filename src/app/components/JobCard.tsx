import { siteurl } from "@/lib/utils/siteurl";
export const JobCard: React.FC<any> = ({ data }: { data: any }) => {
  return (
    <div
      className="border rounded-lg shadow-md p-4 w-72 bg-white"
      onClick={() => {
        let _url: any = siteurl(`/job-posting/${data?.id}`);
        console.log(_url);
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
      <div className="flex gap-2 mt-4">
        <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-3 py-1 rounded-full line-clamp-1">
          {data?.recruitment_type}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
