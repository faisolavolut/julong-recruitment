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
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getParams } from "@/lib/utils/get-params";
import { detectUniqueExperience } from "@/app/lib/workExperiences";
import { ButtonBetterTooltip } from "@/lib/components/ui/button";

function Page() {
  const id_posting = getParams("id_posting");
  const local = useLocal({
    can_add: false,
    can_edit: false,
    tab: "IN PROGRESS",
    list: [
      { id: "IN PROGRESS", name: "In Progress", count: 0 },
      { id: "COMPLETED", name: "Completed", count: 0 },
    ],
    breadcrumb: [] as any,
  });

  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_add = getAccess("create-applicant-overview", roles);
      local.can_edit = getAccess("edit-applicant-overview", roles);
      const result: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/applicants/job-posting/${id_posting}?page=1&page_size=1&order=1`,
        validate: "object",
      });
      const completed: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/applicants/job-posting/${id_posting}?page=1&page_size=1&status=COMPLETED&order=1`,
        validate: "object",
      });
      local.list = [
        { id: "IN PROGRESS", name: "In Progress", count: getNumber(result) },
        { id: "COMPLETED", name: "Completed", count: getNumber(completed) },
      ];

      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/job-postings/${id_posting}`,
        validate: "object",
      });
      local.breadcrumb = [
        {
          title: "List Job Posting",
          url: "/d/administrative/applicant-overview",
        },
        {
          title: data.document_number,
        },
      ];
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      tab={local.list}
      onTab={(e: string) => {
        local.tab = e;
        local.render();
      }}
      breadcrumb={local.breadcrumb}
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
        local.tab === "IN PROGRESS"
          ? [
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
                name: "user_profile.work_experiencess[0].name",
                header: () => <span>Job Experience</span>,
                renderCell: ({ row, name }: any) => {
                  return (
                    <>
                      {detectUniqueExperience(
                        getValue(row, "user_profile.work_experiences")
                      )}
                    </>
                  );
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
                      <ButtonBetterTooltip
                        tooltip={"View Profile"}
                        className="bg-primary"
                        href={`/d/administrative/applicant-overview/${id_posting}/${row.user_profile_id}/view`}
                      >
                        <div className="flex items-center gap-x-2">
                          <IoEye className="text-lg" />
                        </div>
                      </ButtonBetterTooltip>
                    </div>
                  );
                },
              },
            ]
          : [
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
                name: "user_profile.work_experiencess[0].name",
                header: () => <span>Job Experience</span>,
                renderCell: ({ row, name }: any) => {
                  return (
                    <>
                      {detectUniqueExperience(
                        getValue(row, "user_profile.work_experiences")
                      )}
                    </>
                  );
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
                      <ButtonBetterTooltip
                        tooltip={"View Profile"}
                        className="bg-primary"
                        href={`/d/administrative/applicant-overview/${id_posting}/${row.user_profile_id}/view`}
                      >
                        <div className="flex items-center gap-x-2">
                          <IoEye className="text-lg" />
                        </div>
                      </ButtonBetterTooltip>
                    </div>
                  );
                },
              },
            ]
      }
      onLoad={async (param: any) => {
        const params = await events("onload-param", { ...param, order: 1 });
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.applicants",
          path: `/api/applicants/job-posting/${id_posting}${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/applicants/job-posting/${id_posting}?page=1&page_size=1&order=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
