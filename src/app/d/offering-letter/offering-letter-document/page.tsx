"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { dayDate } from "@/lib/utils/date";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getLabel } from "@/lib/utils/getLabel";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
    id_document: null,
  });

  useEffect(() => {
    const run = async () => {
      local.can_add = access("create-offering-letter-document");
      local.can_edit = access("edit-offering-letter-document");
      const res: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: "/api/document-types",
        validate: "array",
      });
      const findDocument = res.find(
        (item: any) => item.name === "OFFERING_LETTER"
      );
      local.id_document = findDocument?.id;
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Offering Letter Document"
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
          name: "document_number",
          header: "Document No.",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_setup.title",
          header: "Document Type",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_date",
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
          name: "job_posting.project_recruitment_header.name",
          header: "Project Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.job_name",
          header: "Job Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_posting.recruitment_type",
          header: "Recruitment Type",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        // document_setup
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
                    href={`/d/offering-letter/offering-letter-document/${row.id}/edit`}
                  >
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/offering-letter/offering-letter-document/${row.id}/view`}
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
          value: "data.data.document_sendings",
          path: `/api/document-sending${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async (params: any) => {
        const res: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-types",
          validate: "array",
        });
        const findDocument = res.find(
          (item: any) => item.name === "OFFERING_LETTER"
        );
        const param = await events(
          "onload-param",
          {
            document_type_id: findDocument?.id,
          },
          params
        );

        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/document-sending${param}`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
