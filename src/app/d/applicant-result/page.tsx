"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getLabel } from "@/lib/utils/getLabel";
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
      local.can_add = getAccess("create-applicant-result", roles);
      local.can_edit = getAccess("edit-applicant-result", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <div className="flex p-4 flex-col flex-grow bg-white rounded-lg border border-gray-300 shadow-md shadow-gray-300">
      <div className="flex flex-col py-4 pb-0 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Applicant Result</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white overflow-hidden ">
        <TableList
          name="applicant-result"
          header={{
            sideLeft: (data: any) => {
              if (!local.can_add) return <></>;
              return (
                <div className="flex flex-row flex-grow">
                  <ButtonLink
                    className="bg-primary"
                    href={"/d/applicant-result/new"}
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
              name: "applicant_name",
              header: "Applicant Name",
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "age",
              header: "Age",
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "marital_status",
              header: "Marital Status",
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "work_experience",
              header: "Work Experience (month)",
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "cv",
              header: "CV",
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
                    {local.can_edit ? (
                      <ButtonLink href={`/d/applicant-result/${row.id}/edit`}>
                        <div className="flex items-center gap-x-2">
                          <HiOutlinePencilAlt className="text-lg" />
                        </div>
                      </ButtonLink>
                    ) : (
                      <ButtonLink
                        className="bg-primary"
                        href={`/d/applicant-result/${row.id}/view`}
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
              value: "data.data.job_postings",
              path: `/api/job-postings${params}`,
              validate: "array",
            });
            return result;
          }}
          onCount={async (params: any) => {
            const result: any = await apix({
              port: "recruitment",
              value: "data.data.total",
              path: `/api/job-postings?page=1&page_size=1`,
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
