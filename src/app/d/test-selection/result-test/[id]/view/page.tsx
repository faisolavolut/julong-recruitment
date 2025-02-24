"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { events } from "@/lib/utils/event";
import { IoCheckmarkOutline } from "react-icons/io5";
import { X } from "lucide-react";
import { getValue } from "@/lib/utils/getValue";
import { TableList } from "@/lib/components/tablelist/TableList";
import { RiDownloadCloudLine } from "react-icons/ri";
import get from "lodash.get";
import { DropdownHamburgerBetter } from "@/lib/components/ui/dropdown-menu";
import { actionToast } from "@/lib/utils/action";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { sortEducationLevels } from "@/app/lib/education-level";
import { ModalImportResult } from "../ModalImportResult";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { access } from "@/lib/utils/getAccess";
import { Alert } from "@/lib/components/ui/alert";
import { IoMdSave } from "react-icons/io";
import { normalDate } from "@/lib/utils/date";
import { convertToTimeOnly } from "@/lib/components/form/field/TypeInput";

function Page() {
  const id = getParams("id");
  const labelPage = "Result Test";
  const urlPage = `/d/test-selection/result-test`;
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    can_submit: false as boolean,
    can_import_result: false as boolean,
  });
  const [open, setOpen] = useState(false as boolean);
  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.can_submit = access("submit-result-test");
      local.can_import_result = access("import-result-test");
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_edit) return notFound();

  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full">
            <div className="flex flex-col py-4 pt-0 pb-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="">{labelPage}</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: `List ${labelPage}`,
                    url: urlPage,
                  },
                  {
                    title: "View",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {local.can_submit && fm?.data?.status === "IN PROGRESS" && (
                <Alert
                  type={"save"}
                  msg={"Are you sure you want to save this record?"}
                  onClick={() => {
                    fm.data.status = "COMPLETED";
                    fm.submit();
                  }}
                >
                  <ButtonContainer className={"bg-primary"}>
                    <IoMdSave className="text-xl" />
                    Submit
                  </ButtonContainer>
                </Alert>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/test-schedule-headers/update",
          method: "put",
          data: {
            ...fm.data,
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
            schedule_date: normalDate(fm?.data?.schedule_date),
            start_time: normalDate(fm?.data?.start_date)
              ? `${normalDate(fm?.data?.start_date)} ${convertToTimeOnly(
                  fm.data.start_time
                )}:00`
              : null,
            end_time: normalDate(fm?.data?.end_date)
              ? `${normalDate(fm?.data?.end_date)} ${convertToTimeOnly(
                  fm.data.end_time
                )}:00`
              : null,
          },
        });
      }}
      mode="view"
      onLoad={async () => {
        // sekedar testing
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/test-schedule-headers/${id}`,
          validate: "object",
        });
        console.log({
          ...data,
          project_recruitment_header_id: data?.project_recruitment_header?.id,
          template_activity_line_id: data?.template_activity_line_id,
          job_posting_id: data?.job_posting?.id,
          activity: "Administration Selection",
          project_number: data?.job_posting?.document_number,
        });
        return {
          ...data,
          type_name: data?.test_type?.name,
          project_recruitment_header_id: data?.project_recruitment_header?.id,
          project_recruitment_line_id: data?.project_recruitment_line?.id,
          job_posting_id: data?.job_posting?.id,
          project_number: data?.job_posting?.document_number,
          activity: get(
            data,
            "project_recruitment_line.template_activity_line.name"
          ),
          job_name: get(data, "job_posting.job_name"),
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={"flex flex-col flex-wrap px-4 py-2"}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"document_number"}
                    label={"Document Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"schedule_date"}
                    label={"Schedule Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"type_name"}
                    label={"Select Test Type"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"project_number"}
                    label={"Project Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"activity"}
                    label={"Activity"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"start_date"}
                    label={"Start Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"end_date"}
                    label={"End Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"start_time"}
                    label={"Start Time"}
                    type={"time"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"end_time"}
                    label={"End Time"}
                    type={"time"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"location"}
                    label={"Location (Url)"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job Name"}
                    type={"text"}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"link_test"}
                    label={"Link Test"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"total_candidate"}
                    label={"Total Candidate"}
                    type={"money"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    type={"text"}
                  />
                </div>
                <div></div>
              </div>
            </div>
          </>
        );
      }}
      onFooter={(fm: any) => {
        if (!fm?.data?.id) return <></>;
        return (
          <div className={cx("flex-grow flex-col flex")}>
            <div className="w-full flex flex-col flex-grow">
              <div className="flex flex-row px-2 w-full items-center">
                <div className="grid grid-cols-2 flex-grow border-b border-gray-300 text-sm font-bold py-1">
                  <div className="flex flex-grow items-center">Test Result</div>
                  <div className="flex flex-grow  flex-row gap-x-2 justify-end"></div>
                </div>
              </div>
              <div className="flex flex-grow flex-col min-h-[350px]">
                <TableList
                  name="job-posting"
                  header={{
                    sideLeft: (data: any) => {
                      return (
                        <div className="flex flex-row flex-grow gap-x-2"></div>
                      );
                    },
                    sideRight: (data: any) => {
                      return (
                        <div className="flex flex-row flex-grow gap-x-2 ml-4">
                          <ModalImportResult
                            fm={fm}
                            open={open}
                            onChangeOpen={(e: boolean) => {
                              setOpen(e);
                            }}
                            msg="Import Result Test"
                            onUpload={async (file: any) => {
                              await apix({
                                port: "recruitment",
                                path: `/api/test-schedule-headers/read-result-template`,
                                method: "post",
                                value: "data",
                                type: "form",
                                data: {
                                  file: file,
                                },
                              });
                            }}
                          />
                          <DropdownHamburgerBetter
                            className=""
                            classNameList="w-48"
                            list={[
                              {
                                label: "Export Template",
                                icon: (
                                  <RiDownloadCloudLine className="text-xl" />
                                ),
                                onClick: async () => {
                                  await actionToast({
                                    task: async () => {
                                      const res = await apix({
                                        port: "recruitment",
                                        method: "get",
                                        value: "data",
                                        options: {
                                          responseType: "blob",
                                          headers: {
                                            Accept:
                                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Memastikan format yang benar
                                          },
                                        },
                                        path: `/api/test-schedule-headers/export-result-template?id=${id}&job_posting_id=${fm?.data?.job_posting_id}`,
                                      });
                                      const url = window.URL.createObjectURL(
                                        new Blob([res])
                                      );
                                      const link = document.createElement("a");
                                      link.href = url;
                                      link.setAttribute(
                                        "download",
                                        "template-import-test.xlsx"
                                      );
                                      document.body.appendChild(link);
                                      link.click();
                                    },
                                    msg_load: "Download Import Test",
                                    msg_error: "Download Import Test Failed",
                                    msg_succes: "Download Import Test Success",
                                  });
                                },
                              },
                              {
                                label: "Export Result",
                                icon: (
                                  <RiDownloadCloudLine className="text-xl" />
                                ),
                                onClick: async () => {
                                  await actionToast({
                                    task: async () => {
                                      const res = await apix({
                                        port: "recruitment",
                                        method: "get",
                                        value: "data",
                                        options: {
                                          responseType: "blob",
                                          headers: {
                                            Accept:
                                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Memastikan format yang benar
                                          },
                                        },
                                        path: `/api/test-schedule-headers/export-answer?id=${id}&job_posting_id=${fm?.data?.job_posting_id}`,
                                      });
                                      console.log(res);
                                      const url = window.URL.createObjectURL(
                                        new Blob([res])
                                      );
                                      const link = document.createElement("a");
                                      link.href = url;
                                      link.setAttribute(
                                        "download",
                                        "export-result-test.xlsx"
                                      );
                                      document.body.appendChild(link);
                                      link.click();
                                    },
                                    msg_load: "Download Result Test",
                                    msg_error: "Download Result Test Failed",
                                    msg_succes: "Download Result Test Success",
                                  });
                                },
                              },
                              {
                                label: "Import Result",
                                icon: (
                                  <AiOutlineCloudUpload className="text-xl" />
                                ),
                                onClick: async ({ close }: any) => {
                                  if (typeof close === "function") {
                                    close();
                                  }
                                  setOpen(true);
                                },
                              },
                            ]}
                          />
                        </div>
                      );
                    },
                  }}
                  column={[
                    {
                      name: "user_profile.name",
                      header: () => <span>Applicant Name</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "user_profile.educations",
                      header: () => <span>GPA</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <>
                            {getNumber(
                              sortEducationLevels(
                                getValue(row, "user_profile.educations"),
                                "gpa"
                              )
                            )}
                          </>
                        );
                      },
                    },
                    {
                      name: "major",
                      header: () => <span>Major</span>,
                      renderCell: ({ row, name }: any) => {
                        const major = sortEducationLevels(
                          getValue(row, "user_profile.educations"),
                          "major"
                        );
                        return <>{major ? major : "-"}</>;
                      },
                    },
                    {
                      name: "job_name",
                      header: () => <span>Job Name</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <>
                            {detectUniqueExperience(
                              getValue(row, "user_profile.work_experiences")
                            )}
                          </>
                        );
                      },
                    },
                    {
                      name: "job_experience",
                      header: () => <span>Job Experience</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <>
                            {detectUniqueExperience(
                              getValue(row, "user_profile.work_experiences"),
                              "company_name",
                              "company experiences"
                            )}
                          </>
                        );
                      },
                    },
                    {
                      name: "user_profile.work_experiences",
                      header: () => <span>Work Experience (Year)</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getTotalExperience(getValue(row, name))}</>;
                      },
                    },
                    {
                      name: "final_result",
                      header: () => <span>Status Selection</span>,
                      renderCell: ({ row }: any) => {
                        if (row.final_result === "ACCEPTED") {
                          return (
                            <div className="bg-green-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Accepted
                            </div>
                          );
                        } else if (row.final_result === "REJECTED") {
                          return (
                            <div className="bg-red-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Rejected
                            </div>
                          );
                        }
                        return (
                          <div className="bg-gray-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                            Pending
                          </div>
                        );
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap text-red-500	  rounded-md font-bold">
                            Failed
                          </div>
                        );
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <ButtonBetter>
                              <div className="flex items-center gap-x-2">
                                <IoCheckmarkOutline className="text-lg" />
                              </div>
                            </ButtonBetter>
                            <ButtonBetter variant={"destructive"}>
                              <div className="flex items-center gap-x-2">
                                <X className="text-lg" />
                              </div>
                            </ButtonBetter>
                          </div>
                        );
                      },
                    },
                  ]}
                  onLoad={async (param: any) => {
                    const params = await events("onload-param", param);
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.test_applicants",
                      path: `/api/test-applicants/test-schedule-header/${id}${params}`,
                      validate: "array",
                    });
                    return result;
                  }}
                  onCount={async () => {
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.total",
                      path: `/api/test-applicants/test-schedule-header/${id}?page=1&page_size=1`,
                      validate: "object",
                    });
                    return getNumber(result);
                  }}
                  onInit={async (list: any) => {}}
                />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

export default Page;
