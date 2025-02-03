"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { getStatusLabel } from "@/constants/status-mpp";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { ButtonBetterTooltip } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { templateContentJobPosting } from "@/app/lib/templateContent";
import { RiAiGenerate } from "react-icons/ri";
import { normalDate } from "@/lib/utils/date";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
    tab: "on_going",
    list: [
      { id: "on_going", name: "On Going", count: 0 },
      { id: "completed", name: "Completed", count: 0 },
    ],
  });

  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_add = getAccess("create-mpr", roles);
      local.can_edit = getAccess("edit-mpr", roles);
      const result: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/mp-requests?page=1&page_size=1`,
        validate: "object",
      });
      const completed: any = await apix({
        port: "recruitment",
        value: "data.data.total",
        path: `/api/mp-requests?page=1&page_size=1`,
        validate: "object",
      });
      local.list = [
        { id: "on_going", name: "On Going", count: getNumber(result) },
        { id: "completed", name: "Completed", count: getNumber(completed) },
      ];
      local.render();
      console.log(local.list);
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
      title="MPR"
      name="mpr"
      header={{
        sideLeft: (data: any) => {
          return <></>;
        },
      }}
      column={[
        {
          name: "document_number",
          header: () => <span>MPR Number</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "project_number",
          header: () => <span>Project Number</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "organization_name",
          header: () => <span>Organization</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "for_organization_name",
          header: () => <span>Company</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "recruitment_type",
          header: () => <span>Recruitment Type</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "mp_request_type",
          header: () => <span>Request Type</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getStatusLabel(getValue(row, name))}</>;
          },
        },
        {
          name: "status",
          header: () => <span>Status Recruitment</span>,
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
                <ButtonLink href={`/d/mpr/${row?.mpr_clone_id}/view`}>
                  <div className="flex items-center gap-x-2">
                    <IoEye className="text-lg" />
                  </div>
                </ButtonLink>
                <ButtonBetterTooltip
                  tooltip={"Generate MPR Job Posting"}
                  className="bg-primary"
                  onClick={async () => {
                    await actionToast({
                      task: async () => {
                        const data: any = await apix({
                          port: "mpp",
                          value: "data.data",
                          path: "/api/mp-requests/" + row?.mpr_clone_id,
                          validate: "object",
                        });
                        const document_number = await apix({
                          port: "recruitment",
                          value: "data.data",
                          path: "/api/job-postings/document-number",
                        });
                        const content_description =
                          templateContentJobPosting(data);

                        const header: any = await apix({
                          port: "recruitment",
                          value: "data.data.project_recruitment_headers",
                          path: "/api/project-recruitment-headers?page=1&page_size=1&status=IN PROGRESS",
                          validate: "dropdown",
                          keys: {
                            label: "document_number",
                          },
                        });
                        const result = {
                          document_number,
                          status: "DRAFT",
                          mp_request_id: row.id,
                          job_name: data?.job_name,
                          job_id: data?.job_id,
                          for_organization_id: data?.for_organization_id,
                          for_organization_location_id:
                            data?.for_organization_location_id,
                          content_description,
                          document_date: normalDate(data?.document_date),
                          start_date: normalDate(data?.mpp_period?.start_date),
                          end_date: normalDate(data?.mpp_period?.end_date),
                          recruitment_type: data?.recruitment_type,
                          salary_min: 0,
                          salary_max: 0,
                          minimum_experience: data?.minimum_experience,
                          project_recruitment_header_id: header?.[0]?.value,
                        };
                        const res = await apix({
                          port: "recruitment",
                          value: "data.data",
                          path: "/api/job-postings",
                          method: "post",
                          type: "form",
                          data: {
                            ...result,
                          },
                        });
                        if (res?.id)
                          navigate(`/d/job/job-posting/${res?.id}/edit`);
                      },
                      after: () => {},
                      msg_load: "Create MPR Job Posting ",
                      msg_error: "Create MPR Job Posting failed ",
                      msg_succes: "MPR Job Posting success ",
                    });
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <RiAiGenerate className="text-lg" />
                  </div>
                </ButtonBetterTooltip>
              </div>
            );
          },
        },
      ]}
      onLoad={async (param: any) => {
        const params = await events("onload-param", param);
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.mp_request_header",
          path: `/api/mp-requests${params}`,
          validate: "array",
        });
        // return [{}, {}, {}, {}];
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/mp-requests?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
