"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { Alert } from "@/lib/components/ui/alert";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";
import { get_user } from "@/lib/utils/get_user";
import { normalDate } from "@/lib/utils/date";

function Page() {
  const labelPage = "Schedule Interview";
  const urlPage = `/d/interview/schedule-interview`;
  const local = useLocal({
    can_add: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_add = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_add) return notFound();

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
                    title: "New",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
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
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const interview_assessors = fm.data.interview_assessors;
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/interviews",
          method: "post",
          data: {
            ...fm.data,
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
            schedule_date: normalDate(fm?.data?.schedule_date),
            start_time: normalDate(fm?.data?.start_date)
              ? `${normalDate(fm?.data?.start_date)} ${fm.data.start_time}:00`
              : null,
            end_time: normalDate(fm?.data?.end_date)
              ? `${normalDate(fm?.data?.end_date)} ${fm.data.end_time}:00`
              : null,
            interview_assessors: Array.isArray(interview_assessors)
              ? interview_assessors.map((e) => {
                  return typeof e === "string" ? { employee_id: e } : e;
                })
              : [],
          },
        });
        if (res) navigate(`${urlPage}/${res?.id}/edit`);
      }}
      onLoad={async () => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/interviews/document-number",
        });
        return {
          status: "DRAFT",
          document_number: res,
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
                    name={"project_recruitment_header_id"}
                    label={"Project Number"}
                    onChange={() => {
                      fm.data.start_date = null;
                      fm.data.end_date = null;
                      fm.data.project_recruitment_line_id = null;
                      fm.data.job_posting_id = null;
                      fm.data.template_activity_line_id = null;
                      fm.data.project_pic_id = null;
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
                        value: "data.data",
                        path: "/api/project-recruitment-headers/pic?status=IN PROGRESS",
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
                    required={true}
                    onLoad={async () => {
                      if (!fm?.data?.project_recruitment_header_id) return [];
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path:
                          "/api/project-recruitment-lines/header-pic/" +
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
                        value: "data.data",
                        path: `/api/job-postings/project-recruitment-header/${fm?.data?.project_recruitment_header_id}?status=IN PROGRESS`,
                        validate: "dropdown",
                        keys: {
                          label: "job_name",
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
                    name={"range_duration"}
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
                    type={"multi-dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data.employees",
                        path: "/api/employees",
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
    />
  );
}

export default Page;
