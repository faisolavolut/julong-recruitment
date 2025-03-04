"use client";
import { getParams } from "@/lib/utils/get-params";

import { Alert } from "@/lib/components/ui/alert";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";

import FlowbiteFooterSection from "@/app/components/flowbite-footer";
import DefaultHeaderNavigation from "@/app/components/navbarHeader";
import { siteurl } from "@/lib/utils/siteurl";
import get from "lodash.get";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { getNumber } from "@/lib/utils/getNumber";
import { actionToast } from "@/lib/utils/action";
import ImageBetter from "@/lib/components/ui/Image";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const local = useLocal({
    open: false,
    ready: false,
    access: true,
    jobs: [] as any[],
    data: null as any,
    applied: false,
    user: null as any,
  });

  useEffect(() => {
    const run = async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/job-postings/${id}`,
        validate: "object",
      });
      local.data = data;
      local.applied = data?.is_applied;

      try {
        const res = await apix({
          port: "portal",
          value: "data.data",
          path: "/api/users/me",
          method: "get",
        });
        local.user = {
          ...res,
          verif: res?.verified_user_profile !== "ACTIVE" ? false : true,
        };
      } catch (ex) {}
      local.render();
    };
    run();
  }, []);

  return (
    <div className="flex flex-col max-w-screen bg-white">
      <DefaultHeaderNavigation />
      <div className="relative flex flex-col flex-grow">
        <div className="flex flex-col justify-center items-center">
          <div className="flex-grow flex w-full flex-col max-w-screen-xl">
            <div className="flex-grow flex flex-col ">
              <div
                className={cx(
                  "bg-gradient-to-r from-blue-500 to-blue-700 p-6  flex items-center space-x-4 shadow-lg bg-no-repeat bg-cover	bg-center	",
                  css`
                    background-image: url("${siteurl("/frame.jpg")}");
                  `
                )}
              >
                <div className="flex flex-col px-10 gap-x-4">
                  <div className="w-16 h-16">
                    <ImageBetter
                      src={siteurl(get(local, "data.organization_logo"))}
                      alt="Logo Company"
                      className="rounded-full w-full h-full object-cover border-2 border-white"
                      defaultSrc={siteurl("/404-img.jpg")}
                    />
                  </div>
                  <div className="text-black">
                    <p className="flex items-center font-bold text-3xl	 flex-row gap-x-2">
                      {get(local, "data.name") || get(local, "data.job_name")}
                    </p>
                    <div className="h-0.5 w-full bg-black rounded-full"></div>
                    <p className="text-sm flex items-center flex-row gap-x-2">
                      {get(local, "data.for_organization_name")}
                    </p>
                  </div>
                </div>
                <div className="flex-grow"></div>
                <div className="flex flex-col gap-x-4 gap-y-2 min-w-[350px]  ">
                  <div className=""></div>

                  <div className="flex flex-row w-full">
                    <div className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-md max-w-md mx-auto">
                      <div className="hidden">
                        <h3 className="text-sm font-medium text-gray-500">
                          Salary (Rupiah)
                        </h3>
                        <p className="text-lg font-semibold text-green-600">
                          Rp
                          {formatMoney(
                            getNumber(get(local, "data.salary_min"))
                          )}{" "}
                          - Rp
                          {formatMoney(
                            getNumber(get(local, "data.salary_max"))
                          )}
                        </p>
                        <p className="text-xs text-gray-400">Monthly salary</p>
                      </div>
                      <div className="border-l border-gray-300 h-full mx-4 hidden"></div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={25}
                            height={25}
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="m15 19.923l-6-2.1l-3.958 1.53q-.384.143-.713-.083T4 18.634V6.404q0-.268.13-.489t.378-.307L9 4.077l6 2.1l3.958-1.53q.384-.143.713.054t.329.588v12.384q0 .287-.159.498q-.158.212-.426.298zm-.5-1.22v-11.7l-5-1.745v11.7zm1 0L19 17.55V5.7l-3.5 1.304zM5 18.3l3.5-1.342v-11.7L5 6.45zM15.5 7.004v11.7zm-7-1.746v11.7z"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 mt-1">
                          Job Location
                        </h3>
                        <p className="text-lg font-semibold text-gray-800">
                          {get(local, "data.for_organization_location")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {local.applied ? (
                    <ButtonBetter className=" w-full bg-gray-300 text-black hover:bg-gray-300 cursor-default		">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19 6.5h-3v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3m-9-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm10 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.05h3v1.05a1 1 0 0 0 2 0v-1.05h6v1.05a1 1 0 0 0 2 0v-1.05h3Zm0-7H4v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"
                        ></path>
                      </svg>
                      Applied
                    </ButtonBetter>
                  ) : !local.user?.verif ? (
                    <ButtonBetter
                      className={
                        "w-full text-primary bg-gradient-to-r from-blue-100 to-blue-50"
                      }
                      onClick={async (e: any) => {
                        e.stopPropagation();
                        e.preventDefault();
                        await actionToast({
                          task: async () => {
                            throw new Error(
                              "Your account has not been verified by the admin"
                            );
                          },
                          after: () => {},
                          msg_load: "Apply job ",
                          msg_error: "Apply job failed ",
                          msg_succes: "Apply job success ",
                        });
                      }}
                    >
                      <div className="flex flex-grow flex-row items-center gap-x-2 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19 6.5h-3v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3m-9-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm10 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.05h3v1.05a1 1 0 0 0 2 0v-1.05h6v1.05a1 1 0 0 0 2 0v-1.05h3Zm0-7H4v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"
                          ></path>
                        </svg>
                        Apply for this position
                      </div>
                    </ButtonBetter>
                  ) : (
                    <Alert
                      type={"save"}
                      msg={
                        "Are you sure you want to apply for this job? Please review your application before submitting. You can still make changes as long as the application form remains open."
                      }
                      onClick={async () => {
                        await actionToast({
                          task: async () => {
                            await apix({
                              port: "recruitment",
                              path: `/api/applicants/apply?job_posting_id=${id}`,
                              method: "get",
                            });
                          },
                          after: () => {
                            local.applied = true;
                            local.render();
                          },
                          msg_load: "Apply job ",
                          msg_error: "Apply job failed ",
                          msg_succes: "Apply job success ",
                        });
                      }}
                    >
                      <ButtonContainer
                        className={
                          "w-full  text-primary bg-gradient-to-r from-blue-100 to-blue-50"
                        }
                      >
                        <div className="flex flex-grow flex-row items-center gap-x-2 text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19 6.5h-3v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3m-9-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm10 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.05h3v1.05a1 1 0 0 0 2 0v-1.05h6v1.05a1 1 0 0 0 2 0v-1.05h3Zm0-7H4v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"
                            ></path>
                          </svg>
                          Apply for this position
                        </div>
                      </ButtonContainer>
                    </Alert>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-x-4 p-8">
                <div
                  className={cx(
                    "grid grid-cols-3 gap-x-4 flex-grow",
                    css`
                      .tiptap h1 {
                        font-size: 1.4rem !important;
                      }

                      .tiptap h2 {
                        font-size: 1.2rem !important;
                      }

                      .tiptap h3 {
                        font-size: 1.1rem !important;
                      }
                      .ProseMirror {
                        outline: none !important;
                        padding: 10px 2rem 10px 2rem;
                      }
                      .tiptap a {
                        font-weight: bold;
                        color: #313678;
                        text-decoration: underline;
                      }
                      .ProseMirror ul,
                      ol {
                        padding: 0 1rem;
                        margin: 1.25rem 1rem 1.25rem 0.4rem;
                      }
                      .ProseMirror ol {
                        list-style-type: decimal;
                      }
                      .ProseMirror ul {
                        list-style-type: disc;
                      }
                    `
                  )}
                >
                  <div
                    className={cx(
                      "flex flex-grow flex-col col-span-2 tiptap ProseMirror"
                    )}
                    dangerouslySetInnerHTML={{
                      __html: get(local, "data.content_description"),
                    }}
                  ></div>
                  <div className="w-full">
                    <img
                      src={siteurl(local?.data?.poster)}
                      alt="Company Logo"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <FlowbiteFooterSection />
        </div>
      </div>
    </div>
  );
}

export default Page;
