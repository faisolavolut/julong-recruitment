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
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { events } from "@/lib/utils/event";
import { IoCheckmarkOutline, IoEye } from "react-icons/io5";
import { X } from "lucide-react";
import { getValue } from "@/lib/utils/getValue";
import { TableList } from "@/lib/components/tablelist/TableList";
import { access } from "@/lib/utils/getAccess";
import { TooltipBetter } from "@/lib/components/ui/tooltip-better";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { actionToast } from "@/lib/utils/action";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { sortEducationLevels } from "@/app/lib/education-level";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";
import { normalDate, time } from "@/lib/utils/date";
import { IoMdSave } from "react-icons/io";

function Page() {
  const id = getParams("id");
  const labelPage = "Schedule Test";
  const urlPage = `/d/test-selection/schedule-test`;
  const local = useLocal({
    can_edit: true,
    can_delete: false,
    can_selection: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = access("edit-schedule-test");
      local.can_selection = access("approval-applicant-test-selection");
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (!local.can_edit) return notFound();

  return (
    <FormBetter
      mode="view"
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
          },
        });
      }}
      onLoad={async () => {
        // sekedar testing
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/test-schedule-headers/${id}`,
          validate: "object",
        });
        return {
          ...data,
          project_recruitment_header_id: data?.project_recruitment_header?.id,
          project_recruitment_line_id: data?.project_recruitment_line?.id,
          job_posting_id: data?.job_posting?.id,
          activity: "Administration Selection",
          project_number: data?.job_posting?.document_number,
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
                    name={"test_type_id"}
                    label={"Select Test Type"}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/test-types",
                        validate: "dropdown",
                        keys: {
                          label: "name",
                        },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"project_recruitment_header_id"}
                    label={"Project Number"}
                    onChange={() => {
                      fm.data.start_date = null;
                      fm.data.end_date = null;
                      fm.data.template_activity_line_id = null;
                      fm.data.job_posting_id = null;
                      fm.render();
                      if (
                        typeof fm?.fields?.job_posting_id?.reload === "function"
                      ) {
                        fm?.fields?.job_posting_id?.reload();
                      }
                    }}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.project_recruitment_headers",
                        path: "/api/project-recruitment-headers?status=IN PROGRESS",
                        validate: "dropdown",
                        keys: {
                          label: "document_number",
                        },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"project_recruitment_line_id"}
                    label={"Activity"}
                    type={"dropdown"}
                    disabled={
                      fm?.data?.project_recruitment_header_id ? false : true
                    }
                    onChange={(row: any) => {
                      console.log(row);
                      fm.data.start_date = row?.data?.start_date;
                      fm.data.end_date = row?.data?.end_date;
                      fm.render();
                    }}
                    required={true}
                    onLoad={async () => {
                      if (!fm?.data?.project_recruitment_header_id) return [];
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path:
                          "/api/project-recruitment-lines/header/" +
                          fm?.data?.project_recruitment_header_id,
                        validate: "dropdown",
                        keys: {
                          label: (row: any) =>
                            labelDocumentType(
                              get(row, "template_activity_line.name")
                            ) || "",
                        },
                      });
                      return res;
                    }}
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
                    disabled={
                      fm?.data?.project_recruitment_header_id ? false : true
                    }
                    name={"job_posting_id"}
                    label={"Job Name"}
                    type={"dropdown"}
                    onLoad={async () => {
                      if (!fm?.data?.project_recruitment_header_id) return [];
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.job_postings",
                        path: `/api/job-postings?status=IN PROGRESS`,
                        validate: "dropdown",
                        keys: {
                          label: (item: any) => {
                            return `${item.name || item.job_name} - ${
                              item.document_number
                            }`;
                          },
                        },
                      });
                      return res;
                    }}
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
                    name={"link"}
                    label={"Link Test"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"platform"}
                    label={"Platform"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onLoad={async () => {
                      return [
                        {
                          value: "link",
                          label: "link",
                        },
                        {
                          value: "by apps",
                          label: "by apps",
                        },
                      ];
                    }}
                    onLabel={"label"}
                    onValue={"value"}
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
                <div>
                  <Field
                    fm={fm}
                    name={"total_candidate"}
                    label={"Total Candidate"}
                    type={"money"}
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
                  feature={local.can_selection ? ["checkbox"] : []}
                  header={{
                    sideLeft: (data: any) => {
                      return (
                        <div className="flex flex-row flex-grow gap-x-2">
                          {data?.selection?.all ||
                          data?.selection?.partial?.length ? (
                            <>
                              <Alert
                                type={"save"}
                                msg={`Are you sure you want to save ${data?.selection?.partial?.length} profile?`}
                                onClick={async () => {
                                  await actionToast({
                                    task: async () => {
                                      const listData = data?.data;
                                      const result = {
                                        administrative_results: listData.map(
                                          (e: any) => {
                                            return {
                                              ...e,
                                              user: null,
                                              user_profile: null,
                                            };
                                          }
                                        ),
                                        administrative_selection_id: id,
                                        deleted_administrative_result_ids: [],
                                      };
                                      const res = await apix({
                                        port: "recruitment",
                                        value: "data.data",
                                        path: "/api/administrative-results",
                                        method: "post",
                                        data: {
                                          ...result,
                                        },
                                      });
                                    },
                                    after: () => {},
                                    msg_load: "Saving selection ",
                                    msg_error: "Failed to save selection ",
                                    msg_succes:
                                      "Your selection has been saved successfully! ",
                                  });
                                }}
                              >
                                <ButtonContainer className={"bg-primary"}>
                                  <IoCheckmarkOutline className="text-xl" />
                                  Save
                                </ButtonContainer>
                              </Alert>
                              <Alert
                                type={"delete"}
                                msg={`Are you sure you want to delete ${data?.selection?.partial?.length} profile?`}
                                onClick={async () => {
                                  await actionToast({
                                    task: async () => {
                                      const result = {
                                        administrative_results: [],
                                        administrative_selection_id: id,
                                        deleted_administrative_result_ids:
                                          data?.selection?.partial,
                                      };
                                      const res = await apix({
                                        port: "recruitment",
                                        value: "data.data",
                                        path: "/api/job-postings",
                                        method: "post",
                                        data: {
                                          ...result,
                                        },
                                      });
                                    },
                                    after: () => {},
                                    msg_load: "Delete selection ",
                                    msg_error: "Failed to delete selection ",
                                    msg_succes:
                                      "Your selection has been deleted successfully! ",
                                  });
                                }}
                              >
                                <ButtonContainer variant={"destructive"}>
                                  <X className="text-xl" />
                                  Delete
                                </ButtonContainer>
                              </Alert>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      );
                    },
                  }}
                  column={[
                    {
                      name: "id_applicant",
                      header: "ID Applicant",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
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
                        if (!local.can_selection) {
                          return (
                            <div className="bg-gray-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Pending
                            </div>
                          );
                        }
                      },
                    },
                    {
                      name: "action",

                      header: "Action",
                      filter: false,
                      sortable: false,
                      renderCell: ({ row }: any) => {
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <TooltipBetter content="View Profile Applicant">
                              <ButtonLink
                                className="bg-primary"
                                href={`/d/test-selection/schedule-test/${id}/${row.user_profile_id}/applicant`}
                              >
                                <div className="flex items-center gap-x-2">
                                  <IoEye className="text-lg" />
                                </div>
                              </ButtonLink>
                            </TooltipBetter>
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
                  onCount={async (params: any) => {
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
