"use client";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoEye } from "react-icons/io5";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
  });

  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_add = getAccess("create-major", roles);
      local.can_edit = getAccess("edit-major", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Major"
      name="major"
      header={{
        sideLeft: (data: any) => {
          return <></>;
        },
      }}
      column={[
        {
          name: "name",
          header: "Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "description",
          header: "Description",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "status",
          header: "Status",
          renderCell: ({ row, name }: any) => {
            return getValue(row, name) === "ACTIVE" ? "Active" : "Inactive";
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
                  <ButtonLink href={`/d/master-data/major/${row.id}/edit`}>
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/master-data/major/${row.id}/view`}
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
          port: "recruitment",
          value: "data.data",
          path: `/api/major${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async (params: any) => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/major?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
