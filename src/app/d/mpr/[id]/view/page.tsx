"use client";
import { Field } from "@/lib/components/form/Field";
import { Form } from "@/lib/components/form/Form";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableList } from "@/lib/components/tablelist/TableList";
import { Tablist } from "@/lib/components/tablist/Tablist";
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
  CardFooter,
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
import api from "@/lib/utils/axios";
import { cloneFM } from "@/lib/utils/cloneFm";
import { showApprovel } from "@/lib/utils/conditionalMPR";
import { shortDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { get_user } from "@/lib/utils/get_user";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { isStringEmpty } from "@/lib/utils/isStringEmpty";
import { useLocal } from "@/lib/utils/use-local";
import { Breadcrumb, Button } from "flowbite-react";
import get from "lodash.get";
import { AlertTriangle, X } from "lucide-react";
import { permission } from "process";
import { useEffect } from "react";
import { FiInfo } from "react-icons/fi";
import { GoInfo } from "react-icons/go";
import { IoMdSave } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

function Page() {
  const id = getParams("id");
  const local = useLocal({
    permission: [] as string[],
  });
  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      const listPermision = [
        "approval-mpr-dept-head",
        "approval-mpr-ho",
        "approval-mpr-vp",
      ];
      const permision = listPermision.filter((e) => getAccess(e, roles));
      local.permission = permision;
      local.render();
    };
    run();
  }, []);
  return (
    <FormBetter
      onTitle={(fm: any) => {
        const parent_fm = fm;
        return (
          <div className="flex flex-row w-full">
            <div className="flex flex-col py-4 pt-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 ">
                <span className="">Manpower Request</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: "List Manpower Request",
                    url: "/d/mpr",
                  },
                  {
                    title: "Detail",
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
              {showApprovel(fm.data, local.permission) && (
                <>
                  <Alert
                    type={"save"}
                    content={
                      <>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            update your request from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Form
                          onSubmit={async (fm: any) => {
                            const data: any = showApprovel(
                              parent_fm.data,
                              local.permission,
                              "reject"
                            );
                            const param = {
                              id,
                              status: data.approve,
                              level: data.level,
                              notes: fm.data.notes,
                              approver_id: get_user("employee.id"),
                              approved_by: get_user("employee.name"),
                            };
                            try {
                              const formData = new FormData();
                              formData.append("payload", JSON.stringify(param));

                              const res: any = await api.put(
                                `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests/status`,
                                formData,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                }
                              );
                              parent_fm.data.status = data.approve;
                              parent_fm.render();
                              parent_fm.reload();
                            } catch (ex: any) {
                              toast.error(
                                <div className="flex flex-col w-full">
                                  <div className="flex text-red-600 items-center">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Failed{" "}
                                    {get(ex, "response.data.meta.message") ||
                                      ex.message}
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
                            }
                          }}
                          onLoad={async () => {
                            return {
                              id,
                            };
                          }}
                          showResize={false}
                          header={(fm: any) => {
                            return <></>;
                          }}
                          children={(fm: any) => {
                            return (
                              <>
                                <div className={cx("flex flex-col flex-wrap")}>
                                  <div className="grid gap-4 mb-4 grid-cols-1">
                                    <div>
                                      <Field
                                        fm={fm}
                                        name={"notes"}
                                        label={"Notes"}
                                        type={"textarea"}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }}
                          onFooter={(fm: any) => {
                            return (
                              <div className={cx("")}>
                                <AlertDialogFooter className="pt-1">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  {isStringEmpty(fm?.data?.notes) ? (
                                    <ButtonBetter
                                      variant="reject"
                                      onClick={() => {
                                        toast.error(
                                          <div className="flex flex-col w-full">
                                            <div className="flex text-red-600 items-center">
                                              <AlertTriangle className="h-4 w-4 mr-1" />
                                              Error: Please ensure all required
                                              fields are filled correctly.
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
                                        fm.error["notes"] =
                                          "A note is required for rejection.";
                                        fm.render();
                                      }}
                                    >
                                      Reject
                                    </ButtonBetter>
                                  ) : (
                                    <AlertDialogAction
                                      className={"bg-red-500 text-white"}
                                      onClick={() => {
                                        fm.submit();
                                      }}
                                    >
                                      Reject
                                    </AlertDialogAction>
                                  )}
                                </AlertDialogFooter>
                              </div>
                            );
                          }}
                        />
                      </>
                    }
                  >
                    <ButtonContainer className={"bg-red-500"}>
                      <IoMdSave className="text-xl" />
                      Reject
                    </ButtonContainer>
                  </Alert>

                  <Alert
                    type={"delete"}
                    msg="Are you sure you want to approve this request? This action is final and cannot be undone"
                    onClick={async () => {
                      const data: any = showApprovel(
                        fm.data,
                        local.permission,
                        "approve"
                      );
                      const fm_data = { ...data };
                      delete fm_data.level;
                      delete fm_data.approve;
                      fm.data.status = data.approve;
                      fm.data = {
                        ...fm.data,
                        ...fm_data,
                      };
                      const param = {
                        id,
                        status: data.approve,
                        level: data.level,
                        approver_id: get_user("employee.id"),
                        approved_by: get_user("employee.name"),
                      };
                      // return false;
                      try {
                        const formData = new FormData();

                        // Menambahkan data param ke FormData
                        formData.append("payload", JSON.stringify(param));

                        const res: any = await api.put(
                          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests/status`,
                          formData,
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );
                        fm.render();
                        fm.reload();
                      } catch (ex: any) {
                        toast.error(
                          <div className="flex flex-col w-full">
                            <div className="flex text-red-600 items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Failed{" "}
                              {get(ex, "response.data.meta.message") ||
                                ex.message}
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
                      }
                    }}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoMdSave className="text-xl" />
                      Approve
                    </ButtonContainer>
                  </Alert>
                </>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const data: any = fm.data;
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      mode="view"
      onLoad={async () => {
        const res: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests/` + id
        );
        const data: any = res.data.data;

        let categories = [] as any[];
        const ctg: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/request-categories`
        );
        const category: any[] = ctg.data?.data;
        if (!Array.isArray(category)) categories = [];
        categories = category.map((e) => {
          return {
            value: e.id,
            label: e.name,
            data: e,
          };
        });
        const lines = data.mp_planning_header.mp_planning_lines || [];
        const jobs = lines.find((e: any) => e.job_id === data.job_id);

        let history: any = [];
        try {
          const hst = await api.get(
            `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests/approval-histories?mpr_header_id=${id}&status=REJECTED`
          );
          history = hst?.data?.data || [];
        } catch (ex) {}
        const result = {
          id,
          ...data,
          categories: categories,
          divisi: data.for_organization_structure,
          job_level: data.job_level_name,
          location: data.for_organization_location_id,
          is_replacement: data.is_replacement ? "penggantian" : "penambahan",
          total_needs: data.male_needs + data.female_needs,
          remaining_balance:
            data.recruitment_type === "MT_Management Trainee"
              ? getNumber(jobs?.remaining_balance_mt)
              : data.recruitment_type === "PH_Professional Hire"
              ? getNumber(jobs?.remaining_balance_ph)
              : 0,
          mpp_name: data.mpp_period.title,
          major_ids: data.request_majors.map((e: any) => e?.["Major"]?.["ID"]),
          history: history?.data?.data,
          mp_planning_header_doc_no: data?.mp_planning_header?.document_number,
        };
        return {
          id,
          ...data,
          categories: categories,
          divisi: data.for_organization_structure,
          job_level: data.job_level_name,
          location: data.for_organization_location_id,
          is_replacement: data.is_replacement ? "penggantian" : "penambahan",
          total_needs: data.male_needs + data.female_needs,
          remaining_balance:
            data.recruitment_type === "MT_Management Trainee"
              ? getNumber(jobs?.remaining_balance_mt)
              : data.recruitment_type === "PH_Professional Hire"
              ? getNumber(jobs?.remaining_balance_ph)
              : 0,
          mpp_name: data.mpp_period.title,
          major_ids: data.request_majors.map((e: any) => e?.["Major"]?.["ID"]),
          history: history?.data?.data,
          mp_planning_header_doc_no: data?.mp_planning_header?.document_number,
        };
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="text-md font-semibold text-gray-900 py-4">
                Requirement Data
              </div>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 ">
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
                    name={"mp_planning_header_doc_no"}
                    label={"MPP Reference Number"}
                    type={"text"}
                    disabled={true}
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
                <div>
                  <Field
                    fm={fm}
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    type={"dropdown"}
                    onChange={() => {
                      const lines = fm.data?.lines || [];
                      const jobs =
                        lines.find((x: any) => x?.job_id === fm.data?.job_id) ||
                        null;
                      const remaining_balance =
                        fm.data.recruitment_type === "MT_Management Trainee"
                          ? getNumber(jobs?.remaining_balance_mt)
                          : fm.data.recruitment_type === "PH_Professional Hire"
                          ? getNumber(jobs?.remaining_balance_ph)
                          : 0;
                      fm.data.remaining_balance = remaining_balance;
                      fm.render();
                    }}
                    onLoad={async () => {
                      return [
                        {
                          value: "MT_Management Trainee",
                          label: "Management Trainee",
                        },
                        {
                          value: "PH_Professional Hire",
                          label: "Professional Hire",
                        },
                        {
                          value: "NS_Non Staff to Staff",
                          label: "Non Staff to Staff",
                        },
                      ];
                    }}
                  />
                </div>
                <div></div>

                <div>
                  <Field
                    fm={fm}
                    name={"for_organization_name"}
                    label={"For Organization"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"emp_organization_name"}
                    label={"Employment Org"}
                    type={"text"}
                    disabled={true}
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
                    name={"divisi"}
                    label={"Div. / Sect."}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"for_organization_location"}
                    label={"Location"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"job_level"}
                    label={"Job Level"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"male_needs"}
                    label={"Male Needs"}
                    type={"money"}
                    onChange={() => {
                      fm.data.total_needs =
                        getNumber(fm?.data?.male_needs) +
                        getNumber(fm?.data?.female_needs);
                      fm.render();
                    }}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"female_needs"}
                    label={"Female Needs"}
                    type={"money"}
                    onChange={() => {
                      fm.data.total_needs =
                        getNumber(fm?.data?.male_needs) +
                        getNumber(fm?.data?.female_needs);
                      fm.render();
                    }}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    disabled={true}
                    name={"total_needs"}
                    label={"Total Needs"}
                    type={"money"}
                  />
                </div>
                <div></div>
                <div>
                  <Field
                    fm={fm}
                    name={"is_replacement"}
                    label={"Request Category"}
                    type={"dropdown"}
                    onLoad={() => {
                      return [
                        {
                          value: "penambahan",
                          label: "Penambahan",
                        },
                        {
                          value: "penggantian",
                          label: "Penggantian",
                        },
                      ];
                    }}
                    onChange={(item: any) => {
                      if (
                        typeof fm?.fields?.request_category_id?.reload ===
                        "function"
                      )
                        fm.fields.request_category_id.reload();
                    }}
                  />
                </div>
                <div></div>
                {["penggantian", "penambahan"].includes(
                  fm.data?.is_replacement
                ) ? (
                  <div className="col-span-2">
                    <Field
                      hidden_label={true}
                      fm={fm}
                      name={"request_category_id"}
                      label={""}
                      type={"single-checkbox"}
                      className={"grid grid-cols-3"}
                      onLoad={() => {
                        const is_replacement =
                          fm.data?.is_replacement === "penggantian"
                            ? true
                            : false;
                        if (!fm.data?.is_replacement) return [];
                        return fm.data?.categories?.length
                          ? fm.data?.categories.filter(
                              (e: any) =>
                                e.data?.is_replacement === is_replacement
                            )
                          : [];
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}

                <div className="flex flex-col gap-y-1">
                  <div className="block mb-2 text-md font-medium text-gray-900 text-sm inline">
                    Age (Min/Max)
                  </div>
                  <div className="flex flex-row flex-grow gap-x-1">
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"minimum_age"}
                        type={"money"}
                        hidden_label={true}
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex flex-row items-center justify-center px-1">
                      -
                    </div>
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"maximum_age"}
                        type={"money"}
                        hidden_label={true}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"marital_status"}
                    label={"Marital Status"}
                    type={"dropdown"}
                    onLoad={() => {
                      return [
                        {
                          value: "single",
                          label: "Single",
                        },
                        {
                          value: "married",
                          label: "Married",
                        },
                        {
                          value: "any",
                          label: "No Rules",
                        },
                      ];
                    }}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"expected_date"}
                    label={"Expected Start Date"}
                    type={"date"}
                  />
                </div>
              </div>

              <div className="text-md font-semibold text-gray-900 py-4">
                Job Specification
              </div>

              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 ">
                <div>
                  <Field
                    fm={fm}
                    name={"minimum_education"}
                    label={"Minimum Education"}
                    type={"dropdown"}
                    onLoad={() => {
                      return [
                        {
                          label: "1 - Doctoral / Professor",
                          value: "1 - Doctoral / Professor",
                        },
                        {
                          label: "2 - Master Degree",
                          value: "2 - Master Degree",
                        },
                        { label: "3 - Bachelor", value: "3 - Bachelor" },
                        { label: "4 - Diploma 1", value: "4 - Diploma 1" },
                        { label: "5 - Diploma 2", value: "5 - Diploma 2" },
                        { label: "6 - Diploma 3", value: "6 - Diploma 3" },
                        { label: "7 - Diploma 4", value: "7 - Diploma 4" },
                        {
                          label: "8 - Elementary School",
                          value: "8 - Elementary School",
                        },
                        {
                          label: "9 - Senior High School",
                          value: "9 - Senior High School",
                        },
                        {
                          label: "10 - Junior High School",
                          value: "10 - Junior High School",
                        },
                        { label: "11 - Unschooled", value: "11 - Unschooled" },
                      ];
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"major_ids"}
                    label={"Major"}
                    type={"multi-dropdown"}
                    // disabled={!fm.data?.minimum_education}
                    onLoad={async () => {
                      const data = fm.data.request_majors;
                      if (!Array.isArray(data)) return [];
                      return data.map((e) => {
                        return {
                          value: get(e, "Major.ID"),
                          label: get(e, "Major.Major"),
                          data: e,
                        };
                      });
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"experiences"}
                    label={"Work Experience"}
                    type={"textarea"}
                  />
                </div>
                <div></div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"required_qualification"}
                    label={"Required Qualification"}
                    type={"textarea"}
                  />
                </div>
              </div>
              <div className="text-md font-semibold text-gray-900 py-4">
                Specific Skills
              </div>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 ">
                <div>
                  <Field
                    fm={fm}
                    name={"certificate"}
                    label={"Certificate"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"computer_skill"}
                    label={"Computer"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"language_skill"}
                    label={"Languages"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"other_skill"}
                    label={"Others"}
                    type={"text"}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"jobdesc"}
                    label={"Job Desc"}
                    type={"textarea"}
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="block mb-2 text-md font-medium text-gray-900 text-sm inline">
                    Salary Range
                  </div>
                  <div className="flex flex-row flex-grow gap-x-1">
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"salary_min"}
                        type={"text"}
                        hidden_label={true}
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex flex-row items-center justify-center px-1">
                      -
                    </div>
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"salary_max"}
                        type={"text"}
                        hidden_label={true}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
                <div></div>
                <div>
                  <Field
                    fm={fm}
                    name={"requestor_name"}
                    label={"Requestor"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"department_head_name"}
                    label={"Manager/Dept.Head"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"vp_gm_director_name"}
                    label={"VP/GM/Direktur"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"ceo_name"}
                    label={"CEO"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"hrd_ho_unit_name"}
                    label={"HRD/HO"}
                    disabled={true}
                  />
                </div>
                <div></div>

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
    />
  );
}

export default Page;
