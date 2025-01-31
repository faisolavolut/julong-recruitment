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
import { TableUI } from "@/lib/components/tablelist/TableUI";
import get from "lodash.get";
import { formatMoney } from "@/lib/components/form/field/TypeInput";

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
      local.can_add = getAccess("create-selection-setup", roles);
      local.can_edit = getAccess("edit-selection-setup", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      tab={list}
      onTab={(e: string) => {
        local.tab = e;
        local.render();
      }}
      title="Selection Setup"
      name="selection-setup"
      header={{
        sideLeft: (data: any) => {
          return <></>;
          if (!local.can_add) return <></>;
          return (
            <div className="flex flex-row flex-grow">
              <ButtonLink
                className="bg-primary"
                href={"/d/administrative/selection-setup/new"}
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
          name: "document_number",
          header: () => <span>Project Number</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.job_name",
          header: () => <span>Job Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.start_date",
          header: () => <span>Start Date</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "job_posting.end_date",
          header: () => <span>End Date</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "project_pic.name",
          header: () => <span>PIC</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "total_applicants",
          header: () => <span>Total Candidates</span>,
          renderCell: ({ row, name }: any) => {
            return <>{formatMoney(getNumber(getValue(row, name)))}</>;
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
                {local.can_edit ? (
                  <ButtonLink
                    href={`/d/administrative/selection-setup/${row.id}/edit`}
                  >
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/administrative/selection-setup/${row.id}/view`}
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
          value: "data.data.administrative_selections",
          path: `/api/administrative-selections${params}`,
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
          <span className="">Selection Setup</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white overflow-hidden ">
        <TableList
          name="selection-setup"
          header={{
            sideLeft: (data: any) => {
              if (!local.can_add) return <></>;
              return (
                <div className="flex flex-row flex-grow">
                  <ButtonLink
                    className="bg-primary"
                    href={"/d/administrative/selection-setup/new"}
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
              name: "project_number",
              header: () => <span>Project Number</span>,
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
              name: "start_date",
              header: () => <span>Start Date</span>,
              renderCell: ({ row, name }: any) => {
                return <>{dayDate(getValue(row, name))}</>;
              },
            },
            {
              name: "end_date",
              header: () => <span>End Date</span>,
              renderCell: ({ row, name }: any) => {
                return <>{dayDate(getValue(row, name))}</>;
              },
            },
            {
              name: "pic",
              header: () => <span>PIC</span>,
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "total_candidates",
              header: () => <span>Total Candidates</span>,
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
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
                    {local.can_edit ? (
                      <ButtonLink
                        href={`/d/administrative/selection-setup/${row.id}/edit`}
                      >
                        <div className="flex items-center gap-x-2">
                          <HiOutlinePencilAlt className="text-lg" />
                        </div>
                      </ButtonLink>
                    ) : (
                      <ButtonLink
                        className="bg-primary"
                        href={`/d/administrative/selection-setup/${row.id}/view`}
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
