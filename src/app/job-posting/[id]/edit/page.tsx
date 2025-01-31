"use client";
import { getParams } from "@/lib/utils/get-params";

import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { CiEdit } from "react-icons/ci";

import { siteurl } from "@/lib/utils/siteurl";
import get from "lodash.get";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { getNumber } from "@/lib/utils/getNumber";
import { Skeleton } from "@/lib/components/ui/Skeleton";
import { Field } from "@/lib/components/form/Field";
import { Form } from "@/lib/components/form/Form";
import { Alert } from "@/lib/components/ui/alert";
import { IoMdSave } from "react-icons/io";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const local = useLocal({
    open: false,
    ready: false,
    access: true,
    jobs: [] as any[],
    data: null as any,
    applied: false,
    edit: false,
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
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  return (
    <div className="flex flex-col max-w-screen bg-white">
      <div className="flex flex-row py-2 items-center bg-white shadow-sm px-2 sticky top-0 z-50 justify-center">
        <div className="grid grid-cols-5 max-w-screen-xl items-center w-full">
          <Link
            href={siteurl("/d/job/job-posting")}
            className="flex flex-row items-center px-4 gap-x-2"
          >
            <FaAngleLeft />
            <div>Preview</div>
          </Link>
          <div className="flex flex-row flex-grow items-center justify-center col-span-3"></div>

          <div className="flex items-center gap-3 lg:order-2 justify-end"></div>
        </div>
      </div>
      {local.ready ? (
        <>
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
                        <img
                          src={siteurl("/dog.jpg")}
                          alt="John Cena"
                          className="rounded-full w-full h-full object-cover border-2 border-white"
                        />
                      </div>
                      <div className="text-black">
                        <p className="flex items-center font-bold text-3xl	 flex-row gap-x-2">
                          {get(local, "data.job_name")}
                        </p>
                        <div className="h-0.5 w-full bg-black rounded-full"></div>
                        <p className="text-sm flex items-center flex-row gap-x-2">
                          {get(local, "data.for_organization_name")}
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex flex-col px-10 gap-x-4 gap-y-2">
                      <div className=""></div>

                      <ButtonBetter className="bg-second text-black hover:bg-second">
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
                      </ButtonBetter>
                      <div className="flex flex-row">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-md max-w-md mx-auto">
                          <div>
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
                            <p className="text-xs text-gray-400">
                              Monthly salary
                            </p>
                          </div>
                          <div className="border-l border-gray-300 h-full mx-4"></div>
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
                      {local.edit ? (
                        <>
                          <div
                            className={cx(
                              "flex flex-grow flex-col col-span-2 tiptap ProseMirror"
                            )}
                          >
                            <Form
                              header={(fm: any) => {
                                return (
                                  <div className="flex flex-row w-full justify-end">
                                    <div className="flex flex-row space-x-2 items-center">
                                      <Alert
                                        type={"save"}
                                        msg={
                                          "Are you sure you want to save this record?"
                                        }
                                        onClick={() => {
                                          fm.submit();
                                        }}
                                      >
                                        <ButtonContainer
                                          className={"bg-primary"}
                                        >
                                          <IoMdSave className="text-xl" />
                                          Save
                                        </ButtonContainer>
                                      </Alert>
                                    </div>
                                  </div>
                                );
                              }}
                              onSubmit={async (fm: any) => {
                                const data = fm.data;

                                data["deleted_organization_logo"] = "false";
                                data["deleted_poster"] = "false";
                                if (!data?.organization_logo) {
                                  data["deleted_organization_logo"] = "true";
                                }
                                if (!data?.poster) {
                                  data["deleted_poster"] = "true";
                                }
                                if (
                                  typeof data?.organization_logo === "string"
                                ) {
                                  delete data["organization_logo"];
                                }
                                if (typeof data?.poster === "string") {
                                  delete data["poster"];
                                }
                                const res = await apix({
                                  port: "recruitment",
                                  value: "data.data",
                                  path: "/api/job-postings/update",
                                  method: "put",
                                  type: "form",
                                  data: {
                                    ...data,
                                  },
                                });
                                local.data.content_description =
                                  fm.data?.content_description;
                                local.edit = false;
                                local.render();
                              }}
                              onLoad={async () => {
                                return { ...local?.data };
                              }}
                              showResize={false}
                              children={(fm: any) => {
                                return (
                                  <>
                                    <div
                                      className={cx(
                                        "flex flex-row flex-wrap py-2"
                                      )}
                                    >
                                      <div className="flex-grow grid gap-4">
                                        <div>
                                          <Field
                                            fm={fm}
                                            name={"content_description"}
                                            type={"richtext"}
                                            hidden_label={true}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={cx(
                              "flex flex-grow flex-col col-span-2 tiptap ProseMirror"
                            )}
                          >
                            <div className="flex flex-row w-full justify-end">
                              <div
                                className="flex flex-row text-sm items-center cursor-pointer gap-x-2 px-4 py-2 font-bold bg-primary rounded-md text-white"
                                onClick={() => {
                                  local.edit = true;
                                  local.render();
                                }}
                              >
                                Edit
                                <CiEdit />
                              </div>
                            </div>
                            <div
                              className="flex flex-grow flex-col"
                              dangerouslySetInnerHTML={{
                                __html: get(local, "data.content_description"),
                              }}
                            ></div>
                          </div>
                        </>
                      )}
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
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-grow flex-row items-center justify-center">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row gap-x-2">
                <Skeleton className="h-24 flex-grow" />
                <Skeleton className="h-24 flex-grow" />
              </div>
              <Skeleton className="h-24 w-[230px]" />
              <div className="flex flex-row gap-x-2">
                <Skeleton className="h-24 flex-grow" />
                <Skeleton className="h-24 flex-grow" />
              </div>
              <Skeleton className="h-24 w-[230px]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
