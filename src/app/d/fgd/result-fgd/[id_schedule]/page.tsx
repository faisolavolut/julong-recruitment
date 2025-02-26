"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getParams } from "@/lib/utils/get-params";
import { ButtonBetterTooltip } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { RiAiGenerate, RiDownloadCloudLine } from "react-icons/ri";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import { get_user } from "@/lib/utils/get_user";
import { ModalImportResult } from "@/app/d/test-selection/result-test/[id]/ModalImportResult";
import { DropdownHamburgerBetter } from "@/lib/components/ui/dropdown-menu";
import { AiOutlineCloudUpload } from "react-icons/ai";

function Page() {
  const id_schedule = getParams("id_schedule");
  const [open, setOpen] = useState(false as boolean);
  const local = useLocal({
    can_add: false,
    can_edit: false,
    tab: "interview",
    interview: null as any,
    final_interview: null as any,
    order_interview: 0,
    order_final_interview: 0,
    assessor: {
      interview: null as any,
      final_interview: null as any,
    },
    schedule: null as any,
    ready: false,
  });

  useEffect(() => {
    const run = async () => {
      local.can_add = access("create-final-result-fgd");
      local.can_edit = access("edit-final-result-fgd");

      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/fgd-schedules/${id_schedule}`,
        validate: "object",
      });
      const assessors = data?.fgd_assessors;
      const myAssessor = assessors.find(
        (er: any) => er?.employee_id === get_user("employee.id")
      );
      local.schedule = data;
      //
      local.assessor = myAssessor;
      local.ready = true;
      local.render();
      return;
    };
    run();
  }, []);
  if (!local.ready)
    return (
      <div className="flex-grow flex-grow flex flex-row items-center justify-center">
        <div className="spinner-better"></div>
      </div>
    );
  return (
    <TableUI
      breadcrumb={[
        {
          title: "List FGD Schedule",
          url: "/d/fgd/result-fgd",
        },
        {
          title: "List Applicant",
          // url: "/d/fgd/result-fgd/" + id_posting,
        },
      ]}
      title="Result FGD"
      name="result-fgd"
      header={{
        sideLeft: (data: any) => {
          return <div className="flex flex-row flex-grow gap-x-2 ml-4"></div>;
        },
        sideRight: (data: any) => {
          return (
            <div className="flex flex-row flex-grow gap-x-2 ml-4">
              <ModalImportResult
                open={open}
                onChangeOpen={(e: boolean) => {
                  setOpen(e);
                }}
                msg="Import Result FGD"
                onUpload={async (file: any) => {
                  await apix({
                    port: "recruitment",
                    path: `/api/fgd-schedules/read-result-template`,
                    method: "post",
                    value: "data",
                    type: "form",
                    data: {
                      file: file,
                    },
                  });
                  if (typeof data?.refresh === "function") data.refresh();
                  setOpen(false);
                }}
              />
              <DropdownHamburgerBetter
                className=""
                classNameList="w-48"
                list={[
                  {
                    label: "Export Template",
                    icon: <RiDownloadCloudLine className="text-xl" />,
                    onClick: async () => {
                      await actionToast({
                        task: async () => {
                          const res = await apix({
                            port: "recruitment",
                            method: "get",
                            value: "data",
                            options: {
                              responseType: "blob",
                              headers: {
                                Accept:
                                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Memastikan format yang benar
                              },
                            },
                            path: `/api/fgd-schedules/export-result-template?id=${id_schedule}&job_posting_id=${local.schedule?.job_posting_id}`,
                          });
                          const url = window.URL.createObjectURL(
                            new Blob([res])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute(
                            "download",
                            "template-import-fgd.xlsx"
                          );
                          document.body.appendChild(link);
                          link.click();
                        },
                        msg_load: "Download Import FGD",
                        msg_error: "Download Import FGD Failed",
                        msg_succes: "Download Import FGD Success",
                      });
                    },
                  },
                  {
                    label: "Export Result",
                    icon: <RiDownloadCloudLine className="text-xl" />,
                    onClick: async () => {
                      await actionToast({
                        task: async () => {
                          const res = await apix({
                            port: "recruitment",
                            method: "get",
                            value: "data",
                            options: {
                              responseType: "blob",
                              headers: {
                                Accept:
                                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Memastikan format yang benar
                              },
                            },
                            path: `/api/fgd-schedules/export-answers?id=${id_schedule}&job_posting_id=${local.schedule?.job_posting_id}`,
                          });
                          const url = window.URL.createObjectURL(
                            new Blob([res])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute(
                            "download",
                            "export-fgd-result.xlsx"
                          );
                          document.body.appendChild(link);
                          link.click();
                        },
                        msg_load: "Download Result FGD",
                        msg_error: "Download Result FGD Failed",
                        msg_succes: "Download Result FGD Success",
                      });
                    },
                  },
                  {
                    label: "Import Result",
                    icon: <AiOutlineCloudUpload className="text-xl" />,
                    onClick: async ({ close }: any) => {
                      if (typeof close === "function") {
                        close();
                      }
                      setOpen(true);
                    },
                  },
                ]}
              />
            </div>
          );
        },
      }}
      column={[
        {
          name: "user_profile.name",
          header: "Applicant Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_name",
          header: "Job Name",
          renderCell: ({ row, name }: any) => {
            return (
              <>
                {detectUniqueExperience(
                  getValue(row, "user_profile.work_experiences")
                )}
              </>
            );
          },
        },
        {
          name: "job_experience",
          header: "Job Experience",
          renderCell: ({ row, name }: any) => {
            return (
              <>
                {detectUniqueExperience(
                  getValue(row, "user_profile.work_experiences"),
                  "company_name",
                  "company experiences"
                )}
              </>
            );
          },
        },
        {
          name: "user_profile.work_experiences",
          header: "Work Experience (Year)",
          renderCell: ({ row, name }: any) => {
            return <>{getTotalExperience(getValue(row, name))}</>;
          },
        },
        {
          name: "user_profile.curriculum_vitae",
          header: "CV",
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
          name: "final_result",
          sortable: false,
          header: "Status Selection",
          renderCell: ({ row, render }: any) => {
            if (row.final_result === "ACCEPTED") {
              return (
                <div className="bg-green-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                  Approved
                </div>
              );
            } else if (row.final_result === "REJECTED") {
              return (
                <div className="bg-red-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                  Rejected
                </div>
              );
            }
            return (
              <div className="bg-gray-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                Pending
              </div>
            );
          },
        },
        {
          name: "action",

          header: "Action",
          filter: false,
          sortable: false,
          renderCell: ({ row }: any) => {
            const form = false;
            let id_line = null;
            let assessor = local.assessor as any;
            if (!assessor)
              return (
                <div className="flex items-center gap-x-0.5 whitespace-nowrap"></div>
              );
            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                {local.assessor ? (
                  <ButtonBetterTooltip
                    tooltip={"Create Result FGD"}
                    className="bg-primary"
                    onClick={async () => {
                      await actionToast({
                        task: async () => {
                          navigate(
                            `/d/fgd/result-fgd/${id_schedule}/${assessor.id}/${row?.applicant_id}/${row?.id}/view`
                          );
                        },
                        after: () => {},
                        msg_load: "Form result ",
                        msg_error: "Form result failed ",
                        msg_succes: "Form result success ",
                      });
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <RiAiGenerate className="text-lg" />
                    </div>
                  </ButtonBetterTooltip>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/fgd/result-fgd/${id_schedule}/${assessor.id}/${row?.applicant_id}/${row?.id}/view`}
                  >
                    <div className="flex items-center gap-x-2">
                      <IoEye className="text-lg" />
                    </div>
                  </ButtonLink>
                )}
              </div>
            );
          },
        },
      ]}
      onLoad={async (param: any) => {
        const params = await events("onload-param", param);
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.fgd_applicants",
          path: `/api/fgd-applicants/fgd-schedule/${id_schedule}${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/fgd-applicants/fgd-schedule/${id_schedule}?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
