"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
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
      local.can_add = getAccess("create-activity", roles);
      local.can_edit = getAccess("edit-activity", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <div className="flex flex-col flex-grow ">
      <div className="w-full flex flex-row  p-4 py-6 pr-6 pl-3 text-2xl font-bold">
        Activity
      </div>
      <div className="flex p-4 flex-col flex-grow bg-white rounded-lg border border-gray-300 shadow-md shadow-gray-300">
        <div className="w-full flex flex-row flex-grow bg-white overflow-hidden ">
          <TableList
            name="activity"
            header={{
              sideLeft: (data: any) => {
                if (!local.can_add) return <></>;
                return (
                  <div className="flex flex-row flex-grow">
                    <ButtonLink
                      className="bg-primary"
                      href={"/d/master-data/activity/new"}
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
                header: () => <span>Name</span>,
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
                name: "status",
                header: () => <span>Status</span>,
                renderCell: ({ row, name }: any) => {
                  return getValue(row, name) === "ACTIVE"
                    ? "Active"
                    : "Inactive";
                },
              },
              {
                name: "action",
                header: () => <span>Action</span>,
                sortable: false,
                renderCell: ({ row }: any) => {
                  return (
                    <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                      {local.can_edit ? (
                        <ButtonLink
                          href={`/d/master-data/activity/${row.id}/edit`}
                        >
                          <div className="flex items-center gap-x-2">
                            <HiOutlinePencilAlt className="text-lg" />
                          </div>
                        </ButtonLink>
                      ) : (
                        <ButtonLink
                          className="bg-primary"
                          href={`/d/master-data/activity/${row.id}/view`}
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
                value: "data.data.template_activities",
                path: `/api/template-activities${params}`,
                validate: "array",
              });
              return result;
            }}
            onCount={async () => {
              const result: any = await apix({
                port: "recruitment",
                value: "data.data.total",
                path: `/api/template-activities?page=1&page_size=1`,
                validate: "object",
              });
              return getNumber(result);
            }}
            onInit={async (list: any) => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
