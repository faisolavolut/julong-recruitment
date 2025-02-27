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
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { events } from "@/lib/utils/event";
import { IoCheckmarkOutline } from "react-icons/io5";
import { X } from "lucide-react";
import { getValue } from "@/lib/utils/getValue";
import { TableList } from "@/lib/components/tablelist/TableList";
import { Applicant } from "../../../schedule-test/[id]/Application";

function Page() {
  const id = getParams("id");
  const labelPage = "Schedule Test";
  const urlPage = `/d/test-selection/schedule-test`;
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
            <div className="flex flex-row space-x-2 items-center"></div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {}}
      mode="view"
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-verifications/${id}`,
          validate: "object",
        });
        return { ...data, template_name: data?.template_question?.name };
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
                    name={"document_number"}
                    label={"Document Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"schedule_date"}
                    label={"Schedule Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    target={"select_test_type_id"}
                    name={"select_test_type"}
                    label={"Select Test Type"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/test-types",
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
                    type={"dropdown"}
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
                    name={"end_date"}
                    label={"End Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"start_time"}
                    label={"Start Time"}
                    type={"time"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"end_time"}
                    label={"End Time"}
                    type={"time"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"location"}
                    label={"Location (Url)"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job Name"}
                    type={"text"}
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
                    name={"link_test"}
                    label={"Link Test"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"total_candidate"}
                    label={"Total Candidate"}
                    type={"money"}
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
                  <Applicant fm={fm} />
                </div>
              </div>
            </div>
          </>
        );
      }}
      onFooter={(fm: any) => {
        if (!fm?.data?.id) return <></>;
        return (
          <div className={cx("flex-grow flex-col flex")}>
            <div className="w-full flex flex-row flex-grow">
              <div className="flex flex-grow flex-col min-h-[350px]">
                <TableList
                  name="job-posting"
                  feature={["checkbox"]}
                  header={{
                    sideLeft: (data: any) => {
                      return (
                        <div className="flex flex-row flex-grow gap-x-2">
                          {data?.selection?.all ||
                          data?.selection?.partial?.length ? (
                            <>
                              <Alert
                                type={"save"}
                                msg={`Are you sure you want to approve ${
                                  data?.selection?.all
                                    ? "All"
                                    : `${data?.selection?.partial?.length}`
                                } profile?`}
                                onClick={() => {}}
                              >
                                <ButtonContainer className={"bg-primary"}>
                                  <IoCheckmarkOutline className="text-xl" />
                                  Approve
                                </ButtonContainer>
                              </Alert>
                              <Alert
                                type={"delete"}
                                msg={`Are you sure you want to reject ${
                                  data?.selection?.all
                                    ? "All"
                                    : `${data?.selection?.partial?.length}`
                                } profile?`}
                                onClick={async () => {}}
                              >
                                <ButtonContainer variant={"destructive"}>
                                  <X className="text-xl" />
                                  Reject
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
                      header: "ID Applicant",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "name",
                      header: "Applicant Name",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "age",
                      header: "Age",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "job_name",
                      header: "Job Name",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "work_experience",
                      header: "Work Experience (month)",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "cv",
                      header: "CV",
                      renderCell: ({ row, name }: any) => {
                        return <>{getValue(row, name)}</>;
                      },
                    },
                    {
                      name: "status_selection",
                      header: "Status Selection",
                      renderCell: ({ row }: any) => {
                        return (
                          <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                            <ButtonBetter>
                              <div className="flex items-center gap-x-2">
                                <IoCheckmarkOutline className="text-lg" />
                              </div>
                            </ButtonBetter>
                            <ButtonBetter variant={"destructive"}>
                              <div className="flex items-center gap-x-2">
                                <X className="text-lg" />
                              </div>
                            </ButtonBetter>
                          </div>
                        );
                      },
                    },
                  ]}
                  onLoad={async (param: any) => {
                    const params = await events("onload-param", param);
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.user_profiles",
                      path: `/api/user-profiles${params}`,
                      validate: "array",
                    });
                    return result;
                  }}
                  onCount={async (params: any) => {
                    const result: any = await apix({
                      port: "recruitment",
                      value: "data.data.total",
                      path: `/api/user-profiles?page=1&page_size=1`,
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
