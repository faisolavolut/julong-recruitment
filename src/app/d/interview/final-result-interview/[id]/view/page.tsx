"use client";
import { sortEducationLevels } from "@/app/lib/education-level";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableList } from "@/lib/components/tablelist/TableList";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { RiDownloadCloudLine } from "react-icons/ri";
import { DropdownHamburgerBetter } from "@/lib/components/ui/dropdown-menu";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { ModalImportResult } from "@/app/d/test-selection/result-test/[id]/ModalImportResult";
import { actionToast } from "@/lib/utils/action";
import { Alert } from "@/lib/components/ui/alert";
import {
  ButtonBetterTooltip,
  ButtonContainer,
} from "@/lib/components/ui/button";
import { IoMdSave } from "react-icons/io";
import { normalDate, time } from "@/lib/utils/date";
import { IoCheckmarkOutline } from "react-icons/io5";
import { X } from "lucide-react";

function Page() {
  const id = getParams("id");
  const [open, setOpen] = useState(false as boolean);
  const id_posting = getParams("id_posting");
  const labelPage = "Final Result Interview";
  const urlPage = `/d/interview/final-result-interview`;
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    can_approve: true,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.ready = true;
      // local.can_approve = access("approval-applicant-final-interview");
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_edit) return notFound();

  return (
    <FormBetter
      mode="view"
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full flex-wrap">
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
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {fm?.data?.status !== "COMPLETED" ? (
                <>
                  <Alert
                    type={"save"}
                    msg={"Are you sure you want to complete this record?"}
                    onClick={() => {
                      fm.data.status = "COMPLETED";
                      fm.render();
                      fm.submit();
                    }}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoMdSave className="text-xl" />
                      Complete
                    </ButtonContainer>
                  </Alert>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const interview_assessors = fm.data.interview_assessors;
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/interviews/update",
          method: "put",
          data: {
            ...fm.data,
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
            schedule_date: normalDate(fm?.data?.schedule_date),
            start_time: normalDate(fm?.data?.schedule_date)
              ? `${normalDate(fm?.data?.schedule_date)} ${time(
                  fm.data.start_time
                )}:00`
              : null,
            end_time: normalDate(fm?.data?.schedule_date)
              ? `${normalDate(fm?.data?.schedule_date)} ${time(
                  fm.data.end_time
                )}:00`
              : null,
            interview_assessors: Array.isArray(interview_assessors)
              ? interview_assessors.map((e) => {
                  return typeof e === "string" ? { employee_id: e } : e;
                })
              : [],
          },
        });
      }}
      onLoad={async () => {
        // sekedar testing
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/interviews/${id}`,
          validate: "object",
        });
        const assessors = data?.interview_assessors?.length
          ? data?.interview_assessors?.map((e: any) => e?.employee_name)
          : [];
        return {
          ...data,
          type_name: data?.test_type?.name,
          project_recruitment_header_id: data?.project_recruitment_header?.id,
          project_recruitment_line_id: data?.project_recruitment_line?.id,
          job_posting_id: data?.job_posting?.id,
          project_name: data?.project_recruitment_header?.name,
          project_number: data?.job_posting?.document_number,
          start_date: data?.project_recruitment_header?.start_date,
          end_date: data?.project_recruitment_header?.end_date,
          activity: get(
            data,
            "project_recruitment_line.template_activity_line.name"
          ),
          job_name: get(data, "job_posting.job_name"),
          interview_assessors_name: assessors.join(", "),
          interview_assessors: data?.interview_assessors?.length
            ? data?.interview_assessors.map((e: any) => e?.employee_id)
            : [],
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
                    required={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Name"}
                    type={"text"}
                    required={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"project_name"}
                    label={"Project Number"}
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
                    name={"job_name"}
                    label={"Job Name"}
                    type={"time"}
                    required={true}
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
                    required={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"end_time"}
                    label={"End Time"}
                    type={"time"}
                    required={true}
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
                    name={"duration"}
                    label={"Duration"}
                    type={"money"}
                    suffix={() => <div className="text-sm">Minute</div>}
                    required={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"interview_assessors"}
                    label={"Interviewer"}
                    type={"text"}
                    required={true}
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
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                  />
                </div>
                <div>
                  <Field
                    disabled={true}
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    type={"text"}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }}
      onFooter={(fm: any) => {
        if (!fm?.data?.id) return <></>;
        return (
          <div className={cx("flex-grow flex-col flex")}>
            <div className="w-full flex flex-row flex-grow">
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
                            msg="Import Result Interview"
                            onUpload={async (file: any) => {
                              await apix({
                                port: "recruitment",
                                path: `/api/interviews/read-result-template`,
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
                                        path: `/api/interviews/export-result-template?id=${id}&job_posting_id=${fm?.data?.job_posting_id}`,
                                      });
                                      const url = window.URL.createObjectURL(
                                        new Blob([res])
                                      );
                                      const link = document.createElement("a");
                                      link.href = url;
                                      link.setAttribute(
                                        "download",
                                        "template-import-interview.xlsx"
                                      );
                                      document.body.appendChild(link);
                                      link.click();
                                    },
                                    msg_load: "Download Import Interview",
                                    msg_error:
                                      "Download Import Interview Failed",
                                    msg_succes:
                                      "Download Import Interview Success",
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
                                        path: `/api/interviews/export-answers?id=${id}&job_posting_id=${fm?.data?.job_posting_id}`,
                                      });
                                      const url = window.URL.createObjectURL(
                                        new Blob([res])
                                      );
                                      const link = document.createElement("a");
                                      link.href = url;
                                      link.setAttribute(
                                        "download",
                                        "export-interview-result.xlsx"
                                      );
                                      document.body.appendChild(link);
                                      link.click();
                                    },
                                    msg_load: "Download Result Interview",
                                    msg_error:
                                      "Download Result Interview Failed",
                                    msg_succes:
                                      "Download Result Interview Success",
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
                      header: "Applicant Name",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "gpa",
                      header: "GPA",
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
                      header: "Major",
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
                      header: "Job Name",
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
                      header: "Job Experience",
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
                      header: "Work Experience (Year)",
                      renderCell: ({ row, name }: any) => {
                        return <>{getTotalExperience(getValue(row, name))}</>;
                      },
                    },
                    {
                      name: "final_result",
                      sortable: false,
                      header: "Status Selection",
                      renderCell: ({ row, render }: any) => {
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
                        } else if (!local.can_approve) {
                          return (
                            <div className="bg-gray-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Pending
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <Alert
                              type={"save"}
                              msg={`Are you sure you want to approve this applicant?`}
                              onClick={async () => {
                                await actionToast({
                                  task: async () => {
                                    await apix({
                                      port: "recruitment",
                                      value: "data.data",
                                      path: "/api/interview-applicants/update-final-result",
                                      method: "put",
                                      data: {
                                        id: row.id,
                                        final_result: "ACCEPTED",
                                      },
                                    });
                                    row.final_result = "ACCEPTED";
                                    render();
                                  },
                                  after: () => {},
                                  msg_load: "Saving result selection ",
                                  msg_error: "Failed to save result selection ",
                                  msg_succes:
                                    "Your result selection has been saved successfully! ",
                                });
                              }}
                            >
                              <ButtonBetterTooltip
                                typeButton="container"
                                tooltip={"Approve applicant"}
                              >
                                <div className="flex items-center gap-x-2">
                                  <IoCheckmarkOutline className="text-lg" />
                                </div>
                              </ButtonBetterTooltip>
                            </Alert>
                            <Alert
                              type={"save"}
                              msg={`Are you sure you want to reject this applicant?`}
                              onClick={async () => {
                                await actionToast({
                                  task: async () => {
                                    await apix({
                                      port: "recruitment",
                                      value: "data.data",
                                      path: "/api/interview-applicants/update-final-result",
                                      method: "put",
                                      data: {
                                        id: row.id,
                                        final_result: "REJECTED",
                                      },
                                    });
                                    row.final_result = "REJECTED";
                                    render();
                                  },
                                  after: () => {},
                                  msg_load: "Saving result selection ",
                                  msg_error: "Failed to save result selection ",
                                  msg_succes:
                                    "Your result selection has been saved successfully! ",
                                });
                              }}
                            >
                              <ButtonBetterTooltip
                                typeButton="container"
                                tooltip={"Reject applicant"}
                                variant={"destructive"}
                              >
                                <div className="flex items-center gap-x-2">
                                  <X className="text-lg" />
                                </div>
                              </ButtonBetterTooltip>
                            </Alert>
                          </div>
                        );
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
                      },
                    },
                  ]}
                  onLoad={async (param: any) => {
                    const params = await events("onload-param", param);
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.interview_applicants",
                      path: `/api/interview-applicants/interview/${id}${params}`,
                      validate: "array",
                    });
                    return result;
                  }}
                  onCount={async (params: any) => {
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.total",
                      path: `/api/interview-applicants/interview/${id}?page=1&page_size=1`,
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
