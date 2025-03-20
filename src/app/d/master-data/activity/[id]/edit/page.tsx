"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableEditBetter } from "@/lib/components/tablelist/TableBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { cloneFM } from "@/lib/utils/cloneFm";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { useLocal } from "@/lib/utils/use-local";
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
            status:
              fm?.data?.status === "ACTIVE" ? fm?.data?.status : "INACTIVE",
          },
        });
        if (data?.line?.length || data?.deleted_line_ids?.length) {
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
          const res = await apix({
            port: "recruitment",
            value: "data.data.template_activity_lines",
            path: "/api/template-activity-lines",
            method: "post",
            data: data_line,
          });
          fm.data.line = res;
          fm.render();
        }
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-activities/" + id,
          validate: "object",
        });
        console.log(data?.template_activity_lines || []);
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
                <div className="md:col-span-2">
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
              `,
              "flex-grow flex-col flex"
            )}
          >
            <div className="w-full flex flex-row flex-grow">
              <div className="flex flex-grow flex-col min-h-[350px]">
                <TableEditBetter
                  name="line"
                  delete_name="deleted_line_ids"
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
                      header: "Document Name",
                      renderCell: ({ row, name, cell, idx, fm_row }: any) => {
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={cloneFM(fm, row)}
                              name={"name"}
                              label={"Template"}
                              type={"text"}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "template",
                      sortable: false,
                      header: "Template",
                      renderCell: ({ row, name, cell, idx, fm_row }: any) => {
                        return (
                          <>
                            <Field
                              hidden_label={true}
                              fm={cloneFM(fm, row)}
                              target={"question_template_id"}
                              name={"template_question"}
                              label={"Template"}
                              type={"dropdown-async"}
                              onLoad={async (param: any) => {
                                const params = await events("onload-param", {
                                  ...param,
                                  status: "ACTIVE",
                                });
                                const res: any = await apix({
                                  port: "recruitment",
                                  value: "data.data.template_questions",
                                  path: `/api/template-questions${params}`,
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
                      name: "colour",
                      sortable: false,
                      resize: false,
                      header: "Colour",
                      width: 50,
                      renderCell: ({ row, name, cell, idx, fm_row }: any) => {
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
                      header: "Description",
                      width: 150,
                      renderCell: ({ row, name, cell, idx, fm_row }: any) => {
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
                      header: "Active",
                      width: 50,
                      renderCell: ({ row, name, cell, idx, fm_row }: any) => {
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

                      header: "Action",
                      filter: false,
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
