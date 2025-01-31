"use client";
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
import { HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import get from "lodash.get";
import { TableUI } from "@/lib/components/tablelist/TableUI";

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
    <TableUI
      tab={list}
      onTab={(e: string) => {
        local.tab = e;
        local.render();
      }}
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
                name: "job_posting.document_number",
                header: () => <span>Project Number</span>,
                renderCell: ({ row, name }: any) => {
                  return <>{getValue(row, name)}</>;
                },
              },
              {
                name: "user_profile.name",
                header: () => <span>Applicant Name</span>,
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
                name: "user_profile.work_experiences[0].name",
                header: () => <span>Job Experience</span>,
                renderCell: ({ row, name }: any) => {
                  return <>{getValue(row, name)}</>;
                },
              },
              {
                name: "created_at",
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
          value: "data.data.administrative_results",
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
}

export default Page;
