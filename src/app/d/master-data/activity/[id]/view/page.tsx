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
          path: "/api/template-activities",
          method: "put",
          data: {
            ...fm.data,
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-activities/" + id,
          validate: "object",
        });
        return { ...data, line: [{}] };
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
                      renderCell: ({ row, name, cell, tbl }: any) => {
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
                                  value: "data.data",
                                  path: "/api/template-questions/form-types",
                                  validate: "dropdown",
                                  keys: {
                                    value: "value",
                                    label: (item: any) => {
                                      switch (get(item, "value")) {
                                        case "ADMINISTRATIVE_SELECTION":
                                          return "Administrative";
                                          break;
                                        case "TEST":
                                          return "Test";
                                          break;

                                        case "INTERVIEW":
                                          return "Interview";
                                          break;

                                        case "SURAT_PENGANTAR_MASUK":
                                          return "Surat Pengantar Masuk";
                                          break;
                                        case "SURAT_IZIN_ORANG_TUA":
                                          return "Surat Izin Orang Tua";
                                          break;
                                        case "FGD":
                                          return "FGD";
                                          break;

                                        case "FINAL_INTERVIEW":
                                          return "Final Interview";
                                          break;

                                        case "OFFERING_LETTER":
                                          return "Offering Letter";
                                          break;

                                        case "CONTRACT_DOCUMENT":
                                          return "Contract Document";
                                          break;

                                        case "DOCUMENT_CHECKING":
                                          return "Document Checking";
                                          break;

                                        default:
                                          return get(item, "value");
                                      }
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
                                  value: "data.data",
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
                              name={"colour"}
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
                  ]}
                  onLoad={async (param: any) => {
                    return fm.data.line || [];
                  }}
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
