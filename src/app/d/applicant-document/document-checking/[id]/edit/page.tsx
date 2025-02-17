"use client";
import { getParams } from "@/lib/utils/get-params";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoIosSend, IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { actionToast } from "@/lib/utils/action";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";
import { DropdownHamburgerBetter } from "@/lib/components/ui/dropdown-menu";
import { IoCheckmarkOutline } from "react-icons/io5";
import { TbEyeEdit } from "react-icons/tb";
import { X } from "lucide-react";
import { RiDownloadCloudLine } from "react-icons/ri";
import { TableEditBetter } from "@/lib/components/tablelist/TableBetter";
import { HiPlus } from "react-icons/hi";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import { getValue } from "@/lib/utils/getValue";

function Page() {
  const id = getParams("id");
  const labelPage = "Contract Document";
  const urlPage = "/d/applicant-document/document-checking";
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
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row gap-x-2 items-center">
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
              <DropdownHamburgerBetter
                className=""
                classNameList="w-48"
                list={[
                  {
                    label: "Submit",
                    icon: <IoMdSave className="text-xl" />,
                    onClick: async () => {
                      fm.data.status = "PENDING";
                      fm.submit();
                    },
                    msg: "Are you sure you want to submit this record?",
                    alert: true,
                  },
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
                    label: "Download Document",
                    icon: <RiDownloadCloudLine className="text-xl" />,
                    onClick: async () => {},
                  },
                  {
                    label: "Send",
                    icon: <IoIosSend className="text-xl" />,
                    onClick: async () => {
                      fm.data.status = "PENDING";
                      fm.submit();
                    },
                    msg: "Are you sure you want to send this offer letter to the applicant?",
                    alert: true,
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
                            path: `/api/document-sending/${id}`,
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
          path: "/api/document-verification-headers/update",
          method: "put",
          data: {
            ...fm.data,
          },
        });
        const lines = fm?.data?.document_verification_lines || [];
        const lines_data = {
          document_verification_header_id: fm?.data?.id,
          document_verification_lines: lines || [],
          deleted_document_verification_line_ids:
            fm?.data?.deleted_document_verification_line_ids || [],
        };
        await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-verification-lines",
          method: "post",
          data: lines_data,
        });
        fm.reload();
      }}
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
                      if (true)
                        return (
                          <>
                            <div className="flex flex-row gap-x-2 items-center">
                              <div className="flex flex-row flex-grow space-x-2">
                                <ButtonBetter
                                  className="bg-primary"
                                  onClick={() => {
                                    const data = {};
                                    tbl.addRow(data);
                                    tbl.render();
                                    fm.render();
                                  }}
                                >
                                  <div className="flex items-center gap-x-0.5">
                                    <HiPlus className="text-md" />
                                    <span className="capitalize">Add New</span>
                                  </div>
                                </ButtonBetter>
                              </div>
                            </div>
                          </>
                        );
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
                    {
                      name: "action",
                      header: () => <span>Action</span>,
                      sortable: false,
                      renderCell: ({ row, tbl }: any) => {
                        if (false) return <></>;
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <ButtonBetter
                              className="bg-red-500"
                              onClick={() => {
                                tbl.removeRow(row);
                              }}
                            >
                              <div className="flex items-center">
                                <MdDelete />
                              </div>
                            </ButtonBetter>
                          </div>
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
