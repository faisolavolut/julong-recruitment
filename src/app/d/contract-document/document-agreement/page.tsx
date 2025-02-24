"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
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
    const run = async () => {};
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
                href={"/d/contract-document/document-agreement/new"}
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
          header: () => <span>Document No.</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "created_at",
          header: () => <span>Send Date</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "applicant.user_profile.name",
          header: () => <span>Recipient's Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_sending.job_posting.project_recruitment_header.name",
          header: () => <span>Project Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_sending.job_posting.job_name",
          header: () => <span>Job Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_sending.job_posting.recruitment_type",
          header: () => <span>Recruitment Type</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "status",
          header: () => <span>Status</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getLabel(getValue(row, name))}</>;
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
                  href={`/d/contract-document/document-agreement/${row.id}/view`}
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
          (item: any) => item.name === "CONTRACT_DOCUMENT"
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
          (item: any) => item.name === "CONTRACT_DOCUMENT"
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
