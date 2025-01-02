"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonBetter } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import api from "@/lib/utils/axios";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { Button } from "flowbite-react";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus, HiTrash } from "react-icons/hi";
import { IoEye, IoSync } from "react-icons/io5";
import { toast } from "sonner";

function Page() {
  const local = useLocal({
    edit: false,
  });
  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      const result = getAccess("edit-plafon", roles);
      local.edit = result;
      local.render();
    };
    run();
  }, []);
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Plafon</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden shadow">
        <TableList
          name="Plafon"
          header={{
            sideLeft: (data: any) => {
              return <></>;
            },
          }}
          column={[
            {
              name: "organization_name",
              header: () => <span>Organization</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "job_name",
              header: () => <span>Job</span>,
              width: 300,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "plafon",
              header: () => <span>Plafon</span>,
              width: 50,
              renderCell: ({ row, name, cell }: any) => {
                return <div className="text-left">{getValue(row, name)}</div>;
              },
            },
            {
              name: "action",
              header: () => <span>Action</span>,
              sortable: false,
              renderCell: ({ row, name, cell }: any) => {
                return (
                  <div className="flex items-center  gap-x-2 whitespace-nowrap">
                    {!local.edit && (
                      <ButtonLink
                        className="bg-primary"
                        href={`/d/master-data/plafon/${row.id}/view`}
                      >
                        <div className="flex items-center gap-x-2">
                          <IoEye className="text-lg" />
                        </div>
                      </ButtonLink>
                    )}

                    {local.edit && (
                      <ButtonLink
                        className="bg-primary"
                        href={`/d/master-data/plafon/${row.id}/edit`}
                      >
                        <div className="flex items-center gap-x-2">
                          <HiOutlinePencilAlt className="text-lg" />
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
            const res: any = await api.get(
              `${process.env.NEXT_PUBLIC_API_MPP}/api/job-plafons` + params
            );
            const data: any[] = res.data.data.job_plafons;
            return data || [];
          }}
          onInit={async (list: any) => {}}
        />
      </div>
    </div>
  );
}

export default Page;
