"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { dayDate } from "@/lib/utils/date";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
  });

  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_add = getAccess("create-final-result-interview", roles);
      local.can_edit = getAccess("edit-final-result-interview", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
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
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "end_time",
          header: () => <span>End Time</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
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
          name: "result",
          header: () => <span>Result</span>,
          renderCell: ({ row, render }: any) => {
            if (row.status === "APPROVED") {
              return (
                <div className="bg-green-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                  Approved
                </div>
              );
            } else if (row.status === "REJECTED") {
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
          header: () => <span>Action</span>,
          sortable: false,
          renderCell: ({ row }: any) => {
            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                <ButtonLink
                  className="bg-primary"
                  href={`/d/interview/result-interview/${row.id}/view`}
                >
                  <div className="flex items-center gap-x-2">
                    <IoEye className="text-lg" />
                  </div>
                </ButtonLink>
              </div>
            );
          },
        },
      ]}
      onLoad={async (param: any) => {
        const params = await events("onload-param", param);
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.job_postings",
          path: `/api/job-postings${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/job-postings?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
  return (
    <div className="flex p-4 flex-col flex-grow bg-white rounded-lg border border-gray-300 shadow-md shadow-gray-300">
      <div className="flex flex-col py-4 pb-0 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Final Result Interview</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white overflow-hidden ">
        <TableList
          name="result-interview"
          header={{
            sideLeft: (data: any) => {
              if (!local.can_add) return <></>;
              return (
                <div className="flex flex-row flex-grow">
                  <ButtonLink
                    className="bg-primary"
                    href={"/d/final-interview/result-interview/new"}
                  >
                    <div className="flex items-center gap-x-0.5">
                      <HiPlus className="text-xl" />
                      <span className="capitalize">Add New</span>
                    </div>
                  </ButtonLink>
                </div>
              );
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
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "end_time",
              header: () => <span>End Time</span>,
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
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
              name: "result",
              header: () => <span>Result</span>,
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "action",
              header: () => <span>Action</span>,
              sortable: false,
              renderCell: ({ row }: any) => {
                return (
                  <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                    {local.can_edit ? (
                      <ButtonLink
                        href={`/d/final-interview/result-interview/${row.id}/edit`}
                      >
                        <div className="flex items-center gap-x-2">
                          <HiOutlinePencilAlt className="text-lg" />
                        </div>
                      </ButtonLink>
                    ) : (
                      <ButtonLink
                        className="bg-primary"
                        href={`/d/final-interview/result-interview/${row.id}/view`}
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
              value: "data.data.job_postings",
              path: `/api/job-postings${params}`,
              validate: "array",
            });
            return result;
          }}
          onCount={async () => {
            const result: any = await apix({
              port: "recruitment",
              value: "data.data.total",
              path: `/api/job-postings?page=1&page_size=1`,
              validate: "object",
            });
            return getNumber(result);
          }}
          onInit={async (list: any) => {}}
        />
      </div>
    </div>
  );
}

export default Page;
