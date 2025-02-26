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
      local.can_add = getAccess("create-offering-letter", roles);
      local.can_edit = getAccess("edit-offering-letter", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Candidate Agreement"
      name="offering-letter"
      header={{
        sideLeft: (data: any) => {
          if (!local.can_add) return <></>;
          return (
            <div className="flex flex-row flex-grow">
              <ButtonLink
                className="bg-primary"
                href={"/d/offering-letter/offering-letter-document/new"}
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
          name: "document_sending.document_number",
          header: "Document No.",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "created_at",
          header: "Send Date",
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "applicant.user_profile.name",
          header: "Recipient's Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_sending.job_posting.project_recruitment_header.name",
          header: "Project Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_sending.job_posting.job_name",
          header: "Job Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_sending.job_posting.recruitment_type",
          header: "Recruitment Type",
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
                <ButtonLink
                  className="bg-primary"
                  href={`/d/offering-letter/offering-letter-agreement/${row.id}/view`}
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
        const res: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-types",
          validate: "array",
        });
        const findDocument = res.find(
          (item: any) => item.name === "OFFERING_LETTER"
        );
        const params = await events("onload-param", {
          ...param,
          document_type_id: findDocument?.id,
        });
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.document_agreements",
          path: `/api/document-agreement${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async () => {
        const res: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-types",
          validate: "array",
        });
        const findDocument = res.find(
          (item: any) => item.name === "OFFERING_LETTER"
        );
        const params = await events("onload-param", {
          document_type_id: findDocument?.id,
          paging: 1,
          take: 1,
        });

        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/document-agreement${params}`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
