import { Alert } from "@/lib/components/ui/alert";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import ImageBetter from "@/lib/components/ui/Image";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { get_user } from "@/lib/utils/get_user";
import { siteurl } from "@/lib/utils/siteurl";
import { useState } from "react";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
export const JobCard: React.FC<any> = ({
  data,
  user,
  hidden_save,
  render,
}: {
  data: any;
  user?: any;
  hidden_save?: boolean;
  render?: () => void;
}) => {
  const [favorite, setFavorite] = useState(data?.is_saved ? true : false);
  const [applied, setApplied] = useState(data?.is_applied ? true : false);
  const [isZooming, setIsZooming] = useState(false);
  const handleClick = () => {
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 300); // Durasi animasi 300ms
  };
  return (
    <div className="border rounded-lg shadow-md p-4 w-full bg-white">
      <div className="flex justify-between items-center">
        <div
          className="text-black font-bold text-xl"
          onClick={() => {
            if (user) {
              let _url: any = siteurl(`/job-posting/${data?.id}`);
              window.open(_url, "_blank");
            }
          }}
        >
          <div className="w-12 h-12">
            <ImageBetter
              src={siteurl(data?.organization_logo)}
              alt="Logo Company"
              className="rounded-full w-full h-full object-cover border-2 border-white"
              defaultSrc={siteurl("/404-img.jpg")}
            />
          </div>
        </div>
        {applied ? (
          <div className="text-blue-600  px-3 py-1 text-sm font-bold">
            Applied
          </div>
        ) : !user ? (
          <>
            <ButtonBetter
              onClick={async (e: any) => {
                e.stopPropagation();
                e.preventDefault();
                localStorage.setItem(
                  "redirect_apply_job",
                  JSON.stringify({
                    path: `/job-posting/${data?.id}`,
                  })
                );

                window.open(
                  process.env.NEXT_PUBLIC_API_PORTAL + "/login",
                  "_self"
                );
                // navigate(process.env.NEXT_PUBLIC_API_PORTAL + "/login");
              }}
              variant="outline"
              className={
                "text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-600 hover:text-white transition cursor-pointer"
              }
            >
              Apply Now
            </ButtonBetter>
          </>
        ) : !user?.verif ? (
          <ButtonBetter
            variant="outline"
            className={
              "text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-600 hover:text-white transition cursor-pointer"
            }
            onClick={async (e: any) => {
              e.stopPropagation();
              e.preventDefault();
              await actionToast({
                task: async () => {
                  throw new Error(
                    "It looks like some required information is missing. Please complete your profile to continue."
                  );
                },
                after: () => {},
                msg_load: "Apply job ",
                hidden_icon: true,
                msg_error: "Oops! ",
                msg_succes: "Apply job success ",
              });
            }}
          >
            Apply Now
          </ButtonBetter>
        ) : (
          <Alert
            type={"save"}
            title={"Are you certain you want to continue?"}
            msg={
              "Are you sure you want to apply for this job? Please review your application before submitting. You can still make changes as long as the application form remains open."
            }
            onClick={async (e: any) => {
              e.stopPropagation();
              e.preventDefault();
              await actionToast({
                task: async () => {
                  await apix({
                    port: "recruitment",
                    path: `/api/applicants/apply?job_posting_id=${data.id}`,
                    method: "get",
                  });
                },
                after: () => {
                  data.is_applied = true;
                  setApplied(true);
                  if (typeof render === "function") render();
                },
                msg_load: "Apply job ",
                msg_error: "Apply job failed ",
                msg_succes: "Apply job success ",
              });
            }}
          >
            <ButtonContainer
              variant="outline"
              className={
                "text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-600 hover:text-white transition cursor-pointer"
              }
            >
              Apply Now
            </ButtonContainer>
          </Alert>
        )}
      </div>
      <div
        onClick={() => {
          if (user) {
            let _url: any = siteurl(`/job-posting/${data?.id}`);
            window.open(_url, "_blank");
          }
        }}
        className={cx(" flex flex-col", user ? "cursor-pointer" : "")}
      >
        <h2 className="text-md md:text-lg mt-3 font-bold  line-clamp-2">
          {data?.name || data?.job_name}
        </h2>
        <p className="text-gray-600 text-xs md:text-sm  line-clamp-1">
          {data?.for_organization_name} &bull; {data?.for_organization_location}
        </p>

        {/* Deskripsi */}
        <div
          className={cx("mt-2 text-gray-500 text-xs md:text-sm line-clamp-1")}
          dangerouslySetInnerHTML={{ __html: data?.content_description }}
        ></div>

        {/* Tags */}
        <div className="flex gap-2 mt-4 flex-row justify-between items-center">
          <p className="bg-yellow-100 text-yellow-600 text-xs font-medium px-3 py-1 rounded-full line-clamp-1">
            {data?.recruitment_type}
          </p>
          {user ? (
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
                        path:
                          "/api/job-postings/save?job_posting_id=" + data?.id,
                        method: "get",
                      });
                    },
                    after: () => {},
                    msg_load: favorite
                      ? `Removing your favorite job `
                      : `Saving your favorite job `,
                    msg_error: favorite
                      ? `Failed to remove your favorite job `
                      : "Failed to save your favorite job ",
                    msg_succes: favorite
                      ? "Your favorite job has been removed successfully! "
                      : "Your favorite job has been saved successfully! ",
                  });
                }
              }}
            >
              {get_user("id") && favorite ? (
                <IoBookmark />
              ) : (
                <IoBookmarkOutline />
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
