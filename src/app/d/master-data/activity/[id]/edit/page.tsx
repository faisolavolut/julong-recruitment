"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableList } from "@/lib/components/tablelist/TableList";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { cloneFM } from "@/lib/utils/cloneFm";
import { labelDocumentType } from "@/lib/utils/document_type";
import { getParams } from "@/lib/utils/get-params";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";

function Page() {
  const id = getParams("id");
  const labelPage = "Template Activity";
  const urlPage = `/d/master-data/activity`;
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
            <div className="flex flex-row space-x-2 items-center">
              <Alert
                type={"delete"}
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
                        path: `/api/template-activities/${id}`,
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
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const data = fm?.data;
        await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-activities/update",
          method: "put",
          data: {
            ...fm.data,
          },
        });
        console.log({ line: data?.line });
        if (data?.line?.length) {
          const lines = data.line.map((e: any) => {
            let result = {
              ...e,
              template_question_id: e?.question_template_id,
              status: e?.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
            };
            return result;
          });
          const data_line = {
            template_activity_id: id,
            template_activity_lines: lines,
            deleted_template_activity_line_ids: data?.deleted_line_ids || [],
          };
          await apix({
            port: "recruitment",
            value: "data.data",
            path: "/api/template-activity-lines",
            method: "post",
            data: data_line,
          });
        }
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-activities/" + id,
          validate: "object",
        });
        return { ...data, line: data?.template_activity_lines || [] };
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
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/recruitment-types",
                        validate: "dropdown",
                        keys: {
                          value: "value",
                          label: "value",
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
                    name={"status"}
                    label={"Status"}
                    type={"single-checkbox"}
                    onLoad={() => {
                      return [
                        {
                          label: "Active",
                          value: "ACTIVE",
                        },
                      ];
                    }}
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
                <TableList
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
                                    fm.data.line.push(data);
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
                      return (
                        <>
                          <div className="flex flex-row gap-x-2 items-center">
                            <div className="flex flex-row flex-grow space-x-2">
                              <ButtonBetter
                                onClick={async (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  const data = fm.data?.document_checking;
                                  await actionToast({
                                    task: async () => {
                                      let result = await apix({
                                        port: "recruitment",
                                        value: "data.data",
                                        path: "/api/questions",
                                        method: "post",
                                        data: {
                                          template_question_id: id,
                                          data: data,
                                          deleted_question_ids:
                                            get(fm, "data.deleted_line_ids") ||
                                            [],
                                        },
                                      });
                                    },
                                    after: () => {},
                                    msg_load: "Saving ",
                                    msg_error: "Saving failed ",
                                    msg_succes: "Saving success ",
                                  });
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={25}
                                  height={25}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7.558 3.75H7.25a3.5 3.5 0 0 0-3.5 3.5v9.827a3.173 3.173 0 0 0 3.173 3.173v0m.635-16.5v2.442a2 2 0 0 0 2 2h2.346a2 2 0 0 0 2-2V3.75m-6.346 0h6.346m0 0h.026a3 3 0 0 1 2.122.879l3.173 3.173a3.5 3.5 0 0 1 1.025 2.475v6.8a3.173 3.173 0 0 1-3.173 3.173v0m-10.154 0V15a3 3 0 0 1 3-3h4.154a3 3 0 0 1 3 3v5.25m-10.154 0h10.154"
                                  ></path>
                                </svg>
                                Save
                              </ButtonBetter>
                            </div>
                          </div>
                        </>
                      );
                    },
                  }}
                  column={[
                    {
                      name: "name",
                      sortable: false,
                      header: () => <span>Document Name</span>,
                      renderCell: ({ row, name, cell, tbl }: any) => {
                        const fm_row = cloneFM(fm, row);
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={cloneFM(fm, row)}
                              name={"name"}
                              label={"Template"}
                              type={"dropdown"}
                              onLoad={async () => {
                                const res: any = await apix({
                                  port: "recruitment",
                                  value: "data.data",
                                  path: "/api/template-questions/form-types",
                                  validate: "dropdown",
                                  keys: {
                                    value: "value",
                                    label: (item: any) => {
                                      return (
                                        labelDocumentType(get(item, "value")) ||
                                        ""
                                      );
                                    },
                                  },
                                });
                                return res;
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "template",
                      sortable: false,
                      header: () => <span>Template</span>,
                      width: 150,
                      renderCell: ({ row, name, cell }: any) => {
                        const fm_row = cloneFM(fm, row);
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={cloneFM(fm, row)}
                              name={"question_template_id"}
                              label={"Template"}
                              type={"dropdown"}
                              onLoad={async () => {
                                const res: any = await apix({
                                  port: "recruitment",
                                  value: "data.data.template_questions",
                                  path: "/api/template-questions?status=ACTIVE",
                                  validate: "dropdown",
                                  keys: {
                                    label: "name",
                                  },
                                });
                                return res;
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "colour",
                      sortable: false,
                      resize: false,
                      header: () => <span>Colour</span>,
                      width: 10,
                      renderCell: ({ row, name, cell }: any) => {
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={cloneFM(fm, row)}
                              name={"color_hex_code"}
                              label={"Colour"}
                              type={"color"}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "description",
                      sortable: false,
                      header: () => <span>Description</span>,
                      width: 150,
                      renderCell: ({ row, name, cell }: any) => {
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={cloneFM(fm, row)}
                              name={"description"}
                              label={"Colour"}
                              type={"text"}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "status",
                      sortable: false,
                      resize: false,
                      header: () => <span>Active</span>,
                      width: 10,
                      renderCell: ({ row, name, cell }: any) => {
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={cloneFM(fm, row)}
                              name={"status"}
                              label={"Status"}
                              type={"single-checkbox"}
                              onLoad={() => {
                                return [
                                  {
                                    label: "",
                                    value: "ACTIVE",
                                  },
                                ];
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "action",
                      header: () => <span>Action</span>,
                      sortable: false,
                      renderCell: ({ row, name, cell, tbl }: any) => {
                        if (false) return <></>;
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <ButtonBetter
                              className="bg-red-500"
                              onClick={() => {
                                const deleted_line_ids: any[] = Array.isArray(
                                  fm.data?.deleted_line_ids
                                )
                                  ? fm.data?.deleted_line_ids
                                  : [];
                                if (row?.id) {
                                  deleted_line_ids.push(row.id);
                                }
                                fm.data["deleted_line_ids"] = deleted_line_ids;
                                tbl.removeRow(row);
                                fm.data.line = fm.data.line.filter(
                                  (e: any) => e !== row
                                );
                                fm.render();
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
                  onLoad={fm.data.line}
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
