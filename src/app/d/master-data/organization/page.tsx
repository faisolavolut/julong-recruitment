"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import api from "@/lib/utils/axios";
import { events } from "@/lib/utils/event";
import { generateQueryString } from "@/lib/utils/generateQueryString";
import { joinString } from "@/lib/utils/joinString";
import { Breadcrumb } from "flowbite-react";

function Page() {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Organizations</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden shadow">
        <div className="flex flex-grow flex-col">
          <TableList
            name="Organization"
            header={{
              sideLeft: (data: any) => {
                return <></>;
              },
            }}
            column={[
              {
                name: "name",
                header: () => <span>Organization</span>,
                renderCell: ({ row, name, cell }: any) => {
                  return <>{row.name}</>;
                },
              },
              {
                name: "organization_location",
                header: () => <span>Organization Location</span>,
                width: 300,
                renderCell: ({ row, name, cell }: any) => {
                  const data = row.organization_locations;
                  return <>{joinString(data, "name")}</>;
                },
              },
            ]}
            onLoad={async (param: any) => {
              const params = await events("onload-param", param);
              const res: any = await api.get(
                `${process.env.NEXT_PUBLIC_API_PORTAL}/api/organizations` + params
              );
              const data: any[] = res.data.data.organizations;
              return data || [];
            }}
            onInit={async (list: any) => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
