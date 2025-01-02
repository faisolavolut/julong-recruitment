"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonBetter } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { getStatusLabel } from "@/constants/status-mpp";
import api from "@/lib/utils/axios";
import { shortDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";
import { getValue } from "@/lib/utils/getValue";
import { IoEye } from "react-icons/io5";

function Page() {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Manpower Request</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden shadow">
        <TableList
          name="Manpower Request Overview"
          header={{
            sideLeft: (data: any) => {
              return <></>;
            },
          }}
          column={[
            {
              name: "document_number",
              header: () => <span>Document Number</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "document_date",
              header: () => <span>Document Date</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{shortDate(new Date())}</>;
              },
            },
            {
              name: "organization_name",
              header: () => <span>Organization</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "requestor_name",
              header: () => <span>Requestor</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "job_name",
              header: () => <span>Job Requested</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "status",
              header: () => <span>Status</span>,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getStatusLabel(getValue(row, name))}</>;
              },
            },
            {
              name: "action",
              header: () => <span>Action</span>,
              sortable: false,
              renderCell: ({ row, name, cell }: any) => {
                return (
                  <div className="flex items-center flex-row gap-x-2 whitespace-nowrap">
                    <ButtonLink
                      className="bg-primary"
                      href={`/d/mpr-ceo/${row.id}/view`}
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
            const pr = {
              ...param,
              vp_gm_director: "NOT NULL",
              ceo: "NULL",
              status: "NEED APPROVAL",
            };
            delete pr["sort"];
            const params = await events("onload-param", pr);
            const res: any = await api.get(
              `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests` + params
            );
            const data: any[] = res.data.data.mp_request_header;
            if (!Array.isArray(data)) return [];
            return data || [];
          }}
          onInit={async (list: any) => {}}
        />
      </div>
    </div>
  );
}

export default Page;
