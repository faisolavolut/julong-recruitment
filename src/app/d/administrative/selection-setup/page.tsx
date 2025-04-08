"use client";
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
import { getLabel } from "@/lib/utils/getLabel";
import get from "lodash.get";
import { formatMoney } from "@/lib/components/form/field/TypeInput";

function Page() {
  const list = [
    { id: "IN PROGRESS", name: "In Progress" },
    { id: "completed", name: "Completed" },
  ];
  const local = useLocal({
    tab: get(list, "[0].id"),
    can_add: false,
    can_edit: false,
    list: [
      { id: "IN PROGRESS", name: "On Going", count: 0 },
      { id: "COMPLETED", name: "Completed", count: 0 },
    ],
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
      title="Selection Setup"
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
          name: "document_number",
          header: "Job Posting Number",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.project_recruitment_header.document_number",
          header: "Job Posting Number",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.name",
          header: "Job Name",
          renderCell: ({ row, name }: any) => {
            return (
              <>
                {getValue(row, name) || getValue(row, "job_posting.job_name")}
              </>
            );
          },
        },
        {
          name: "job_posting.start_date",
          header: "Start Date",
          labelFilter: "Date",
          placeholderFilter: ["Start Date", "End Date"],
          type: "date",
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "job_posting.end_date",
          header: "End Date",
          filter: false,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "project_pic.name",
          header: "PIC",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "total_applicants",
          header: "Total Candidates",
          renderCell: ({ row, name }: any) => {
            return <>{formatMoney(getNumber(getValue(row, name)))}</>;
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
      onCount={async (params: any) => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/administrative-selections?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
