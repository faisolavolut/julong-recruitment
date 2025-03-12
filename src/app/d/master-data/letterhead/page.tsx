"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { FilePreview } from "@/lib/components/form/field/FilePreview";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
    id_document: null,
  });

  useEffect(() => {
    const run = async () => {
      local.can_add = access("create-letterhead");
      local.can_edit = access("edit-letterhead");
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Letterhead"
      name="letterhead-letter"
      filter={false}
      header={{
        sideLeft: (data: any) => {
          return <></>;
          if (!local.can_add)
            return (
              <div className="flex flex-row flex-grow">
                <ButtonLink
                  className="bg-primary"
                  href={"/d/master-data/letterhead/new"}
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
          name: "name",
          header: "Organization",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "logo",
          header: "File",
          renderCell: ({ row, name }: any) => {
            return (
              <FilePreview
                url={getValue(row, name)}
                disabled={true}
                limit_name={5}
              />
            );
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
                  <ButtonLink href={`/d/master-data/letterhead/${row.id}/edit`}>
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/master-data/letterhead/${row.id}/view`}
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
        const params = await events("onload-param", param);
        const result: any = await apix({
          port: "portal",
          value: "data.data.organizations",
          path: `/api/organizations${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async (params: any) => {
        const result: any = await apix({
          port: "portal",
          value: "data.data.total",
          path: `/api/organizations${params}`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
