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
import { normalDate } from "@/lib/utils/date";

function Page() {
  const labelPage = "Job Posting";
  const urlPage = `/d/job/job-posting`;
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
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/job-postings",
          method: "post",
          type: "form",
          data: {
            ...fm.data,
            document_date: normalDate(fm?.data?.document_date),
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
          },
        });
        if (res) navigate(`${urlPage}/${res?.id}/edit`);
      }}
      onLoad={async () => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/job-postings/document-number",
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
                    target={"project_recruitment_header_id"}
                    name={"project_recruitment_header"}
                    label={"No. Reference Project"}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.project_recruitment_headers",
                        path: `/api/project-recruitment-headers${params}`,
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
                    name={"document_date"}
                    label={"Document Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"document_number"}
                    label={"Document No."}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/recruitment-types",
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"value"}
                    onValue={"value"}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    target="mp_request_id"
                    name={"mp_request"}
                    label={"MPR Document No"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onChange={(item: any) => {
                      const data = item?.data;
                      fm.data["job_id"] = data?.job_id;
                      fm.data["job_name"] = data?.job_name;
                      fm.data["for_organization_location_id"] =
                        data?.for_organization_location_id;
                      fm.render();
                    }}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.mp_request_header",
                        path: `/api/mp-requests${params}`,
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
                    name={"job_name"}
                    label={"Job Position"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"start_date"}
                    label={"Start Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"end_date"}
                    label={"End Date"}
                    type={"date"}
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
                <div>
                  <Field
                    fm={fm}
                    name={"link"}
                    label={"Link Job Posting"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    target={"for_organization_id"}
                    name={"for_organization"}
                    label={"Company"}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data.organizations",
                        path: `/api/organizations${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"name"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"salary_min"}
                    label={"Minimal Range Salary"}
                    type={"money"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"salary_max"}
                    label={"Maximal Range Salary"}
                    type={"money"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"organization_logo"}
                    label={"Logo Company"}
                    type={"upload"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"poster"}
                    label={"Poster Recruitment"}
                    type={"upload"}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"content_description"}
                    label={"Description Post a Job"}
                    type={"richtext"}
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
