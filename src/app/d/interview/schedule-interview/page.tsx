"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { dayDate, formatTime } from "@/lib/utils/date";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getLabel } from "@/lib/utils/getLabel";

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
      local.can_add = access("create-schedule-interview");
      local.can_edit = access("edit-schedule-interview");
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
      title="Schedule Interview"
      tab={local.list}
      onTab={(e: string) => {
        local.tab = e;
        local.render();
      }}
      name="result-test"
      header={{
        sideLeft: (data: any) => {
          if (!local.can_add) return <></>;
          return (
            <div className="flex flex-row flex-grow">
              <ButtonLink
                className="bg-primary"
                href={"/d/interview/schedule-interview/new"}
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
          name: "project_recruitment_header.document_number",
          header: "Project Number",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.document_number",
          header: "Job Posting Number",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.name",
          header: "Job Title",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "project_recruitment_line.template_activity_line.name",
          header: "Activity Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "name",
          header: "Schedule Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "schedule_date",
          header: "Schedule Date",
          type: "date",
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "start_time",
          header: "Start Time",
          renderCell: ({ row, name }: any) => {
            return <>{formatTime(getValue(row, name))}</>;
          },
        },
        {
          name: "end_time",
          header: "End Time",
          renderCell: ({ row, name }: any) => {
            return <>{formatTime(getValue(row, name))}</>;
          },
        },
        {
          name: "total_candidate",
          header: "Total Candidates",
          renderCell: ({ row, name }: any) => {
            return <>{formatMoney(getValue(row, name))}</>;
          },
        },
        {
          name: "status",
          header: "Status",
          renderCell: ({ row, name }: any) => {
            return <>{getLabel(getValue(row, name))}</>;
          },
        },
        {
          name: "action",

          header: "Action",
          filter: false,
          sortable: false,
          renderCell: ({ row }: any) => {
            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                {local.can_edit ? (
                  <ButtonLink
                    href={`/d/interview/schedule-interview/${row.id}/edit`}
                  >
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/interview/schedule-interview/${row.id}/view`}
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
        const params = await events(
          "onload-param",
          local?.tab === "IN PROGRESS"
            ? {
                ...param,
              }
            : {
                ...param,
                status: "COMPLETED",
              }
        );
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.interviews",
          path: `/api/interviews${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async (params: any) => {
        const param = await events(
          "onload-param",
          local?.tab === "IN PROGRESS"
            ? {}
            : {
                status: "COMPLETED",
              },
          params
        );
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/interviews${param}`,
          validate: "object",
        });
        return getNumber(result);
      }}
    />
  );
}

export default Page;
