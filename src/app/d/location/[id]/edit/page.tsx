"use client";
import { Field } from "@/lib/components/form/Field";
import { Form } from "@/lib/components/form/Form";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableList } from "@/lib/components/tablelist/TableList";
import { Alert } from "@/lib/components/ui/alert";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/components/ui/alert-dialog";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { PreviewImagePopup } from "@/lib/components/ui/previewImage";
import { statusMpp } from "@/constants/status-mpp";
import { actionToast } from "@/lib/utils/action";
import api from "@/lib/utils/axios";
import { cloneFM } from "@/lib/utils/cloneFm";
import { normalDate, shortDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { get_user } from "@/lib/utils/get_user";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { AlertTriangle, X } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { FiInfo } from "react-icons/fi";
import { GoInfo } from "react-icons/go";
import { HiDocumentDownload, HiPlus } from "react-icons/hi";
import { IoMdSave } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

function Page() {
  const local = useLocal({
    can_save: false,
    can_submit: false,
    can_edit: true,
    can_process: false,
    can_delete: false,
  });
  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_save = getAccess("edit-mpp", roles);
      local.can_submit = getAccess("submit-mpp", roles);
      local.can_edit = getAccess("edit-mpp", roles);
      local.can_delete = getAccess("delete-mpp", roles);
      local.render();
    };
    run();
  }, []);
  if (!local.can_edit) {
    notFound();
  }
  const id = getParams("id");
  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full">
            <div className="flex flex-col py-4 pt-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="">Manpower Planning Overview</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: "List Manpower Planning Overview",
                    url: "/d/location",
                  },
                  {
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2">
              {fm.data?.history?.length && (
                <Alert
                  className={"max-w-3xl"}
                  type={"save"}
                  content={
                    <>
                      <AlertDialogHeader className="flex flex-row items-center">
                        <AlertDialogTitle className="flex-grow">
                          History Notes
                        </AlertDialogTitle>

                        <AlertDialogCancel className="m-0 p-1 h-auto">
                          <X className="h-4 w-4" />
                        </AlertDialogCancel>
                      </AlertDialogHeader>

                      <div
                        className={cx(
                          "h-[300px] flex flex-col",
                          css`
                            .tbl-search {
                              display: none !important;
                            }
                            .head-tbl-list {
                              display: none;
                            }
                            .tbl-pagination {
                              display: none !important;
                            }
                          `
                        )}
                      >
                        <TableList
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
                              name: "approver_name",
                              header: () => <span>Sender</span>,
                              renderCell: ({ row, name, cell, tbl }: any) => {
                                return <>{getValue(row, name)}</>;
                              },
                            },
                            {
                              name: "status",
                              header: () => <span>Status</span>,
                              renderCell: ({ row, name, cell, tbl }: any) => {
                                return (
                                  <div className="uppercase">
                                    {getValue(row, name)}
                                  </div>
                                );
                              },
                            },
                            {
                              name: "created_at",
                              header: () => <span>Datetime</span>,
                              renderCell: ({ row, name, cell, tbl }: any) => {
                                return <>{shortDate(getValue(row, name))}</>;
                              },
                            },
                            {
                              name: "notes",
                              header: () => <span>Notes</span>,
                              renderCell: ({ row, name, cell, tbl }: any) => {
                                return (
                                  <div className="uppercase">
                                    {getValue(row, name)}
                                  </div>
                                );
                              },
                            },

                            {
                              name: "action",
                              header: () => <span>Action</span>,
                              sortable: false,
                              renderCell: ({ row, name, cell }: any) => {
                                if (!row?.attachments?.length) return <></>;
                                return (
                                  <div className="flex items-center flex-row gap-x-2 whitespace-nowrap">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <div>
                                          <ButtonContainer variant={"outline"}>
                                            <div className="flex items-center gap-x-2">
                                              <IoEye className="text-lg" />
                                            </div>
                                          </ButtonContainer>
                                        </div>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-5xl  flex flex-col">
                                        <DialogHeader>
                                          <DialogTitle>List File</DialogTitle>
                                          <DialogDescription className="hidden"></DialogDescription>
                                        </DialogHeader>
                                        <div className="flex items-center flex-row space-x-2 flex-grow">
                                          <div
                                            className={cx(
                                              "h-[300px] flex flex-col flex-grow",
                                              css`
                                                .tbl-search {
                                                  display: none !important;
                                                }
                                                .head-tbl-list {
                                                  display: none;
                                                }
                                                .tbl-pagination {
                                                  display: none !important;
                                                }
                                              `
                                            )}
                                          >
                                            <TableList
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
                                                  name: "file_name",
                                                  header: () => (
                                                    <span>Filename</span>
                                                  ),
                                                  renderCell: ({
                                                    row,
                                                    name,
                                                    cell,
                                                    tbl,
                                                  }: any) => {
                                                    return (
                                                      <>{getValue(row, name)}</>
                                                    );
                                                  },
                                                },
                                                {
                                                  name: "action",
                                                  header: () => (
                                                    <span>Action</span>
                                                  ),
                                                  sortable: false,
                                                  renderCell: ({
                                                    row,
                                                    name,
                                                    cell,
                                                  }: any) => {
                                                    const type = getValue(
                                                      row,
                                                      "file_type"
                                                    )
                                                      ? getValue(
                                                          row,
                                                          "file_type"
                                                        ).startsWith("image/")
                                                      : false;

                                                    if (type)
                                                      return (
                                                        <div className="flex items-center flex-row gap-x-2 whitespace-nowrap">
                                                          <PreviewImagePopup
                                                            url={getValue(
                                                              row,
                                                              "file_path"
                                                            )}
                                                            children={
                                                              <div>
                                                                <ButtonContainer
                                                                  variant={
                                                                    "outline"
                                                                  }
                                                                >
                                                                  <div className="flex items-center gap-x-2">
                                                                    <IoEye className="text-lg" />
                                                                  </div>
                                                                </ButtonContainer>
                                                              </div>
                                                            }
                                                          />
                                                        </div>
                                                      );

                                                    return (
                                                      <>
                                                        <div className="flex items-center flex-row gap-x-2 whitespace-nowrap">
                                                          <ButtonBetter
                                                            variant={"outline"}
                                                            onClick={() => {
                                                              window.open(
                                                                getValue(
                                                                  row,
                                                                  "file_path"
                                                                ),
                                                                "_blank"
                                                              );
                                                            }}
                                                          >
                                                            <div className="flex items-center gap-x-2">
                                                              <IoEye className="text-lg" />
                                                            </div>
                                                          </ButtonBetter>
                                                        </div>
                                                      </>
                                                    );
                                                  },
                                                },
                                              ]}
                                              onLoad={async (param: any) => {
                                                return row.attachments || [];
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                );
                              },
                            },
                          ]}
                          onLoad={async (param: any) => {
                            const params = await events("onload-param", param);
                            const res: any = await api.get(
                              `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/approval-histories/` +
                                id
                            );
                            const data: any[] = res.data.data;
                            if (!Array.isArray(data)) return [];
                            return data || [];
                          }}
                        />
                      </div>
                    </>
                  }
                >
                  <ButtonContainer variant="outline">
                    <FiInfo className="text-xl" />
                  </ButtonContainer>
                </Alert>
              )}

              {(fm.data?.status === "DRAFTED" ||
                fm.data?.status === "REJECTED") &&
                local.can_save && (
                  <Alert
                    type={"save"}
                    onClick={async () => {
                      fm.data.status = "DRAFTED";
                      fm.error = {};
                      fm.render();
                      await fm.submit();
                      await fm.reload();
                    }}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoMdSave className="text-xl" />
                      Save
                    </ButtonContainer>
                  </Alert>
                )}

              {local.can_submit &&
              (fm.data?.status === "DRAFTED" ||
                fm.data?.status === "REJECTED") ? (
                <>
                  {fm.data?.document_line?.length ? (
                    <>
                      <Alert
                        type={"save"}
                        msg={"Are you sure you want to submit this data? Once submitted, the data will be locked and its status will be updated."}
                        onClick={async () => {
                          fm.data.level = "Level HRD Location";
                          fm.data.status = "IN_PROGRESS";
                          fm.error = {};
                          fm.render();
                          await fm.submit();
                          await fm.reload();
                          navigate(`/d/location/${id}/view`);
                        }}
                      >
                        <ButtonContainer className={"bg-primary"}>
                          <IoMdSave className="text-xl" />
                          Submit
                        </ButtonContainer>
                      </Alert>
                    </>
                  ) : (
                    <div className="flex flex-row items-center">
                      <ButtonBetter
                        className={"bg-primary"}
                        onClick={() => {
                          const validate = ["document_line"];
                          let count = 0;
                          validate.map((e) => {
                            if (e === "document_line") {
                              if (!fm.data?.[e]?.length) {
                                fm.error[
                                  e
                                ] = `A minimum of 1 document line is required to submit.`;
                                count++;
                              }
                            } else {
                              if (!fm.data?.[e]) {
                                const label = fm.fields?.[e]?.label;
                                count++;
                                fm.error[
                                  e
                                ] = `${label} is mandatory for submission`;
                              }
                            }
                          });
                          toast.error(
                            <div className="flex flex-col w-full">
                              <div className="flex text-red-600 items-center">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Submit Failed
                                {count > 0 &&
                                  `, please correct
                                    ${count} errors`}
                                .
                              </div>
                            </div>,
                            {
                              dismissible: true,
                              className: css`
                                background: #ffecec;
                                border: 2px solid red;
                              `,
                            }
                          );
                          fm.render();
                        }}
                      >
                        <IoMdSave className="text-xl" />
                        Submit
                      </ButtonBetter>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
              {["DRAFTED", "DRAFT"].includes(fm.data?.status) &&
              local.can_delete ? (
                <>
                  <Alert
                    type={"save"}
                    onClick={async () => {
                      await actionToast({
                        task: async () => {
                          await api.delete(
                            `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/` +
                              id
                          );
                        },
                        after: () => {
                          navigate("/d/location");
                        },
                        msg_load: "Delete ",
                        msg_error: "Delete failed ",
                        msg_succes: "Delete success ",
                      });
                    }}
                  >
                    <ButtonContainer variant="destructive">
                      <MdDelete className="text-xl" />
                      Delete
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
        const data = fm.data;
        const param: any = {
          id: data.id,
          mpp_period_id: data.mpp_period_id,
          organization_id: data.organization_id,
          emp_organization_id: data.emp_organization_id,
          job_id: data.job_id,
          document_number: data.document_number,
          document_date: normalDate(data.document_date),
          notes: data.notes,
          total_recruit: data.total_recruit,
          total_promote: data.total_promote,
          status: data.status,
          recommended_by: data.recommended_by,
          approved_by: data.approved_by,
          requestor_id: data.requestor_id,
          organization_location_id: data.organization_location_id,
        };
        const document_line = data.document_line.map((e: any) => {
          return {
            ...e,
            organization_location_id: data.organization_location_id,
          };
        });
        const hasDuplicate = (array: any) => {
          const seen = new Set();

          for (const item of array) {
            const key = `${item.job_level_id}-${item.job_id}`; // Gabungkan untuk identifikasi unik
            if (seen.has(key)) {
              return true; // Jika ditemukan duplikat
            }
            seen.add(key); // Tambahkan ke Set
          }

          return false; // Tidak ada duplikat
        };
        const result = hasDuplicate(document_line);
        if (result) {
          fm.error[
            "document_line"
          ] = `A minimum of 1 document line is required to submit.`;
          throw new Error(`Failed Save duplicate found document line`);
        }
        const formData = new FormData();
        formData.append("payload", JSON.stringify(param));
        const res: any = await api.put(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const deleted_line_ids = data?.deleted_line_ids?.length
          ? data.deleted_line_ids
          : [];

        await api.post(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/lines/batch/store`,
          {
            mp_planning_header_id: data.id,
            mp_planning_lines: document_line,
            deleted_line_ids,
          }
        );
      }}
      onLoad={async () => {
        const res: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/` + id
        );
        const turn_over = await api.get(
          `${process.env.NEXT_PUBLIC_API_PORTAL}/api/employees/turnover?start_date=2024-06-01&end_date=2025-07-01`
        );
        const history: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/approval-histories/` +
            id
        );
        const data = res.data.data;
        return {
          id,
          ...data,
          plafon: data?.job_plafon?.plafon,
          turn_over: getNumber(turn_over?.data?.data?.total),
          mpp_name: data?.mpp_period?.title,
          budget_year_from: data?.mpp_period?.budget_start_date,
          budget_year_to: data?.mpp_period?.budget_end_date,
          document_line: data?.mp_planning_lines || [],
          history: history.data.data,
          // is_you: data?.
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"organization_name"}
                    label={"Organization"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"organization_location_name"}
                    label={"Location"}
                    type={"text"}
                    disabled={true}
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
                    disabled={
                      !(
                        fm.data?.status === "DRAFTED" ||
                        fm.data?.status === "REJECTED"
                      )
                    }
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"mpp_name"}
                    label={"Periode Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div></div>
                <div>
                  <Field
                    fm={fm}
                    name={"budget_year_from"}
                    label={"Budget year From"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"budget_year_to"}
                    label={"Budget year To"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"requestor_name"}
                    label={"Requestor"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"notes"}
                    label={"Notes"}
                    type={"textarea"}
                    disabled={
                      !(
                        fm.data?.status === "DRAFTED" ||
                        fm.data?.status === "REJECTED"
                      )
                    }
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"total_recruit"}
                    label={"Total Recruit"}
                    type={"money"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"total_promote"}
                    label={"Total Promote"}
                    type={"money"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"recommended_by"}
                    label={"Recommend by"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"approver_ceo_name"}
                    label={"Approved by"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    disabled={true}
                    type={"dropdown"}
                    onLoad={() => {
                      return statusMpp;
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
            className={cx(css`
              .tbl-search {
                display: none !important;
              }
              .tbl-pagination {
                display: none !important;
              }
            `)}
          >
            <div className="w-full flex flex-row">
              <div className="flex flex-grow flex-col h-[350px]">
                <TableList
                  disabledHoverRow={true}
                  disabledPagination={true}
                  header={{
                    sideLeft: (tbl: any) => {
                      if (
                        fm.data?.status === "DRAFTED" ||
                        fm.data?.status === "REJECTED"
                      )
                        return (
                          <>
                            <div className="flex flex-row gap-x-2 items-center">
                              <div className="flex flex-row flex-grow space-x-2">
                                <ButtonBetter
                                  className="bg-primary"
                                  onClick={() => {
                                    tbl.addRow({
                                      recruit_ph: 0,
                                      recruit_mt: 0,
                                      promotion: 0,
                                    });
                                    tbl.render();
                                    fm.render();
                                    const recruit = fm.data.document_line
                                      ?.length
                                      ? fm.data.document_line
                                          .map(
                                            (e: any) =>
                                              getNumber(e.recruit_ph) +
                                              getNumber(e.recruit_mt)
                                          )
                                          .reduce((a: any, b: any) => a + b, 0)
                                      : 0;

                                    const totalPromotion = fm.data.document_line
                                      ?.length
                                      ? fm.data.document_line
                                          .map((e: any) =>
                                            getNumber(e.promotion)
                                          )
                                          .reduce((a: any, b: any) => a + b, 0)
                                      : 0;
                                    fm.data.total_promote = totalPromotion;
                                    fm.data.total_recruit = recruit;
                                    fm.render();
                                  }}
                                >
                                  <div className="flex items-center gap-x-0.5">
                                    <HiPlus className="text-xl" />
                                    <span className="capitalize">Add New</span>
                                  </div>
                                </ButtonBetter>
                              </div>
                              {fm.error?.["document_line"] && (
                                <p className="text-red-500 px-2 text-sm">
                                  {fm.error?.["document_line"]}
                                </p>
                              )}
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
                      name: "level",
                      header: () => <span>Job Level</span>,
                      renderCell: ({ row, name, cell, tbl }: any) => {
                        const fm_row = cloneFM(fm, row);
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              hidden_label={true}
                              name={"job_level_id"}
                              label={"Organization"}
                              type={"dropdown"}
                              disabled={
                                !(
                                  fm.data?.status === "DRAFTED" ||
                                  fm.data?.status === "REJECTED"
                                )
                              }
                              onChange={() => {
                                fm.render();
                              }}
                              onLoad={async () => {
                                const res: any = await api.get(
                                  `${process.env.NEXT_PUBLIC_API_PORTAL}/api/job-levels/organization/${fm.data.organization_id}`
                                );
                                const data: any[] = res.data.data;
                                if (!Array.isArray(data)) return [];
                                const result = data.map((e) => {
                                  return {
                                    value: e.id,
                                    label: `${e.level} - ${e.name}`,
                                  };
                                });
                                return result || [];
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "job",
                      header: () => <span>Job</span>,
                      width: 150,
                      renderCell: ({ row, name, cell }: any) => {
                        const fm_row = cloneFM(fm, row);
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              hidden_label={true}
                              name={"job_id"}
                              label={"Organization"}
                              disabled={
                                !(
                                  fm.data?.status === "DRAFTED" ||
                                  fm.data?.status === "REJECTED"
                                )
                                  ? true
                                  : !fm_row.data?.job_level_id
                              }
                              type={"dropdown"}
                              onChange={(item: any) => {
                                const existing = item.data.existing;
                                fm_row.data.existing = existing;
                                fm.render();
                                const suggested_recruit =
                                  getNumber(item.data.job_plafon) -
                                  getNumber(existing) +
                                  getNumber(fm.data.turn_over) +
                                  getNumber(fm_row.data.promotion);
                                fm_row.data.job_plafon = getNumber(
                                  item.data.job_plafon
                                );
                                fm_row.data.suggested_recruit =
                                  suggested_recruit;
                                const total =
                                  getNumber(fm_row.data.existing) +
                                  getNumber(fm_row.data.recruit_ph) +
                                  getNumber(fm_row.data.recruit_mt) -
                                  getNumber(fm_row.data.promotion);
                                fm_row.data.total = total;
                                fm.render();
                              }}
                              onLoad={async () => {
                                if (!row.job_level_id) return [];
                                const res: any = await api.get(
                                  `${process.env.NEXT_PUBLIC_API_PORTAL}/api/jobs/job-level/${row.job_level_id}`
                                );
                                const data: any[] = res.data.data;
                                if (!Array.isArray(data)) return [];
                                let result = data.map((e) => {
                                  return {
                                    value: e.id,
                                    label: `${e.name}`,
                                    data: e,
                                  };
                                });
                                if (fm.data?.document_line?.length) {
                                  let ids = fm.data.document_line.map(
                                    (e: any) => e.job_id
                                  );
                                  ids = ids.filter(
                                    (e: any) => e !== fm_row?.data?.job_id
                                  );
                                  result = result.filter(
                                    (e) => !ids.includes(e.value)
                                  );
                                }
                                return result || [];
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "existing",
                      header: () => <span>Existing</span>,
                      width: 50,
                      renderCell: ({ row, name, cell }: any) => {
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              name={"existing"}
                              label={"Approved by"}
                              type={"money"}
                              disabled={true}
                              hidden_label={true}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "suggested_recruit",
                      header: () => <span>Suggested Recruit</span>,
                      width: 50,
                      renderCell: ({ row, name, cell }: any) => {
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              name={"suggested_recruit"}
                              label={"Approved by"}
                              type={"money"}
                              hidden_label={true}
                              disabled={true}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "recruit_ph",
                      header: () => <span>Recruit PH</span>,
                      width: 50,
                      renderCell: ({ row, name, cell }: any) => {
                        const fm_row = cloneFM(fm, row);
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              name={"recruit_ph"}
                              type={"money"}
                              hidden_label={true}
                              disabled={
                                !(
                                  fm.data?.status === "DRAFTED" ||
                                  fm.data?.status === "REJECTED"
                                )
                                  ? true
                                  : !fm_row.data?.job_level_id
                              }
                              onChange={() => {
                                const fm_row = cloneFM(fm, row);
                                const getNumber = (data: any) => {
                                  return Number(data) || 0;
                                };
                                const total =
                                  getNumber(fm_row.data.existing) +
                                  getNumber(fm_row.data.recruit_ph) +
                                  getNumber(fm_row.data.recruit_mt) -
                                  getNumber(fm_row.data.promotion);

                                const recruit = fm.data.document_line
                                  .map(
                                    (e: any) =>
                                      getNumber(e.recruit_ph) +
                                      getNumber(e.recruit_mt)
                                  )
                                  .reduce((a: any, b: any) => a + b, 0);
                                fm.data.total_recruit = recruit;
                                fm_row.data.total = total;
                                fm.render();
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "recruit_mt",
                      header: () => <span>Recruit MT</span>,
                      width: 50,
                      renderCell: ({ row, name, cell }: any) => {
                        const fm_row = cloneFM(fm, row);
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              name={"recruit_mt"}
                              type={"money"}
                              hidden_label={true}
                              disabled={
                                !(
                                  fm.data?.status === "DRAFTED" ||
                                  fm.data?.status === "REJECTED"
                                )
                                  ? true
                                  : !fm_row.data?.job_level_id
                              }
                              onChange={() => {
                                const fm_row = cloneFM(fm, row);
                                const getNumber = (data: any) => {
                                  return Number(data) || 0;
                                };
                                const total =
                                  getNumber(fm_row.data.existing) +
                                  getNumber(fm_row.data.recruit_ph) +
                                  getNumber(fm_row.data.recruit_mt) -
                                  getNumber(fm_row.data.promotion);

                                const recruit = fm.data.document_line
                                  .map(
                                    (e: any) =>
                                      getNumber(e.recruit_ph) +
                                      getNumber(e.recruit_mt)
                                  )
                                  .reduce((a: any, b: any) => a + b, 0);
                                fm.data.total_recruit = recruit;
                                fm_row.data.total = total;
                                fm.render();
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "promotion",
                      header: () => <span>Promotion</span>,
                      width: 50,
                      renderCell: ({ row, name, cell }: any) => {
                        const fm_row = cloneFM(fm, row);
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              name={"promotion"}
                              label={"Approved by"}
                              type={"money"}
                              hidden_label={true}
                              disabled={
                                !(
                                  fm.data?.status === "DRAFTED" ||
                                  fm.data?.status === "REJECTED"
                                )
                                  ? true
                                  : !fm_row.data?.job_level_id
                              }
                              onChange={() => {
                                const fm_row = cloneFM(fm, row);
                                const getNumber = (data: any) => {
                                  return Number(data) || 0;
                                };
                                const total =
                                  getNumber(fm_row.data.existing) +
                                  getNumber(fm_row.data.recruit_ph) +
                                  getNumber(fm_row.data.recruit_mt) -
                                  getNumber(fm_row.data.promotion);
                                const totalPromotion = fm.data.document_line
                                  .map((e: any) => getNumber(e.promotion))
                                  .reduce((a: any, b: any) => a + b, 0);
                                fm.data.total_promote = totalPromotion;
                                fm_row.data.total = total;
                                fm.render();

                                const suggested_recruit =
                                  getNumber(fm_row.data.job_plafon) -
                                  getNumber(fm_row.data.existing) +
                                  getNumber(fm.data.turn_over) +
                                  getNumber(fm_row.data.promotion);
                                fm_row.data.suggested_recruit =
                                  suggested_recruit;
                                fm.render();
                              }}
                            />
                          </>
                        );
                      },
                    },
                    {
                      name: "total",
                      header: () => <span>Total</span>,
                      width: 50,
                      renderCell: ({ row, name, cell }: any) => {
                        return (
                          <>
                            <Field
                              fm={cloneFM(fm, row)}
                              name={"total"}
                              label={"Approved by"}
                              type={"money"}
                              disabled={true}
                              hidden_label={true}
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
                        if (!["DRAFTED", "REJECTED"].includes(fm.data?.status))
                          return <></>;
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
                                fm.data.document_line =
                                  fm.data.document_line.filter(
                                    (e: any) => e !== row
                                  );
                                fm.render();
                                const recruit = fm.data.document_line?.length
                                  ? fm.data.document_line
                                      .map(
                                        (e: any) =>
                                          getNumber(e.recruit_ph) +
                                          getNumber(e.recruit_mt)
                                      )
                                      .reduce((a: any, b: any) => a + b, 0)
                                  : 0;

                                const totalPromotion = fm.data.document_line
                                  ?.length
                                  ? fm.data.document_line
                                      .map((e: any) => getNumber(e.promotion))
                                      .reduce((a: any, b: any) => a + b, 0)
                                  : 0;
                                fm.data.total_promote = totalPromotion;
                                fm.data.total_recruit = recruit;
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
                  onLoad={async (param: any) => {
                    return fm.data.document_line;
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
