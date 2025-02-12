"use client";
import { Field } from "@/lib/components/form/Field";
import { ButtonBetter } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdMail } from "react-icons/io";
import { siteurl } from "@/lib/utils/siteurl";
import { TabHeader } from "@/lib/components/tablist/TabHeader";
import get from "lodash.get";
import { Form } from "@/lib/components/form/Form";
import { cloneFM } from "@/lib/utils/cloneFm";
import { actionToast } from "@/lib/utils/action";
import { MdOutlineLocationOn } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import { flattenObject } from "@/lib/utils/flattenObject";

function Page() {
  const labelPage = "Job Posting";
  const urlPage = `/d/job/job-posting`;
  const list = [
    { id: "profile", name: "Profile" },
    { id: "work_experience", name: "Work Experience" },
    { id: "educational_background", name: "Educational Background" },
    { id: "skill", name: "Skill" },
  ];
  const local = useLocal({
    can_add: false,
    ready: false as boolean,
    tab: get(list, "[0].id"),
    fm: null as any,
    verif: false,
  });

  useEffect(() => {
    const run = async () => {
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
      local.can_add = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_add) return notFound();

  return (
    <div className="flex flex-col flex-grow">
      <div
        className={cx(
          "bg-gradient-to-r from-blue-500 to-blue-700 p-6  flex items-center space-x-4 shadow-lg bg-no-repeat bg-cover	bg-center	",
          css`
            background-image: url("${siteurl("/frame.jpg")}");
          `
        )}
      >
        <div className="flex flex-row px-10 gap-x-4">
          <div className="w-16 h-16">
            <img
              src={siteurl("/dog.jpg")}
              alt="John Cena"
              className="rounded-full w-full h-full object-cover border-2 border-white"
            />
          </div>
          <div className="text-white">
            <div className="flex flex-row gap-x-2">
              <h1 className="text-lg font-semibold">John Cena </h1>
              {local.verif ? (
                <div className="flex flex-row gap-x-2 items-center justify-center rounded-full bg-blue-500 text-xs px-2">
                  <GoVerified /> Verified
                </div>
              ) : (
                <div className="flex flex-row gap-x-2 items-center justify-center rounded-full bg-amber-500 text-xs px-2">
                  Unverified
                </div>
              )}
            </div>
            <p className="text-sm flex items-center  flex-row gap-x-2">
              <MdOutlineLocationOn />
              Surabaya, Indonesia
            </p>
            <p className="text-sm flex items-center flex-row gap-x-2">
              <IoMdMail />
              johncena@gmail.com
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row px-4 py-6 justify-between">
        <div>
          <TabHeader
            disabledPagination={true}
            onLabel={(row: any) => {
              return row.name;
            }}
            onValue={(row: any) => {
              return row.id;
            }}
            onLoad={list}
            onChange={(tab: any) => {
              local.tab = tab?.id;
              local.render();
            }}
            tabContent={(data: any) => {
              return <></>;
            }}
          />
        </div>
        <div>
          <ButtonBetter
            onClick={async (event) => {
              // let result =
              await actionToast({
                task: async () => {
                  local.fm.submit();
                },
                after: () => {},
                msg_load: "Saving ",
                msg_error: "Saving failed ",
                msg_succes: "Saving success ",
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7.558 3.75H7.25a3.5 3.5 0 0 0-3.5 3.5v9.827a3.173 3.173 0 0 0 3.173 3.173v0m.635-16.5v2.442a2 2 0 0 0 2 2h2.346a2 2 0 0 0 2-2V3.75m-6.346 0h6.346m0 0h.026a3 3 0 0 1 2.122.879l3.173 3.173a3.5 3.5 0 0 1 1.025 2.475v6.8a3.173 3.173 0 0 1-3.173 3.173v0m-10.154 0V15a3 3 0 0 1 3-3h4.154a3 3 0 0 1 3 3v5.25m-10.154 0h10.154"
              ></path>
            </svg>
            Save
          </ButtonBetter>
        </div>
      </div>
      <div className="flex flex-col flex-grow px-4">
        <Form
          onInit={(fm: any) => {
            local.fm = fm;
            local.render();
          }}
          onSubmit={async (fm: any) => {
            const data = {
              ...fm.data,
            };
            delete data["user"];
            let result = flattenObject(data) as any;
            console.log(result);
            const res = await apix({
              port: "recruitment",
              value: "data.data",
              path: "/api/user-profiles",
              method: "post",
              type: "form",
              data: {
                ...result,
              },
            });
          }}
          onLoad={async () => {
            const data = await apix({
              port: "recruitment",
              value: "data.data",
              path: "/api/user-profiles/user",
            });
            return {
              ...data,
              bilingual: data?.bilingual ? data?.bilingual : "no",
              email: data?.user?.email,
            };
          }}
          showResize={false}
          header={(fm: any) => {
            return <></>;
          }}
          children={(fm: any) => {
            if (local.tab === "profile") {
              return (
                <>
                  <div className={"flex flex-col flex-wrap px-4 py-2 pb-8"}>
                    <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                      <div>
                        <Field
                          fm={fm}
                          name={"name"}
                          label={"Full Name"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"address"}
                          label={"Address"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"marital_status"}
                          label={"Marital Status"}
                          type={"dropdown"}
                          onLoad={() => {
                            return [
                              {
                                value: "single",
                                label: "Single",
                              },
                              {
                                value: "married",
                                label: "Married",
                              },
                              {
                                value: "any",
                                label: "No Rules",
                              },
                            ];
                          }}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"age"}
                          label={"Age"}
                          type={"money"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"email"}
                          label={"Email"}
                          type={"text"}
                          disabled={true}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"phone_number"}
                          label={"Contact"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"gender"}
                          label={"Gender"}
                          type={"dropdown"}
                          onLoad={() => {
                            return [
                              {
                                value: "MALE",
                                label: "Male",
                              },
                              {
                                value: "FEMALE",
                                label: "Female",
                              },
                            ];
                          }}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"birth_place"}
                          label={"Birth Place"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"birth_date"}
                          label={"Birth Date"}
                          type={"date"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"ktp"}
                          label={"KTP"}
                          type={"upload"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"bilingual"}
                          label={"Skill Bilingual"}
                          type={"dropdown"}
                          onLoad={() => {
                            return [
                              {
                                value: "yes",
                                label: "Bilingual",
                              },
                              {
                                value: "no",
                                label: "Non Bilingual",
                              },
                            ];
                          }}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"curriculum_vitae"}
                          label={"CV"}
                          type={"upload"}
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            } else if (local.tab === "work_experience") {
              return (
                <>
                  <div className={"flex flex-col flex-wrap px-4 py-2 pb-8"}>
                    {fm.data?.work_experiences?.length >= 1 &&
                      fm.data.work_experiences.map((e: any, idx: number) => {
                        const fm_row = cloneFM(fm, e);
                        return (
                          <div
                            className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 border-b pb-4 border-gray-200"
                            key={`work_experiences-${idx}`}
                          >
                            <div>
                              <Field
                                fm={fm_row}
                                name={"name"}
                                label={"Job Experience"}
                                type={"text"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"company_name"}
                                label={"Company Name"}
                                type={"text"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"year_experience"}
                                label={"Year Experience"}
                                type={"text"}
                              />
                            </div>
                            <div className="col-span-2">
                              <Field
                                fm={fm_row}
                                name={"job_description"}
                                label={"Job Description"}
                                type={"textarea"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"certificate"}
                                label={"Certificate of Employee (SK)"}
                                type={"upload"}
                              />
                            </div>
                          </div>
                        );
                      })}
                    <div>
                      <ButtonBetter
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const data = fm?.data?.work_experiences || [];
                          data.push({});
                          fm.data.work_experiences = data;
                          fm.render();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={25}
                          height={25}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            strokeWidth={1.5}
                            d="M6 12h12m-6 6V6"
                          ></path>
                        </svg>
                        Add New
                      </ButtonBetter>
                    </div>
                  </div>
                </>
              );
            } else if (local.tab === "educational_background") {
              return (
                <>
                  <div className={"flex flex-col flex-wrap px-4 py-2 pb-8"}>
                    {fm.data?.educations?.length >= 1 &&
                      fm.data.educations.map((e: any, idx: number) => {
                        const fm_row = cloneFM(fm, e);
                        return (
                          <div
                            className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 border-b pb-4 border-gray-200"
                            key={`educations-${idx}`}
                          >
                            <div>
                              {/* <Field
                                fm={fm_row}
                                name={"education_level"}
                                label={"Education Level"}
                                type={"text"}
                              /> */}
                              <Field
                                fm={fm_row}
                                name={"education_level"}
                                label={"Education Level"}
                                type={"dropdown"}
                                onLoad={() => {
                                  return [
                                    {
                                      label: "1 - Doctoral / Professor",
                                      value: "1 - Doctoral / Professor",
                                    },
                                    {
                                      label: "2 - Master Degree",
                                      value: "2 - Master Degree",
                                    },
                                    {
                                      label: "3 - Bachelor",
                                      value: "3 - Bachelor",
                                    },
                                    {
                                      label: "4 - Diploma 1",
                                      value: "4 - Diploma 1",
                                    },
                                    {
                                      label: "5 - Diploma 2",
                                      value: "5 - Diploma 2",
                                    },
                                    {
                                      label: "6 - Diploma 3",
                                      value: "6 - Diploma 3",
                                    },
                                    {
                                      label: "7 - Diploma 4",
                                      value: "7 - Diploma 4",
                                    },
                                    {
                                      label: "8 - Elementary School",
                                      value: "8 - Elementary School",
                                    },
                                    {
                                      label: "9 - Senior High School",
                                      value: "9 - Senior High School",
                                    },
                                    {
                                      label: "10 - Junior High School",
                                      value: "10 - Junior High School",
                                    },
                                    {
                                      label: "11 - Unschooled",
                                      value: "11 - Unschooled",
                                    },
                                  ];
                                }}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                allowNew={true}
                                name={"school_name"}
                                label={"School or College Name"}
                                type={"dropdown"}
                                onChange={() => {
                                  console.log(fm_row);
                                }}
                                onLoad={async () => {
                                  const res: any = await apix({
                                    port: "recruitment",
                                    value: "data.data",
                                    path: "/api/universities",
                                    validate: "dropdown",
                                    keys: {
                                      value: "name",
                                      label: "name",
                                    },
                                  });
                                  return res;
                                }}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"major"}
                                label={"Major"}
                                type={"text"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"graduation_year"}
                                label={"Graduation Year"}
                                type={"money"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"gpa"}
                                label={"GPA"}
                                type={"money"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"certificate"}
                                label={"Certificate of School (SK)"}
                                type={"upload"}
                              />
                            </div>
                          </div>
                        );
                      })}
                    <div>
                      <ButtonBetter
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const data = fm?.data?.educations || [];
                          data.push({});
                          fm.data.educations = data;
                          fm.render();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={25}
                          height={25}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            strokeWidth={1.5}
                            d="M6 12h12m-6 6V6"
                          ></path>
                        </svg>
                        Add New
                      </ButtonBetter>
                    </div>
                  </div>
                </>
              );
            } else if (local.tab === "skill") {
              return (
                <>
                  <div className={"flex flex-col flex-wrap px-4 py-2 pb-8"}>
                    {fm.data?.skills?.length >= 1 &&
                      fm.data.skills.map((e: any, idx: number) => {
                        const fm_row = cloneFM(fm, e);
                        return (
                          <div
                            className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 border-b pb-4 border-gray-200"
                            key={`educations-${idx}`}
                          >
                            <div>
                              <Field
                                fm={fm_row}
                                name={"name"}
                                label={"Name"}
                                type={"text"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"description"}
                                label={"Description"}
                                type={"textarea"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"level"}
                                label={"Level"}
                                type={"rating"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"certificate"}
                                label={"Certificate"}
                                type={"upload"}
                              />
                            </div>
                          </div>
                        );
                      })}
                    <div>
                      <ButtonBetter
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const data = fm?.data?.skills || [];
                          data.push({});
                          fm.data.skills = data;
                          fm.render();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={25}
                          height={25}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            strokeWidth={1.5}
                            d="M6 12h12m-6 6V6"
                          ></path>
                        </svg>
                        Add New
                      </ButtonBetter>
                    </div>
                  </div>
                </>
              );
            }
            return (
              <>
                <div className={"flex flex-col flex-wrap px-4 py-2"}></div>
              </>
            );
          }}
        />
      </div>
    </div>
  );
}

export default Page;
