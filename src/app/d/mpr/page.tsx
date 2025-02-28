"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access, getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { IoEye, IoSync } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getLabel } from "@/lib/utils/getLabel";
import { ButtonBetter, ButtonBetterTooltip } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { templateContentJobPosting } from "@/app/lib/templateContent";
import { RiAiGenerate } from "react-icons/ri";
import { normalDate } from "@/lib/utils/date";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
    tab: "IN PROGRESS",
    list: [
      { id: "IN PROGRESS", name: "On Going", count: 0 },
      { id: "COMPLETED", name: "Completed", count: 0 },
    ],
    sync: false,
    ready: true,
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
        path: `/api/mp-requests?page=1&page_size=1&status=COMPLETED`,
        validate: "object",
      });
      local.list = [
        { id: "IN PROGRESS", name: "On Going", count: getNumber(result) },
        { id: "COMPLETED", name: "Completed", count: getNumber(completed) },
      ];
      local.sync = access("sync-mpr");
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
      title="MPR"
      name="mpr"
      header={{
        sideLeft: (data: any) => {
          if (!local.sync) return <></>;
          return (
            <div className="flex flex-row items-center gap-x-2">
              <ButtonBetter
                onClick={async () => {
                  local.ready = false;
                  local.render();
                  await actionToast({
                    task: async () => {
                      await apix({
                        port: "mpp",
                        path: `/api/job-plafons/sync`,
                        method: "get",
                      });
                    },
                    after: () => {
                      window.location.reload();
                      local.ready = true;
                      local.render();
                    },
                    msg_load: "Synchronization ",
                    msg_error: "Synchronization failed ",
                    msg_succes: "Synchronization success ",
                  });
                }}
              >
                <IoSync className={cx(!local.ready ? "animate-spin" : "")} />{" "}
                Synchronization
              </ButtonBetter>
            </div>
          );
        },
      }}
      column={[
        {
          name: "document_number",
          header: "MPR Number",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting_document_number",
          header: "Project Number",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "organization_name",
          header: "Organization",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_name",
          header: "Job Position",
          renderCell: ({ row, name }: any) => {
            return <>{getLabel(getValue(row, name))}</>;
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
                <ButtonLink href={`/d/mpr/${row?.mpr_clone_id}/view`}>
                  <div className="flex items-center gap-x-2">
                    <IoEye className="text-lg" />
                  </div>
                </ButtonLink>
                {row?.job_posting_id ? (
                  <>
                    <ButtonBetterTooltip
                      tooltip={"View Job Posting"}
                      className="bg-primary"
                      href={
                        "/d/job/job-posting" + row?.job_posting_id + "/edit"
                      }
                    >
                      <div className="flex items-center gap-x-2">
                        <RiAiGenerate className="text-lg" />
                      </div>
                    </ButtonBetterTooltip>
                  </>
                ) : (
                  <>
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
                              start_date: normalDate(
                                data?.mpp_period?.start_date
                              ),
                              end_date: normalDate(data?.mpp_period?.end_date),
                              recruitment_type: data?.recruitment_type,
                              salary_min: 0,
                              salary_max: 0,
                              minimum_work_experience: data?.minimum_experience,
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
                  </>
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
          value: "data.data.mp_request_header",
          path: `/api/mp-requests${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async (params: any) => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/mp-requests${params}`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
