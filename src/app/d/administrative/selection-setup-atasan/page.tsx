"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { dayDate } from "@/lib/utils/date";
import { getStatusLabel } from "@/constants/status-mpp";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { TabHeader } from "@/lib/components/tablist/TabHeader";
import get from "lodash.get";

function Page() {
  const list = [
    { id: "in_progress", name: "In Progress" },
    { id: "completed", name: "Completed" },
  ];
  const local = useLocal({
    tab: get(list, "[0].id"),
    can_add: false,
    can_edit: false,
  });

  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_add = getAccess("create-applicant-overview", roles);
      local.can_edit = getAccess("edit-applicant-overview", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <div className="flex p-4 flex-col flex-grow bg-white rounded-lg border border-gray-300 shadow-md shadow-gray-300">
      <div className="flex flex-col py-4 pb-0 pt-0">
        <div className="flex flex-row items-center gap-x-4">
          <h2 className="text-xl font-semibold text-gray-900 ">
            <span className="">Applicant Overview</span>
          </h2>
          <div>
            <TabHeader
              disabledPagination={true}
              onLabel={(row: any) => {
                return row.name;
              }}
              onValue={(row: any) => {
                return row.id;
              }}
              onLoad={list}
              onChange={(tab: any) => {
                local.tab = tab?.id;
                local.render();
              }}
              tabContent={(data: any) => {
                return <></>;
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white overflow-hidden ">
        <TableList
          name="applicant-overview"
          header={{
            sideLeft: (data: any) => {
              if (!local.can_add) return <></>;
              return (
                <div className="flex flex-row flex-grow">
                  <ButtonLink
                    className="bg-primary"
                    href={"/d/administrative/applicant-overview/new"}
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
          column={
            local.tab === "in_progress"
              ? [
                  {
                    name: "project_number",
                    header: () => <span>Project Number</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "applicant_name",
                    header: () => <span>Applicant Name</span>,
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
                    name: "gpa",
                    header: () => <span>GPA</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "major",
                    header: () => <span>Major</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "job_experience",
                    header: () => <span>Job Experience</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "applied_date",
                    header: () => <span>Applied Date</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{dayDate(getValue(row, name))}</>;
                    },
                  },
                  {
                    name: "status",
                    header: () => <span>Status</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getStatusLabel(getValue(row, name))}</>;
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
                            href={`/d/administrative/applicant-overview/${row.id}/view`}
                          >
                            <div className="flex items-center gap-x-2">
                              <IoEye className="text-lg" />
                            </div>
                          </ButtonLink>
                        </div>
                      );
                    },
                  },
                ]
              : [
                  {
                    name: "project_number",
                    header: () => <span>Project Number</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "applicant_name",
                    header: () => <span>Applicant Name</span>,
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
                    name: "gpa",
                    header: () => <span>GPA</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "major",
                    header: () => <span>Major</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "job_experience",
                    header: () => <span>Job Experience</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "applied_date",
                    header: () => <span>Applied Date</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{dayDate(getValue(row, name))}</>;
                    },
                  },
                  {
                    name: "selection_result",
                    header: () => <span>Selection Result</span>,
                    renderCell: ({ row, name }: any) => {
                      return <>{getStatusLabel(getValue(row, name))}</>;
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
                            href={`/d/administrative/applicant-overview/${row.id}/view`}
                          >
                            <div className="flex items-center gap-x-2">
                              <IoEye className="text-lg" />
                            </div>
                          </ButtonLink>
                        </div>
                      );
                    },
                  },
                ]
          }
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
