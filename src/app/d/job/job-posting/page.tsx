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
import { GrNotes } from "react-icons/gr";
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
      local.can_add = getAccess("create-job-posting", roles);
      local.can_edit = getAccess("edit-job-posting", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Job Posting"
      name="job-posting"
      header={{
        sideLeft: (data: any) => {
          if (!local.can_add) return <></>;
          return (
            <div className="flex flex-row flex-grow">
              <ButtonLink
                className="bg-primary"
                href={"/d/job/job-posting/new"}
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
          name: "link",
          header: "Link Job Posting",
          renderCell: ({ row, name }: any) => {
            return (
              <a
                href={getValue(row, name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getValue(row, name)}
              </a>
            );
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
          name: "recruitment_type",
          header: "Recruitment Type",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "for_organization_name",
          header: "Company",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "amount_job",
          header: "Amount Job",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "total_applicant",
          header: "Total Applicant",
          renderCell: ({ row, name }: any) => {
            return <>{getNumber(getValue(row, name))}</>;
          },
        },
        {
          name: "end_date",
          header: "Activity Status",
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
                {local.can_edit ? (
                  <ButtonLink href={`/d/job/job-posting/${row.id}/edit`}>
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/job/job-posting/${row.id}/view`}
                  >
                    <div className="flex items-center gap-x-2">
                      <IoEye className="text-lg" />
                    </div>
                  </ButtonLink>
                )}
                <ButtonLink
                  className="bg-primary"
                  href={`/job-posting/${row.id}/edit`}
                >
                  <div className="flex items-center gap-x-2">
                    <GrNotes className="text-lg" />
                  </div>
                </ButtonLink>
              </div>
            );
          },
        },
      ]}
      onLoad={async (param: any) => {
        const params = await events("onload-param", {
          ...param,
        });
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
