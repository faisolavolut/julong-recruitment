"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { Alert } from "@/lib/components/ui/alert";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";

function Page() {
  const labelPage = "Document Checking";
  const urlPage = "/d/applicant-document/document-checking";
  const local = useLocal({
    can_add: true as boolean,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.ready = true;
      local.render();
    };
    run();
  }, []);

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
          path: "/api/document-verification-headers",
          method: "post",
          data: {
            ...fm.data,
          },
        });

        const lines = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-verifications/template-question/${fm?.data?.template_question_id}`,
          method: "get",
        });
        const maps = lines.map((e: any) => {
          return {
            document_verification_id: e?.id,
          };
        });
        const data_line = {
          document_verification_header_id: res?.id,
          document_verification_lines: maps,
          deleted_document_verification_line_ids: [],
        };
        try {
          await apix({
            port: "recruitment",
            value: "data.data",
            path: "/api/document-verification-lines",
            method: "post",
            data: data_line,
          });
        } catch (ex) {}
        if (res) navigate(`${urlPage}/${res?.id}/edit`);
      }}
      onLoad={async () => {
        return {
          status: "DRAFT",
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
                    target="job_posting_id"
                    name={"job_posting"}
                    label={"Job Name"}
                    required={true}
                    type={"dropdown-async"}
                    onChange={({ data }) => {
                      fm.data.project_recruitment_header_id =
                        data?.project_recruitment_header_id;
                      fm.data.project_number =
                        data?.project_recruitment_header?.document_number;
                      fm.data.for_organization_id = data?.for_organization_id;
                      fm.data.for_organization = {
                        id: data?.for_organization_id,
                        name: data?.for_organization_name,
                      };
                      fm.render();
                    }}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", {
                        ...param,
                        status: "IN PROGRESS",
                      });
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.job_postings",
                        path: `/api/job-postings${params}`,
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
                    name={"project_number"}
                    label={"Project Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    target={"project_recruitment_line_id"}
                    name={"project_recruitment_line"}
                    label={"Activity"}
                    disabled={
                      fm?.data?.project_recruitment_header_id ? false : true
                    }
                    required={true}
                    autoRefresh={true}
                    type={"dropdown-async"}
                    onChange={({ data }) => {
                      fm.data.order = data?.order;
                      fm.data.template_question_id =
                        data?.template_activity_line?.question_template_id;
                      fm.data.applicant = null;
                      fm.data.applicant_id = null;
                      fm.render();
                      if (
                        typeof get(fm, "fields.applicant.reload") === "function"
                      ) {
                        fm.fields.applicant.reload();
                      }
                    }}
                    pagination={false}
                    search={"local"}
                    onLoad={async (param: any) => {
                      if (!fm?.data?.project_recruitment_header_id) return [];
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path:
                          "/api/project-recruitment-lines/header/" +
                          fm?.data?.project_recruitment_header_id +
                          params,
                        validate: "array",
                      });
                      return res;
                    }}
                    onValue={(option) => option.id}
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
                    target={"applicant_id"}
                    name={"applicant"}
                    autoRefresh={true}
                    label={"Recipient's Name"}
                    disabled={
                      fm?.data?.project_recruitment_line_id &&
                      fm?.data?.job_posting_id
                        ? false
                        : true
                    }
                    type={"dropdown-async"}
                    onChange={({ data }) => {
                      fm.data.email = data?.user_profile?.user?.email;
                    }}
                    onLoad={async (param: any) => {
                      if (
                        !fm?.data?.project_recruitment_line_id ||
                        !fm?.data?.job_posting_id
                      )
                        return [];
                      const params = await events("onload-param", {
                        ...param,
                        order: fm?.data?.order,
                      });
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.applicants",
                        path: `/api/applicants/job-posting/${fm?.data?.job_posting_id}${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"user_profile.name"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    type={"text"}
                    disabled={true}
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
