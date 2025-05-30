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
import { flattenObject } from "@/lib/utils/flattenObject";
import ImageBetter from "@/lib/components/ui/Image";
import { get_user } from "@/lib/utils/get_user";

function Page() {
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
    user: null as any,
    avatar: siteurl("/dog.jpg"),
    file: null as any,
    redirect: null as any,
  });

  useEffect(() => {
    const run = async () => {
      const res = await apix({
        port: "recruitment",
        value: "data.data",
        path: "/api/user-profiles/user",
        method: "get",
      });
      const redirect_apply_job = localStorage.getItem("redirect_apply_job");
      if (redirect_apply_job) {
        local.redirect = JSON.parse(redirect_apply_job);
      }
      local.user = res;
      local.verif = res?.status !== "ACTIVE" ? false : true;
      local.can_add = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    local.avatar = URL.createObjectURL(file);
    local.file = file;
    local.render();
    await actionToast({
      task: async () => {
        await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/user-profiles/update-avatar",
          method: "put",
          type: "form",
          data: {
            id: local.user?.id,
            avatar: file,
          },
        });
      },
      after: () => {
        location.reload();
      },
      msg_load: "Update avatar ",
      msg_error: "Update avatar failed ",
      msg_succes: "Update avatar success ",
    });
  };
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
          <div className="w-16 h-16 rounded-full relative overflow-hidden border-2 border-white">
            <ImageBetter
              src={siteurl(get_user("profile.avatar"))}
              alt="Profile"
              className=" w-full h-full object-cover "
              defaultSrc={siteurl("/404-img.jpg")}
            />
            <label
              htmlFor="dropzone-file"
              className="text-white text-center absolute bottom-0 left-0 h-full flex flex-row items-center justify-center w-full text-xs  hover:bg-black/60  text-center py-1 cursor-pointer"
            >
              Click to Upload
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
              />
            </label>
          </div>
          <div className="text-white">
            <div className="flex flex-row gap-x-2">
              <h1 className="text-lg font-semibold"> {local?.user?.name} </h1>
            </div>
            <p className="text-sm flex items-center  flex-row gap-x-2">
              <MdOutlineLocationOn />
              {local?.user?.address ? local?.user?.address : "No Address"}
            </p>
            <p className="text-sm flex items-center flex-row gap-x-2">
              <IoMdMail />
              {local?.user?.user?.email}
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
            if (!fm.data?.educations?.length) {
              throw new Error("Minimum 1 educations");
            }
            let result = flattenObject(data) as any;
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
            if (local.redirect && local.redirect?.path) {
              navigate(local.redirect?.path);
              localStorage.removeItem("redirect_apply_job");
            }
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
                          required={true}
                          fm={fm}
                          name={"name"}
                          label={"Full Name"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          required={true}
                          fm={fm}
                          name={"address"}
                          label={"Address"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          required={true}
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
                          name={"religion"}
                          label={"Religion"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          required={true}
                          fm={fm}
                          name={"age"}
                          label={"Age"}
                          type={"money"}
                        />
                      </div>
                      <div>
                        <Field
                          required={true}
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
                          required={true}
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
                          required={true}
                          name={"birth_place"}
                          label={"Birth Place"}
                          type={"text"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          required={true}
                          name={"birth_date"}
                          label={"Birth Date"}
                          type={"date"}
                        />
                      </div>
                      {/* <div>
                        <Field
                          fm={fm}
                          required={true}
                          name={"ktp"}
                          label={"KTP"}
                          type={"upload"}
                        />
                      </div> */}
                      <div>
                        <Field
                          fm={fm}
                          name={"bilingual"}
                          label={"Can you speak mandarin?"}
                          type={"dropdown"}
                          onLoad={() => {
                            return [
                              {
                                value: "yes",
                                label: "Yes",
                              },
                              {
                                value: "no",
                                label: "No",
                              },
                            ];
                          }}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          required={true}
                          name={"curriculum_vitae"}
                          label={"CV"}
                          type={"upload"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          required={true}
                          name={"expected_salary"}
                          label={"Expected Salary"}
                          type={"money"}
                        />
                      </div>
                      <div>
                        <Field
                          fm={fm}
                          name={"current_salary"}
                          label={"Current Salary"}
                          type={"money"}
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
                            <div className="md:col-span-2">
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
                                      value: "S3",
                                    },
                                    {
                                      label: "2 - Master Degree",
                                      value: "S2",
                                    },
                                    {
                                      label: "3 - Bachelor",
                                      value: "S1",
                                    },
                                    {
                                      label: "4 - Diploma 1",
                                      value: "D1",
                                    },
                                    {
                                      label: "5 - Diploma 2",
                                      value: "D2",
                                    },
                                    {
                                      label: "6 - Diploma 3",
                                      value: "D3",
                                    },
                                    {
                                      label: "7 - Diploma 4",
                                      value: "D4",
                                    },
                                    {
                                      label: "8 - Elementary School",
                                      value: "SD",
                                    },
                                    {
                                      label: "9 - Senior High School",
                                      value: "SMA",
                                    },
                                    {
                                      label: "10 - Junior High School",
                                      value: "SMP",
                                    },
                                    {
                                      label: "11 - Unschooled",
                                      value: "TS",
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
                                onChange={() => {}}
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
                                name={"end_date"}
                                label={"Date of Graduation"}
                                type={"date"}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm_row}
                                name={"graduate_year"}
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
