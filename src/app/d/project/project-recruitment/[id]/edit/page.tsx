"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { Alert } from "@/lib/components/ui/alert";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { getParams } from "@/lib/utils/get-params";
import { actionToast } from "@/lib/utils/action";
import { normalDate } from "@/lib/utils/date";
import { getLine } from "@/app/lib/job-posting";
import { labelDocumentType } from "@/lib/utils/document_type";
import { events } from "@/lib/utils/event";
import { TableEditBetter } from "@/lib/components/tablelist/TableBetter";

function Page() {
  const id = getParams("id");
  const labelPage = "Project Recruitment";
  const urlPage = `/d/project/project-recruitment`;
  const local = useLocal({
    can_edit: false,
    can_delete: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.can_delete = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_edit && !local.can_delete) return notFound();

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
              {fm?.btn_ready ? (
                <>
                  {" "}
                  {fm?.data?.status === "DRAFT" && local.can_edit && (
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
                  )}
                  {fm?.data?.status === "DRAFT" && (
                    <Alert
                      type={"save"}
                      msg={"Are you sure you want to save this record?"}
                      onClick={() => {
                        fm.data.status = "IN PROGRESS";
                        fm.submit();
                      }}
                    >
                      <ButtonContainer className={"bg-primary"}>
                        <IoMdSave className="text-xl" />
                        Submit
                      </ButtonContainer>
                    </Alert>
                  )}
                  {local.can_delete && (
                    <Alert
                      type={"delete"}
                      msg={"Are you sure you want to delete this record?"}
                      onClick={async () => {
                        await actionToast({
                          task: async () => {
                            await apix({
                              port: "recruitment",
                              path: `/api/project-recruitment-headers/${id}`,
                              method: "delete",
                            });
                          },
                          after: () => {
                            navigate("/d/project/project-recruitment");
                          },
                          msg_load: "Delete ",
                          msg_error: "Delete ",
                          msg_succes: "Delete successfully! ",
                        });
                      }}
                    >
                      <ButtonContainer variant={"destructive"}>
                        <MdDelete className="text-xl" />
                        Delete
                      </ButtonContainer>
                    </Alert>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const lines = fm?.data?.line;
        if (lines?.length) {
          const prm = {
            deleted_project_recruitment_line_ids: fm.data?.del_ids || [],
            project_recruitment_header_id: id,
            project_recruitment_lines: lines.map((e: any) => {
              return {
                ...e,
                end_date: normalDate(e?.end_date),
                start_date: normalDate(e?.start_date),
                project_pics: e.pic?.length
                  ? e.pic.map((e: any) => {
                      return {
                        employee_id: e?.id,
                      };
                    })
                  : [],
              };
            }),
          };
          await apix({
            port: "recruitment",
            value: "data.data",
            path: "/api/project-recruitment-lines",
            method: "post",
            data: {
              ...prm,
            },
          });
        }
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/project-recruitment-headers/update",
          method: "put",
          data: {
            ...fm.data,
            start_date: normalDate(fm.data?.start_date),
            end_date: normalDate(fm.data?.end_date),
            document_date: normalDate(fm?.data?.document_date),
          },
        });
        fm.reload();
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/project-recruitment-headers/${id}`,
          validate: "object",
        });
        const lineData = data?.project_recruitment_lines || [];
        const ids = lineData.map((e: any) => e?.id);
        const line: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/template-activity-lines/template-activity/${data?.template_activity_id}`,
          validate: "array",
        });
        let lines = lineData || [];
        let del_ids: any[] = [];
        if (Array.isArray(line) && line.length && !lines?.length) {
          const result = line.map((e, idx) => {
            return {
              template_activity_line_id: e?.id,
              template_activity_line: e,
              name: e?.name,
              order:
                e?.template_question?.form_type === "ADMINISTRATIVE_SELECTION"
                  ? 1
                  : idx + 1,
            };
            ``;
          });
          lines = result;
        } else if (lines?.length) {
          lines = lines.map((e: any, idx: number) => {
            return {
              ...e,
              template_activity_line_id: e?.template_activity_id,
              name: e?.template_activity_line?.name,
              end_date: normalDate(e?.end_date),
              start_date: normalDate(e?.start_date),
              pic: e?.project_pics?.length
                ? e.project_pics.map((e: any) => {
                    return {
                      ...e,
                      name: e?.employee_name,
                      id: e?.employee_id,
                    };
                  })
                : [],
            };
          });
        }
        return {
          ...data,
          line: lines,
          del_ids,
          ready: true,
          project_pic: data?.project_pic_id
            ? {
                id: data.project_pic_id,
                name: data.project_pic_name,
              }
            : null,
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
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>{" "}
                <div>
                  <Field
                    fm={fm}
                    target={"project_pic_id"}
                    name={"project_pic"}
                    label={"PIC"}
                    type={"dropdown-async"}
                    onLoad={async (param) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data.employees",
                        path: "/api/employees" + params,
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
                    name={"document_number"}
                    label={"Document Number"}
                    type={"text"}
                    disabled={true}
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
                    target={"template_activity_id"}
                    name={"template_activity"}
                    label={"Template"}
                    type={"dropdown-async"}
                    onChange={() => {
                      const run = async () => {
                        if (typeof id === "string") {
                          await getLine(
                            fm?.data?.template_activity_id,
                            fm,
                            "line",
                            "deleted_line_ids"
                          );
                          fm.data.ready = false;
                          fm.render();
                          setTimeout(() => {
                            fm.data.ready = true;
                            fm.render();
                          }, 100);
                        }
                      };
                      run();
                    }}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.template_activities",
                        path: `/api/template-activities${params}`,
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
        if (!fm?.data?.ready) return <></>;
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
                      return <></>;
                    },
                    sideRight: (tbl: any) => {
                      return (
                        <>
                          <div className="flex flex-row gap-x-2 items-center px-2">
                            <div className="flex flex-row flex-grow space-x-2">
                              <ButtonBetter
                                onClick={async (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  await actionToast({
                                    task: async () => {
                                      await getLine(
                                        fm?.data?.template_activity_id,
                                        fm,
                                        "line",
                                        "deleted_line_ids"
                                      );
                                      fm.data.ready = false;
                                      fm.render();
                                      setTimeout(() => {
                                        fm.data.ready = true;
                                        fm.render();
                                      }, 100);
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
                                Generate
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
                      header: "Name",
                      renderCell: ({ fm_row }: any) => {
                        return <>{labelDocumentType(fm_row?.data?.name)}</>;
                      },
                    },
                    {
                      name: "pic",
                      width: 200,
                      sortable: false,
                      header: "PIC",
                      renderCell: ({ fm_row }: any) => {
                        return (
                          <>
                            <Field
                              fm={fm_row}
                              hidden_label={true}
                              name={"pic"}
                              label={"PIC"}
                              type={"multi-async"}
                              onLoad={async (param: any) => {
                                const params = await events(
                                  "onload-param",
                                  param
                                );
                                const result: any = await apix({
                                  port: "portal",
                                  value: "data.data.employees",
                                  path: `/api/employees${params}`,
                                  validate: "array",
                                });
                                return result;
                              }}
                              onValue={"id"}
                              onLabel={"name"}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "start_date",
                      sortable: false,
                      header: "Start Date",
                      renderCell: ({ fm_row, name }: any) => {
                        return (
                          <>
                            <Field
                              fm={fm_row}
                              hidden_label={true}
                              name={name}
                              required={true}
                              label={""}
                              type={"date"}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "end_date",
                      sortable: false,
                      header: "End Date",
                      renderCell: ({ fm_row, name }: any) => {
                        return (
                          <>
                            <Field
                              fm={fm_row}
                              hidden_label={true}
                              required={true}
                              name={name}
                              label={""}
                              type={"date"}
                            />
                          </>
                        );
                      },
                    },
                  ]}
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
