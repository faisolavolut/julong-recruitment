"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonBetter } from "@/lib/components/ui/button";
import api from "@/lib/utils/axios";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { IoSync } from "react-icons/io5";
import { toast } from "sonner";

function Page() {
  const local = useLocal({
    ready: true,
    sync: false,
  });
  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      const sync = getAccess("sync-job", roles);
      local.sync = sync;
      local.render()
    };
    run();
  }, []);
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Jobs</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden shadow">
        <TableList
          name="Job"
          header={{
            sideLeft: (data: any) => {
              if(!local.sync) return <></>
              return (
                <div className="flex flex-row items-center gap-x-2">
                  <ButtonBetter
                    onClick={async () => {
                      try {
                        local.ready = false;
                        local.render();
                        toast.info(
                          <>
                            <Loader2
                              className={cx(
                                "h-4 w-4 animate-spin-important",
                                css`
                                  animation: spin 1s linear infinite !important;
                                  @keyframes spin {
                                    0% {
                                      transform: rotate(0deg);
                                    }
                                    100% {
                                      transform: rotate(360deg);
                                    }
                                  }
                                `
                              )}
                            />
                            {" Synchronization..."}
                          </>
                        );

                        await api.get(
                          `${process.env.NEXT_PUBLIC_API_MPP}/api/job-plafons/sync`
                        );
                        setTimeout(() => {
                          toast.success(
                            <div
                              className={cx(
                                "cursor-pointer flex flex-col select-none items-stretch flex-1 w-full"
                              )}
                              onClick={() => {
                                toast.dismiss();
                              }}
                            >
                              <div className="flex text-green-700 items-center success-title font-semibold">
                                <Check className="h-6 w-6 mr-1 " />
                                Synchronization successful
                              </div>
                            </div>
                          );

                          local.ready = true;
                          local.render();
                          setTimeout(() => {
                            if (typeof window !== "undefined")
                              window.location.reload();
                          }, 1000);
                        }, 1000);
                      } catch (ex: any) {
                        toast.error(
                          <div className="flex flex-col w-full">
                            <div className="flex text-red-600 items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Synchronization Failed{" "}
                              {get(ex, "response.data.meta.message") ||
                                ex.message}
                              .
                            </div>
                          </div>,
                          {
                            dismissible: true,
                            className: css`
                              background: #ffecec;
                              border: 2px solid red;
                            `,
                          }
                        );
                        local.ready = true;
                        local.render();
                      }
                    }}
                  >
                    <IoSync
                      className={cx(!local.ready ? "animate-spin" : "")}
                    />{" "}
                    Synchronization
                  </ButtonBetter>
                </div>
              );
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
              name: "name",
              header: () => <span>Name</span>,
              width: 300,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "parent.name",
              header: () => <span>Parent</span>,
              width: 300,
              renderCell: ({ row, name, cell }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
          ]}
          onLoad={async (param: any) => {
            const params = await events("onload-param", param);
            const res: any = await api.get(
              `${process.env.NEXT_PUBLIC_API_PORTAL}/api/jobs` + params
            );
            const data: any[] = res.data.data.jobs;
            return data || [];
          }}
          onInit={async (list: any) => {}}
        />
      </div>
    </div>
  );
}

export default Page;
