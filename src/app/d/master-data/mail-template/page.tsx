"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
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
    <div className="flex p-4 flex-col flex-grow bg-white rounded-lg border border-gray-300 shadow-md shadow-gray-300">
      <div className="flex flex-col py-4 pb-0 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Mail Template</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white  overflow-hidden ">
        <TableList
          name="period"
          header={{
            sideLeft: (data: any) => {
              if (!local.can_add) return <></>;
              if (!local.can_edit) return <></>;
              return (
                <>
                  <div className="flex flex-row flex-grow">
                    <ButtonLink
                      className="bg-primary"
                      href={"/d/master-data/mail-template//new"}
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
              header: () => <span>Template</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "document_type.name",
              header: () => <span>Document Type</span>,
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
              header: () => <span>Status</span>,
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
              header: () => <span>Action</span>,
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
                      <ButtonLink
                        href={`/d/master-data/question/${row.id}/edit`}
                      >
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
      </div>
    </div>
  );
}

export default Page;
