"use client";
import { sortEducationLevels } from "@/app/lib/education-level";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { Field } from "@/lib/components/form/Field";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableList } from "@/lib/components/tablelist/TableList";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

function Page() {
  const id = getParams("id");
  const labelPage = "Result Interview";
  const urlPage = `/d/interview/result-interview`;
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    can_approve: true,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
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
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {local.can_approve && (
                <Alert
                  type={"save"}
                  msg={"Are you sure you want to save this record?"}
                  onClick={() => {
                    fm.submit();
                  }}
                >
                  <ButtonContainer className={"bg-primary"}>
                    <IoCheckmarkOutline className="text-xl" />
                    Approved
                  </ButtonContainer>
                </Alert>
              )}
              {local.can_approve && (
                <Alert
                  type={"delete"}
                  msg={"Are you sure you want to delete this record?"}
                  onClick={async () => {
                    await apix({
                      port: "recruitment",
                      path: `/api/job-postings`,
                      method: "delete",
                    });
                  }}
                >
                  <ButtonContainer variant={"destructive"}>
                    <X className="text-xl" />
                    Rejected
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
          path: "/api/job-postings",
          method: "put",
          data: {
            ...fm.data,
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/test-schedule-headers/${id}`,
          validate: "object",
        });

        const question: any = await apix({
          port: "recruitment",
          value: "data.data",
          path:
            "/api/template-questions/" + "4e39968e-2e81-4533-8a74-eb73f6b90bba",
          validate: "object",
        });
        return { ...data, question };
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
                    name={"type_name"}
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
                    name={"pic_name"}
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
          <div className={cx()}>
            <div className="w-full flex flex-row">
              <div className="flex flex-grow flex-col h-[350px]">
                <TableList
                  selectionPaging={true}
                  name="job-posting"
                  header={{
                    sideLeft: (data: any) => {
                      return <></>;
                    },
                  }}
                  column={[
                    {
                      name: "id_applicant",
                      header: () => <span>ID Applicant</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "user_profile.name",
                      header: () => <span>Applicant Name</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "gpa",
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
                              getValue(row, "user_profile.work_experience")
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
                              getValue(row, "user_profile.work_experience"),
                              "company_name",
                              "company experiences"
                            )}
                          </>
                        );
                      },
                    },
                    {
                      name: "user_profile.work_experience",
                      header: () => <span>Work Experience (Year)</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getTotalExperience(getValue(row, name))}</>;
                      },
                    },
                    {
                      name: "user_profile.curriculum_vitae",
                      header: () => <span>CV</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <FilePreview
                            url={
                              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                            }
                            disabled={true}
                            limit_name={10}
                          />
                        );
                      },
                    },
                    {
                      name: "status",
                      sortable: false,
                      header: () => <span>Status Selection</span>,
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
