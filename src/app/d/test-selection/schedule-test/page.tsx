"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { dayDate, formatTime } from "@/lib/utils/date";
import { getStatusLabel } from "@/constants/status-mpp";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { formatMoney } from "@/lib/components/form/field/TypeInput";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
    list: [
      { id: "IN PROGRESS", name: "On Going", count: 0 },
      { id: "COMPLETED", name: "Completed", count: 0 },
    ],
    tab: "IN PROGRESS",
  });

  useEffect(() => {
    const run = async () => {
      local.can_add = access("create-schedule-test");
      local.can_edit = access("edit-schedule-test");
      const result: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/test-schedule-headers?page=1&page_size=1`,
        validate: "object",
      });
      const completed: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/test-schedule-headers?page=1&page_size=1&status=COMPLETED`,
        validate: "object",
      });
      local.list = [
        { id: "IN PROGRESS", name: "On Going", count: getNumber(result) },
        { id: "COMPLETED", name: "Completed", count: getNumber(completed) },
      ];
      local.render();
    };
    run();
  }, []);
  return (
    <TableUI
      title="Monitoring Test Schedule"
      tab={local.list}
      onTab={(e: string) => {
        local.tab = e;
        local.render();
      }}
      name="schedule-test"
      header={{
        sideLeft: (data: any) => {
          if (!local.can_add) return <></>;
          return (
            <div className="flex flex-row flex-grow">
              <ButtonLink
                className="bg-primary"
                href={"/d/test-selection/schedule-test/new"}
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
          name: "name",
          header: () => <span>Schedule Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "start_date",
          header: () => <span>Schedule Test</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "start_time",
          header: () => <span>Start Time</span>,
          renderCell: ({ row, name }: any) => {
            return <>{formatTime(getValue(row, name))}</>;
          },
        },
        {
          name: "end_time",
          header: () => <span>End Time</span>,
          renderCell: ({ row, name }: any) => {
            return <>{formatTime(getValue(row, name))}</>;
          },
        },
        {
          name: "total_candidate",
          header: () => <span>Total Candidates</span>,
          renderCell: ({ row, name }: any) => {
            return <>{formatMoney(getValue(row, name))}</>;
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
                {row?.status === "DRAFT" && local.can_edit ? (
                  <ButtonLink
                    href={`/d/test-selection/schedule-test/${row.id}/edit`}
                  >
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/test-selection/schedule-test/${row.id}/view`}
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
          value: "data.data.test_schedule_headers",
          path: `/api/test-schedule-headers${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/test-schedule-headers?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
