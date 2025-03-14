"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { Alert } from "@/lib/components/ui/alert";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { events } from "@/lib/utils/event";
import { getValue } from "@/lib/utils/getValue";
import { TableList } from "@/lib/components/tablelist/TableList";
import { actionToast } from "@/lib/utils/action";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { sortEducationLevels } from "@/app/lib/education-level";
import { normalDate } from "@/lib/utils/date";
import { get_user } from "@/lib/utils/get_user";
import { time } from "console";

function Page() {
  const id = getParams("id");
  const labelPage = "Schedule FGD";
  const urlPage = `/d/fgd/schedule-fgd`;
  const local = useLocal({
    can_edit: false,
    can_delete: false,
    can_selection: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.can_delete = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_edit && !local.can_delete) return notFound();

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
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {local.can_edit && fm.data?.status === "DRAFT" && (
                <>
                  <Alert
                    type={"save"}
                    msg={"Are you sure you want to submit this record?"}
                    onClick={() => {
                      fm.data.status = "IN PROGRESS";
                      fm.render();
                      fm.submit();
                    }}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoMdSave className="text-xl" />
                      Submit
                    </ButtonContainer>
                  </Alert>
                  <Alert
                    type={"save"}
                    msg={"Are you sure you want to save this record?"}
                    onClick={() => {
                      fm.submit();
                    }}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoMdSave className="text-xl" />
                      Save
                    </ButtonContainer>
                  </Alert>
                  <Alert
                    type={"delete"}
                    msg={"Are you sure you want to delete this record?"}
                    onClick={async () => {
                      await actionToast({
                        task: async () => {
                          await apix({
                            port: "recruitment",
                            path: `/api/fgd-schedules/${id}`,
                            method: "delete",
                          });
                        },
                        after: () => {
                          navigate(urlPage);
                        },
                        msg_load: "Delete ",
                        msg_error: "Delete failed ",
                        msg_succes: "Delete success ",
                      });
                    }}
                  >
                    <ButtonContainer variant={"destructive"}>
                      <MdDelete className="text-xl" />
                      Delete
                    </ButtonContainer>
                  </Alert>
                </>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const fgd_schedule_assessors = fm.data.fgd_schedule_assessors;
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/fgd-schedules/update",
          method: "put",
          data: {
            ...fm.data,
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
            schedule_date: normalDate(fm?.data?.schedule_date),
            start_time: normalDate(fm?.data?.start_date)
              ? `${normalDate(fm?.data?.start_date)} ${time(
                  fm.data.start_time
                )}:00`
              : null,
            end_time: normalDate(fm?.data?.end_date)
              ? `${normalDate(fm?.data?.end_date)} ${time(fm.data.end_time)}:00`
              : null,
            fgd_schedule_assessors: Array.isArray(fgd_schedule_assessors)
              ? fgd_schedule_assessors.map((e) => {
                  return typeof e === "string" ? { employee_id: e } : e;
                })
              : [],
          },
        });
        if (fm.data?.status !== "DRAFT") navigate(`${urlPage}/${id}/view`);
      }}
      onLoad={async () => {
        // sekedar testing
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/fgd-schedules/${id}`,
          validate: "object",
        });

        if (data?.status !== "DRAFT") navigate(`${urlPage}/${id}/view`);
        return {
          ...data,
          project_recruitment_header_id: data?.project_recruitment_header?.id,
          project_recruitment_line_id: data?.project_recruitment_line?.id,
          job_posting_id: data?.job_posting?.id,
          activity: "Administration Selection",
          start_date: data?.project_recruitment_header?.start_date,
          end_date: data?.project_recruitment_header?.end_date,
          project_number: data?.job_posting?.document_number,
          fgd_schedule_assessors: data?.fgd_assessors?.length
            ? data?.fgd_assessors.map((e: any) => e?.employee_id)
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
                    target={"project_recruitment_header_id"}
                    name={"project_recruitment_header"}
                    label={"Project Number"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onChange={() => {
                      fm.data.start_date = null;
                      fm.data.end_date = null;
                      fm.data.project_recruitment_line_id = null;
                      fm.data.job_posting_id = null;
                      fm.data.template_activity_line_id = null;
                      fm.data.project_pic_id = null;
                      fm.render();
                      if (
                        typeof fm?.fields?.job_posting?.reload === "function"
                      ) {
                        fm?.fields?.job_posting?.reload();
                      }

                      if (
                        typeof fm?.fields?.project_recruitment_line?.reload ===
                        "function"
                      ) {
                        fm?.fields?.project_recruitment_line?.reload();
                      }
                    }}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", {
                        ...param,
                        status: "IN PROGRESS",
                      });
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: `/api/project-recruitment-headers/pic${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"document_number"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    target={"project_recruitment_line_id"}
                    name={"project_recruitment_line"}
                    label={"Activity"}
                    type={"dropdown-async"}
                    autoRefresh={true}
                    disabled={
                      fm?.data?.project_recruitment_header_id ? false : true
                    }
                    required={true}
                    pagination={false}
                    search={"local"}
                    onChange={(row: any) => {
                      const pic = row?.data.project_pics || [];
                      const id_pic = pic.find(
                        (e: any) => e?.employee_id === get_user("employee.id")
                      );
                      fm.data.project_pic_id = id_pic?.id;
                      fm.data.start_date = row?.data?.start_date;
                      fm.data.end_date = row?.data?.end_date;
                      fm.data.template_activity_line_id =
                        row.data?.template_activity_line_id;
                      fm.render();
                    }}
                    onLoad={async (param: any) => {
                      if (!fm?.data?.project_recruitment_header_id) return [];
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: `/api/project-recruitment-lines/header-pic/${fm?.data?.project_recruitment_header_id}${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={(row: any) =>
                      labelDocumentType(
                        get(row, "template_activity_line.name")
                      ) || ""
                    }
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    disabled={
                      fm?.data?.project_recruitment_header_id ? false : true
                    }
                    target={"job_posting_id"}
                    name={"job_posting"}
                    label={"Job Name"}
                    type={"dropdown-async"}
                    autoRefresh={true}
                    required={true}
                    pagination={false}
                    search={"local"}
                    onLoad={async (param: any) => {
                      if (!fm?.data?.project_recruitment_header_id) return [];
                      const params = await events("onload-param", {
                        ...param,
                        status: "IN PROGRESS",
                      });
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: `/api/job-postings/project-recruitment-header/${fm?.data?.project_recruitment_header_id}${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={(item: any) =>
                      `${item.name || item.job_name} - ${item.document_number}`
                    }
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
                    name={"location_link"}
                    label={"Location (Url)"}
                    type={"text"}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"fgd_schedule_assessors"}
                    label={"User Assessment"}
                    type={"multi-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const result: any = await apix({
                        port: "portal",
                        value: "data.data.employees",
                        path: `/api/employees${params}`,
                        validate: "array",
                      });
                      let res = result?.length
                        ? result.map((e: any) => {
                            return {
                              employee_id: e?.id,
                              employee_name: e?.name,
                            };
                          })
                        : [];
                      return res;
                    }}
                    onValue={"employee_id"}
                    onLabel={"employee_name"}
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
                      return <></>;
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
                      name: "user_profile.curriculum_vitae",
                      header: "CV",
                      renderCell: ({ row, name }: any) => {
                        return (
                          <FilePreview
                            url={getValue(row, name)}
                            disabled={true}
                            limit_name={10}
                          />
                        );
                      },
                    },
                    {
                      name: "status",
                      sortable: false,
                      header: "Status Selection",
                      renderCell: ({ row, render }: any) => {
                        if (row.status === "APPROVED") {
                          return (
                            <div className="bg-green-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Approved
                            </div>
                          );
                        } else if (row.status === "REJECTED") {
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
                      value: "data.data.fgd_applicants",
                      path: `/api/fgd-applicants/fgd-schedule/${id}${params}`,
                      validate: "array",
                    });
                    return result;
                  }}
                  onCount={async (params: any) => {
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.total",
                      path: `/api/fgd-applicants/fgd-schedule/${id}?page=1&page_size=1`,
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
