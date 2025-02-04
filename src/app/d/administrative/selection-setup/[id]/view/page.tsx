"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import {
  ButtonBetterTooltip,
  ButtonContainer,
} from "@/lib/components/ui/button";
import { Alert } from "@/lib/components/ui/alert";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { IoCheckmarkOutline, IoEye } from "react-icons/io5";
import { getValue } from "@/lib/utils/getValue";
import { TableList } from "@/lib/components/tablelist/TableList";
import { X } from "lucide-react";
import { events } from "@/lib/utils/event";
import { sortEducationLevels } from "@/app/lib/education-level";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import { TooltipBetter } from "@/lib/components/ui/tooltip-better";
import { access } from "@/lib/utils/getAccess";
import { actionToast } from "@/lib/utils/action";
import { normalDate } from "@/lib/utils/date";

function Page() {
  const id = getParams("id");
  const labelPage = "Selection Setup";
  const urlPage = `/d/administrative/selection-setup`;
  const local = useLocal({
    can_edit: false,
    can_delete: false,
    can_view: true,
    can_selection: false,
    can_submit: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.can_delete = true;
      local.can_submit = access("submit-administrative-selection-setup");
      local.can_selection = access("approval-applicant-document-selection");
      local.can_view = access("read-administrative-selection-setup");
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (!local.can_view) return notFound();

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
              {local.can_submit && fm.data?.status === "IN PROGRESS" && (
                <>
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
                  <Alert
                    type={"save"}
                    msg={"Are you sure you want to submit this record?"}
                    onClick={() => {
                      fm.data.status = "COMPLETED";
                      fm.render();
                      fm.submit();
                    }}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoMdSave className="text-xl" />
                      Submit
                    </ButtonContainer>
                  </Alert>
                </>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        //  + id
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/administrative-selections/update",
          method: "put",
          data: {
            ...fm.data,
            document_date: normalDate(fm?.data?.document_date),
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/administrative-selections/${id}`,
          validate: "object",
        });
        return {
          ...data,
          activity: "Administration Selection",
          project_number: data?.job_posting?.document_number,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      mode={"view"}
      children={(fm: any) => {
        return (
          <>
            <div className={"flex flex-col flex-wrap px-4 py-2"}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
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
                    name={"activity"}
                    label={"Activity"}
                    type={"text"}
                    disabled={true}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/template-questions/form-types",
                        validate: "dropdown",
                        keys: {
                          label: "value",
                          value: "value",
                        },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"start_date"}
                    label={"Start Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"pic"}
                    label={"PIC"}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data.employees",
                        path: "/api/employees",
                        validate: "dropdown",
                        keys: {
                          label: "name",
                        },
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
                    name={"document_number"}
                    label={"Document Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"end_date"}
                    label={"End Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"total_applicants"}
                    label={"Total Candidate"}
                    type={"money"}
                  />
                </div>
                <div>{/* <Applicant fm={fm} /> */}</div>
              </div>
            </div>
          </>
        );
      }}
      onFooter={(fm: any) => {
        if (!fm?.data?.id) return <></>;
        return (
          <div className={cx()}>
            <div className="w-full flex flex-row">
              <div className="flex flex-grow flex-col h-[350px]">
                <TableList
                  selectionPaging={true}
                  name="job-posting"
                  feature={
                    fm.data.status === "COMPLETED"
                      ? []
                      : local.can_selection
                      ? ["checkbox"]
                      : []
                  }
                  header={{
                    sideLeft: (data: any) => {
                      return (
                        <div className="flex flex-row flex-grow gap-x-2">
                          {data?.selection?.all ||
                          data?.selection?.partial?.length ? (
                            <>
                              <Alert
                                type={"save"}
                                msg={`Are you sure you want to save ${data?.selection?.partial?.length} profile?`}
                                onClick={async () => {
                                  await actionToast({
                                    task: async () => {
                                      const listData = data?.data || [];
                                      const short = listData.filter(
                                        (e: any) => e?.status === "PENDING"
                                      );
                                      const result = {
                                        administrative_results: short.map(
                                          (e: any) => {
                                            return {
                                              id: e.id,
                                              status: "SHORTLISTED",
                                              user_profile_id:
                                                e?.user_profile?.id,
                                            };
                                          }
                                        ),
                                        administrative_selection_id: id,
                                        deleted_administrative_result_ids: [],
                                      };
                                      await apix({
                                        port: "recruitment",
                                        value: "data.data",
                                        path: "/api/administrative-results",
                                        method: "post",
                                        data: {
                                          ...result,
                                        },
                                      });
                                    },
                                    after: () => {},
                                    msg_load: "Saving selection ",
                                    msg_error: "Failed to save selection ",
                                    msg_succes:
                                      "Your selection has been saved successfully! ",
                                  });
                                }}
                              >
                                <ButtonContainer className={"bg-primary"}>
                                  <IoCheckmarkOutline className="text-xl" />
                                  Save
                                </ButtonContainer>
                              </Alert>
                              <Alert
                                type={"delete"}
                                msg={`Are you sure you want to delete ${data?.selection?.partial?.length} profile?`}
                                onClick={async () => {
                                  await actionToast({
                                    task: async () => {
                                      const listData = data?.data || [];
                                      const short = listData.filter(
                                        (e: any) => e?.status === "PENDING"
                                      );
                                      const result = {
                                        administrative_results: short.map(
                                          (e: any) => {
                                            return {
                                              id: e.id,
                                              status: "PENDING",
                                              user_profile_id:
                                                e?.user_profile?.id,
                                            };
                                          }
                                        ),
                                        administrative_selection_id: id,
                                        deleted_administrative_result_ids: [],
                                      };
                                      await apix({
                                        port: "recruitment",
                                        value: "data.data",
                                        path: "/api/administrative-results",
                                        method: "post",
                                        data: {
                                          ...result,
                                        },
                                      });
                                    },
                                    after: () => {},
                                    msg_load: "Saving selection ",
                                    msg_error: "Failed to save selection ",
                                    msg_succes:
                                      "Your selection has been saved successfully! ",
                                  });
                                }}
                              >
                                <ButtonContainer variant={"destructive"}>
                                  <X className="text-xl" />
                                  Delete
                                </ButtonContainer>
                              </Alert>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      );
                    },
                  }}
                  column={[
                    {
                      name: "id_applicant",
                      header: () => <span>ID Applicant</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "user_profile.name",
                      header: () => <span>Applicant Name</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "gpa",
                      header: () => <span>GPA</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <>
                            {getNumber(
                              sortEducationLevels(
                                getValue(row, "user_profile.educations"),
                                "gpa"
                              )
                            )}
                          </>
                        );
                      },
                    },
                    {
                      name: "major",
                      header: () => <span>Major</span>,
                      renderCell: ({ row, name }: any) => {
                        const major = sortEducationLevels(
                          getValue(row, "user_profile.educations"),
                          "major"
                        );
                        return <>{major ? major : "-"}</>;
                      },
                    },
                    {
                      name: "job_name",
                      header: () => <span>Job Name</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <>
                            {detectUniqueExperience(
                              getValue(row, "user_profile.work_experience")
                            )}
                          </>
                        );
                      },
                    },
                    {
                      name: "job_experience",
                      header: () => <span>Job Experience</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <>
                            {detectUniqueExperience(
                              getValue(row, "user_profile.work_experience"),
                              "company_name",
                              "company experiences"
                            )}
                          </>
                        );
                      },
                    },
                    {
                      name: "user_profile.work_experience",
                      header: () => <span>Work Experience (Year)</span>,
                      renderCell: ({ row, name }: any) => {
                        return <>{getTotalExperience(getValue(row, name))}</>;
                      },
                    },
                    {
                      name: "user_profile.curriculum_vitae",
                      header: () => <span>CV</span>,
                      renderCell: ({ row, name }: any) => {
                        return (
                          <FilePreview
                            url={
                              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                            }
                            disabled={true}
                            limit_name={10}
                          />
                        );
                      },
                    },
                    {
                      name: "status",
                      sortable: false,
                      header: () => <span>Status Selection</span>,
                      renderCell: ({ row, render }: any) => {
                        if (row.status === "ACCEPTED") {
                          return (
                            <div className="bg-green-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Accepted
                            </div>
                          );
                        } else if (row.status === "REJECTED") {
                          return (
                            <div className="bg-red-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Rejected
                            </div>
                          );
                        } else if (!local.can_selection) {
                          return (
                            <div className="bg-gray-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                              Pending
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <Alert
                              type={"save"}
                              msg={`Are you sure you want to approve this applicant?`}
                              onClick={async () => {
                                await actionToast({
                                  task: async () => {
                                    await apix({
                                      port: "recruitment",
                                      value: "data.data",
                                      path: "/api/administrative-results",
                                      method: "post",
                                      data: {
                                        administrative_results: [
                                          {
                                            id: row.id,
                                            status: "ACCEPTED",
                                            user_profile_id:
                                              row?.user_profile?.id,
                                          },
                                        ],
                                        administrative_selection_id: id,
                                        deleted_administrative_result_ids: [],
                                      },
                                    });
                                    row.status = "ACCEPTED";
                                    render();
                                  },
                                  after: () => {},
                                  msg_load: "Saving result selection ",
                                  msg_error: "Failed to save result selection ",
                                  msg_succes:
                                    "Your result selection has been saved successfully! ",
                                });
                              }}
                            >
                              <ButtonBetterTooltip
                                typeButton="container"
                                tooltip={"Approve applicant"}
                              >
                                <div className="flex items-center gap-x-2">
                                  <IoCheckmarkOutline className="text-lg" />
                                </div>
                              </ButtonBetterTooltip>
                            </Alert>
                            <Alert
                              type={"save"}
                              msg={`Are you sure you want to reject this applicant?`}
                              onClick={async () => {
                                await actionToast({
                                  task: async () => {
                                    await apix({
                                      port: "recruitment",
                                      value: "data.data",
                                      path: "/api/administrative-results" + id,
                                      method: "put",
                                      data: {
                                        administrative_results: [
                                          {
                                            id: row.id,
                                            status: "REJECTED",
                                            user_profile_id:
                                              row?.user_profile?.id,
                                          },
                                        ],
                                        administrative_selection_id: id,
                                        deleted_administrative_result_ids: [],
                                      },
                                    });
                                    row.status = "REJECTED";
                                    render();
                                  },
                                  after: () => {},
                                  msg_load: "Saving result selection ",
                                  msg_error: "Failed to save result selection ",
                                  msg_succes:
                                    "Your result selection has been saved successfully! ",
                                });
                              }}
                            >
                              <ButtonBetterTooltip
                                typeButton="container"
                                tooltip={"Approve applicant"}
                                variant={"destructive"}
                              >
                                <div className="flex items-center gap-x-2">
                                  <X className="text-lg" />
                                </div>
                              </ButtonBetterTooltip>
                            </Alert>
                          </div>
                        );
                      },
                    },
                    {
                      name: "action",
                      header: () => <span>Action</span>,
                      sortable: false,
                      renderCell: ({ row }: any) => {
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <TooltipBetter content="View Profile Applicant">
                              <ButtonLink
                                className="bg-primary"
                                href={`/d/administrative/selection-setup/${id}/candidate/${row?.id}/${row?.user_profile?.id}/view`}
                              >
                                <div className="flex items-center gap-x-2">
                                  <IoEye className="text-lg" />
                                </div>
                              </ButtonLink>
                            </TooltipBetter>
                          </div>
                        );
                      },
                    },
                  ]}
                  onLoad={async (param: any) => {
                    const params = await events("onload-param", param);
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.administrative_results",
                      path: `/api/administrative-results/administrative-selection/${id}${params}`,
                      validate: "array",
                    });
                    return result;
                  }}
                  onCount={async () => {
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.total",
                      path: `/api/administrative-results/administrative-selection/${id}?page=1&page_size=1`,
                      validate: "object",
                    });
                    return getNumber(result);
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
