"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { dayDate } from "@/lib/utils/date";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getParams } from "@/lib/utils/get-params";
import { ButtonBetterTooltip } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { RiAiGenerate } from "react-icons/ri";

function Page() {
  const id_posting = getParams("id_posting");
  const local = useLocal({
    can_add: false,
    can_edit: false,
  });

  useEffect(() => {
    const run = async () => {
      local.can_add = access("create-final-result-interview");
      local.can_edit = access("edit-final-result-interview");
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      breadcrumb={[
        {
          title: "List Job Posting",
          url: "/d/interview/result-interview",
        },
        {
          title: "List Applicant",
          // url: "/d/interview/result-interview/" + id_posting,
        },
      ]}
      title="Result Interview"
      name="result-interview"
      header={{
        sideLeft: (data: any) => {
          return <></>;
        },
      }}
      column={[
        {
          name: "applicant_name",
          header: () => <span>Applicant Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "age",
          header: () => <span>Age</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_name",
          header: () => <span>Job Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "schedule_date",
          header: () => <span>Schedule Date</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "start_time",
          header: () => <span>Start Time</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "end_time",
          header: () => <span>End Time</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "interviewer",
          header: () => <span>Interviewer</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "status",
          sortable: false,
          header: () => <span>Status Selection</span>,
          renderCell: ({ row, render }: any) => {
            if (row.status === "APPROVED") {
              return (
                <div className="bg-green-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-full max-w-24">
                  Approved
                </div>
              );
            } else if (row.status === "REJECTED") {
              return (
                <div className="bg-red-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-full  max-w-24">
                  Rejected
                </div>
              );
            }
            return (
              <div className="bg-gray-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-full  max-w-24">
                Pending
              </div>
            );
          },
        },
        {
          name: "action",
          header: () => <span>Action</span>,
          sortable: false,
          renderCell: ({ row }: any) => {
            const form = false;
            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                {!form ? (
                  <ButtonBetterTooltip
                    tooltip={"Create Result Interview"}
                    className="bg-primary"
                    onClick={async () => {
                      await actionToast({
                        task: async () => {
                          navigate(
                            `/d/interview/result-interview/${id_posting}/${row.id}/view`
                          );
                          // if (false) {
                          //   const res = await apix({
                          //     port: "recruitment",
                          //     value: "data.data",
                          //     path: "/api/job-postings",
                          //     method: "post",
                          //     type: "form",
                          //     data: {},
                          //   });
                          //   if (res?.id)
                          //     navigate(
                          //       `${urlPage}/${id}/${res?.id}/view`
                          //     );
                          // } else {
                          //   navigate(`${urlPage}/${id}/1/view`);
                          // }
                        },
                        after: () => {},
                        msg_load: "Create MPR Job Posting ",
                        msg_error: "Create MPR Job Posting failed ",
                        msg_succes: "MPR Job Posting success ",
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
                    href={`/d/interview/result-interview/${id_posting}/${row.id}/view`}
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
          value: "data.data.interviews",
          path: `/api/interviews${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/interviews?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
