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
import { access } from "@/lib/utils/getAccess";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";
import { normalDate } from "@/lib/utils/date";
import { get_user } from "@/lib/utils/get_user";

function Page() {
  const labelPage = "Schedule Test";
  const urlPage = `/d/test-selection/schedule-test`;
  const local = useLocal({
    can_view: true,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_view = access("create-schedule-test");
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (!local.can_view) return notFound();

  return (
    <FormBetter
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
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/test-schedule-headers",
          method: "post",
          data: {
            ...fm.data,
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
            schedule_date: normalDate(fm?.data?.schedule_date),
            start_time: normalDate(fm?.data?.schedule_date)
              ? `${normalDate(fm?.data?.schedule_date)} ${
                  fm.data.start_time
                }:00`
              : null,
            end_time: normalDate(fm?.data?.schedule_date)
              ? `${normalDate(fm?.data?.schedule_date)} ${fm.data.end_time}:00`
              : null,
          },
        });
        if (res) navigate(`${urlPage}/${res?.id}/edit`);
      }}
      onLoad={async () => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/test-schedule-headers/document-number",
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
                    target={"test_type_id"}
                    name={"test_type"}
                    label={"Select Test Type"}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", {
                        ...param,
                      });
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.test_types",
                        path: `/api/test-types${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"name"}
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
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                    required={true}
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
    />
  );
}

export default Page;
