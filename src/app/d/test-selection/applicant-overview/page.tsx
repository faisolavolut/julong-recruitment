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
import { HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getLabel } from "@/lib/utils/getLabel";

function Page() {
  const local = useLocal({
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
    <TableUI
      title="Applicant Overview"
      name="applicant-overview"
      header={{
        sideLeft: (data: any) => {
          return <></>;
          if (!local.can_add) return <></>;
          return (
            <div className="flex flex-row flex-grow">
              <ButtonLink
                className="bg-primary"
                href={"/d/test-selection/applicant-overview/new"}
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
          name: "no_reference_project",
          header: "No Reference Project",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "test_schedule",
          header: "Test Schedule",
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "applicant_name",
          header: "Applicant Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_name",
          header: "Job Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "gpa",
          header: "GPA",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "major",
          header: "Major",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_experience",
          header: "Job Experience",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "applied_date",
          header: "Applied Date",
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
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
                <ButtonLink
                  className="bg-primary"
                  href={`/d/test-selection/applicant-overview/${row.id}/view`}
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
      onCount={async (params: any) => {
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
}

export default Page;
