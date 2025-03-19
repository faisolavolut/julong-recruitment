"use client";
import { getParams } from "@/lib/utils/get-params";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { getValue } from "@/lib/utils/getValue";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import { TableEditBetter } from "@/lib/components/tablelist/TableBetter";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";
import { Alert } from "@/lib/components/ui/alert";
import { ButtonContainer } from "@/lib/components/ui/button";
import { IoMdSave } from "react-icons/io";
import { events } from "@/lib/utils/event";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const labelPage = "Document Checking";
  const urlPage = `/d/applicant-document/document-checking`;
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
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
                    title: "View",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row gap-x-2 items-center">
              {fm?.data?.status !== "COMPLETED" ? (
                <>
                  {" "}
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
                      Completed
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
        await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-verification-headers/update",
          method: "put",
          data: {
            ...fm.data,
          },
        });
      }}
      mode="view"
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-verification-headers/${id}`,
          validate: "object",
        });
        return {
          ...data,
          email: data?.applicant?.user_profile?.user?.email,
          project_number:
            data?.job_posting?.project_recruitment_header?.document_number,
          project_recruitment_header_id:
            data?.job_posting?.project_recruitment_header_id,
          recruitment_type: data?.job_posting?.recruitment_type,

          for_organization_id: data?.job_posting?.for_organization_id,
          for_organization: {
            id: data?.job_posting?.for_organization_id,
            name: data?.job_posting?.for_organization_name,
          },
          organization_location_id: data?.organization_location_id,
          organization_location: {
            id: data?.organization_location_id,
            name: data?.organization_location_name,
          },
          document_number: data?.document_number,
          job_posting_id: data?.job_posting_id,
          order: data?.project_recruitment_line?.order,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      className="h-full"
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
                    type={"status"}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }}
      // mode="view"
      onFooter={(fm: any) => {
        if (!fm?.data?.id) return <></>;
        return (
          <div
            className={cx(
              css`
                .tbl-search {
                  display: none !important;
                }
                .tbl-pagination {
                  display: none !important;
                }
              `,
              "flex-grow flex-col flex"
            )}
          >
            <div className="w-full flex flex-row flex-grow">
              <div className="flex flex-grow flex-col min-h-[350px]">
                <TableEditBetter
                  name="document_verification_lines"
                  delete_name="deleted_document_verification_line_ids"
                  fm={fm}
                  disabledHoverRow={true}
                  disabledPagination={true}
                  header={{
                    sideLeft: (tbl: any) => {
                      return <></>;
                    },
                    sideRight: (tbl: any) => {
                      return <></>;
                    },
                  }}
                  column={[
                    {
                      name: "name",
                      sortable: false,
                      header: "Document Name",
                      renderCell: ({ row, name, cell, idx, fm_row }: any) => {
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={fm_row}
                              target={"document_verification_id"}
                              name={"document_verification"}
                              label={""}
                              type={"dropdown-async"}
                              onLoad={async (param: any) => {
                                const res: any = await apix({
                                  port: "recruitment",
                                  value: "data.data.document_verifications",
                                  path: "/api/document-verifications",
                                  validate: "array",
                                });
                                return res;
                              }}
                              onLabel={"name"}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "path",
                      sortable: false,
                      header: "Respon",
                      renderCell: ({ row, name }: any) => {
                        if (row?.document_verification?.format === "text") {
                          return <>{getValue(row, "answer")}</>;
                        }
                        return (
                          <FilePreview
                            url={getValue(row, name)}
                            disabled={true}
                            limit_name={10}
                          />
                        );
                      },
                    },
                  ]}
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
