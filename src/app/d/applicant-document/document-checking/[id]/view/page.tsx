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
import { MdDelete } from "react-icons/md";
import { actionToast } from "@/lib/utils/action";
import { X } from "lucide-react";
import { TbEyeEdit } from "react-icons/tb";
import { IoCheckmarkOutline } from "react-icons/io5";
import { DropdownHamburgerBetter } from "@/lib/components/ui/dropdown-menu";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";

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
              <DropdownHamburgerBetter
                className=""
                classNameList="w-48"
                list={[
                  {
                    label: "Completed",
                    icon: <IoCheckmarkOutline className="text-xl" />,
                    msg: "Are you sure you want to completed this record?",
                    alert: true,
                    onClick: async () => {
                      fm.data.status = "APPROVED";
                      fm.submit();
                    },
                  },
                  {
                    label: "Revise",
                    icon: <TbEyeEdit className="text-xl" />,
                    msg: "Are you sure you want to revise this record?",
                    alert: true,
                    onClick: async () => {
                      fm.data.status = "REVISED";
                      fm.submit();
                    },
                  },
                  {
                    label: "Rejected",
                    icon: <X className="text-xl" />,
                    msg: "Are you sure you want to rejected this record?",
                    alert: true,
                    onClick: async () => {
                      fm.data.status = "REJECTED";
                      fm.submit();
                    },
                  },
                  {
                    label: "Delete",
                    icon: <MdDelete className="text-xl" />,
                    className: "text-red-500",
                    onClick: async () => {
                      await actionToast({
                        task: async () => {
                          await apix({
                            port: "recruitment",
                            path: `/api/document-verification-headers/${id}`,
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
                    },
                    msg: "Are you sure you want to delete this record?",
                    alert: true,
                  },
                ]}
              />
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-sending/update",
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
        console.log(data);
        return {
          ...data,
          email: data?.applicant?.user_profile?.user?.email,
          project_number:
            data?.job_posting?.project_recruitment_header?.document_number,
          project_recruitment_header_id:
            data?.job_posting?.project_recruitment_header_id,
          recruitment_type: data?.job_posting?.recruitment_type,
          for_organization_id: data?.job_posting?.for_organization_id,
          organization_location_id: data?.organization_location_id,
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
                    name={"job_posting_id"}
                    label={"Job Name"}
                    required={true}
                    type={"dropdown"}
                    onChange={({ data }) => {
                      fm.data.project_recruitment_header_id =
                        data?.project_recruitment_header_id;
                      fm.data.project_number =
                        data?.project_recruitment_header?.document_number;
                      fm.data.for_organization_id = data?.for_organization_id;
                      fm.render();
                    }}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.job_postings",
                        path: "/api/job-postings?status=IN PROGRESS",
                        validate: "dropdown",
                        keys: {
                          label: (item: any) => {
                            return `${item.job_name} - ${item.document_number}`;
                          },
                        },
                      });
                      return res;
                    }}
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
                    name={"project_recruitment_line_id"}
                    label={"Activity"}
                    disabled={
                      fm?.data?.project_recruitment_header_id ? false : true
                    }
                    required={true}
                    type={"dropdown"}
                    onChange={({ data }) => {
                      fm.data.order = data?.order;
                      fm.data.template_question_id =
                        data?.template_activity_line?.question_template_id;
                      fm.render();
                    }}
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
                    name={"applicant_id"}
                    label={"Recipient's Name"}
                    disabled={
                      fm?.data?.project_recruitment_line_id &&
                      fm?.data?.job_posting_id
                        ? false
                        : true
                    }
                    type={"dropdown"}
                    onChange={({ data }) => {
                      fm.data.email = data?.user_profile?.user?.email;
                    }}
                    onLoad={async () => {
                      if (
                        !fm?.data?.project_recruitment_line_id ||
                        !fm?.data?.job_posting_id
                      )
                        return [];
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.applicants",
                        path: `/api/applicants/job-posting/${fm?.data?.job_posting_id}?order=${fm?.data?.order}`,
                        validate: "dropdown",
                        keys: { label: "user_profile.name" },
                      });
                      return res;
                    }}
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
              `
            )}
          >
            <div className="w-full flex flex-row">
              <div className="flex flex-grow flex-col h-[350px]">
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
                      header: () => <span>Document Name</span>,
                      renderCell: ({ row, name, cell, idx, fm_row }: any) => {
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={fm_row}
                              name={"document_verification_id"}
                              label={""}
                              type={"dropdown"}
                              onLoad={async () => {
                                const res: any = await apix({
                                  port: "recruitment",
                                  value: "data.data.document_verifications",
                                  path: "/api/document-verifications",
                                  validate: "dropdown",
                                  keys: {
                                    label: "name",
                                  },
                                });
                                console.log({ res });
                                return res;
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "path",
                      sortable: false,
                      header: () => <span>File</span>,
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
