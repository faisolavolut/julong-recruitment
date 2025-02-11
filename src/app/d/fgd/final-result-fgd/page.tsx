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
import { IoEye } from "react-icons/io5";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { TableUI } from "@/lib/components/tablelist/TableUI";

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
      local.can_add = access("create-schedule-fgd");
      local.can_edit = access("edit-schedule-fgd");
      const result: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/interviews?page=1&page_size=1&status=IN PROGRESS`,
        validate: "object",
      });
      const completed: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/interviews?page=1&page_size=1&status=COMPLETED`,
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
      title="Final Result FGD"
      tab={local.list}
      onTab={(e: string) => {
        local.tab = e;
        local.render();
      }}
      name="result-test"
      header={{
        sideLeft: (data: any) => {
          return <></>;
        },
      }}
      column={[
        {
          name: "project_recruitment_line.template_activity_line.name",
          header: () => <span>Schedule Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "name",
          header: () => <span>Schedule Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "start_date",
          header: () => <span>Schedule Date</span>,
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
                <ButtonLink
                  className="bg-primary"
                  href={`/d/fgd/final-result-fgd/${row.id}/view`}
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
    />
  );
}

export default Page;
