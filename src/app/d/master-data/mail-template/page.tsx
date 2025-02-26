"use client";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { labelDocumentType } from "@/lib/utils/document_type";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
  });
  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_add = getAccess("create-template-mail", roles);
      local.can_edit = getAccess("edit-template-mail", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Mail Template"
      name="mail-template"
      header={{
        sideLeft: (data: any) => {
          if (!local.can_add) return <></>;
          if (!local.can_edit) return <></>;
          return (
            <>
              <div className="flex flex-row flex-grow">
                <ButtonLink
                  className="bg-primary"
                  href={"/d/master-data/mail-template/new"}
                >
                  <div className="flex items-center gap-x-0.5">
                    <HiPlus className="text-xl" />
                    <span className="capitalize">Add New</span>
                  </div>
                </ButtonLink>
              </div>
            </>
          );
        },
      }}
      column={[
        {
          name: "name",
          header: "Template",
          renderCell: ({ row, name, cell }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "document_type.name",
          header: "Document Type",
          renderCell: ({ row, name, cell }: any) => {
            return labelDocumentType(getValue(row, name));
            switch (getValue(row, name)) {
              case "ADMINISTRATIVE_SELECTION":
                return "Administrative";
                break;
              case "TEST":
                return "Test";
                break;

              case "INTERVIEW":
                return "Interview";
                break;

              case "FGD":
                return "FGD";
                break;

              case "FINAL_INTERVIEW":
                return "Final Interview";
                break;

              case "OFFERING_LETTER":
                return "Offering Letter";
                break;

              case "CONTRACT_DOCUMENT":
                return "Contract Document";
                break;

              case "DOCUMENT_CHECKING":
                return "Document Checking";
                break;

              default:
                return getValue(row, name);
            }
          },
        },
        {
          name: "status",
          header: "Status",
          renderCell: ({ row, name, cell }: any) => {
            switch (getValue(row, name)) {
              case "ACTIVE":
                return "Active";
                break;
              default:
                return "Inactive";
            }
          },
        },
        {
          name: "action",

          header: "Action",
          filter: false,
          sortable: false,
          renderCell: ({ row, name, cell }: any) => {
            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                <ButtonLink
                  href={`/d/master-data/mail-template/${row.id}/edit`}
                >
                  <div className="flex items-center gap-x-2">
                    <HiOutlinePencilAlt className="text-lg" />
                  </div>
                </ButtonLink>
              </div>
            );
            if (getValue(row, "status") !== "draft") {
              return (
                <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/master-data/question/${row.id}/view`}
                  >
                    <div className="flex items-center gap-x-2">
                      <IoEye className="text-lg" />
                    </div>
                  </ButtonLink>
                </div>
              );
            } else {
              if (!local.can_edit) return <></>;
              return (
                <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                  <ButtonLink href={`/d/master-data/question/${row.id}/edit`}>
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                </div>
              );
            }
          },
        },
      ]}
      onLoad={async (param: any) => {
        const params = await events("onload-param", param);
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.mail_templates",
          path: `/api/mail-templates${params}`,
          validate: "array",
        });
        console.log({ result });
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/mail-templates?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
