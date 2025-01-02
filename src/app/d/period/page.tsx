"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { getStatusLabel } from "@/constants/status-mpp";
import api from "@/lib/utils/axios";
import { shortDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { Button } from "flowbite-react";
import Link from "next/link";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus, HiTrash } from "react-icons/hi";
import { IoEye } from "react-icons/io5";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
  });
  useEffect(() => {
    const run = async () => {
      const check = await api.get(
        `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods/status?status=open`
      );

      const roles = await userRoleMe();
      if (!check.data.data?.mppperiod)
        local.can_add = getAccess("create-period", roles);
      local.can_edit = getAccess("edit-period", roles);
      local.render();
    };
    run();
  }, []);
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Period</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden shadow">
        <TableList
          name="period"
          header={{
            sideLeft: (data: any) => {
              if (!local.can_add) return <></>;
              if (!local.can_edit) return <></>;
              return (
                <>
                  <div className="flex flex-row flex-grow">
                    <ButtonLink className="bg-primary" href={"/d/period/new"}>
                      <div className="flex items-center gap-x-0.5">
                        <HiPlus className="text-xl" />
                        <span className="capitalize">Add New</span>
                      </div>
                    </ButtonLink>
                  </div>
                </>
              );
            },
          }}
          column={[
            {
              name: "title",
              header: () => <span>title</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "start_date",
              header: () => <span>Start Date</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{shortDate(getValue(row, name))}</>;
              },
            },
            {
              name: "end_date",
              header: () => <span>End Date</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{shortDate(getValue(row, name))}</>;
              },
            },
            {
              name: "budget_start_date",
              header: () => <span>Budget Start Date</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{shortDate(getValue(row, name))}</>;
              },
            },
            {
              name: "budget_end_date",
              header: () => <span>Budget End Date</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{shortDate(getValue(row, name))}</>;
              },
            },
            {
              name: "status",
              header: () => <span>Status</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getStatusLabel(getValue(row, name))}</>;
              },
            },
            {
              name: "action",
              header: () => <span>Action</span>,
              sortable: false,
              renderCell: ({ row, name, cell }: any) => {
                if (getValue(row, "status") !== "draft") {
                  return (
                    <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                      <ButtonLink
                        className="bg-primary"
                        href={`/d/period/${row.id}/view`}
                      >
                        <div className="flex items-center gap-x-2">
                          <IoEye className="text-lg" />
                        </div>
                      </ButtonLink>
                    </div>
                  );
                } else {
                  if (!local.can_edit) return <></>;
                  return (
                    <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                      <ButtonLink
                        className="bg-primary"
                        href={`/d/period/${row.id}/edit`}
                      >
                        <div className="flex items-center gap-x-2">
                          <HiOutlinePencilAlt className="text-lg" />
                        </div>
                      </ButtonLink>
                    </div>
                  );
                }
              },
            },
          ]}
          onLoad={async (param: any) => {
            const params = await events("onload-param", param);
            const res: any = await api.get(
              `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods` + params
            );
            const data: any[] = res.data.data.mppperiods;

            return data || [];
          }}
          onInit={async (list: any) => {}}
        />
      </div>
    </div>
  );
}

export default Page;
