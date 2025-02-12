"use client";
import { TableList } from "@/lib/components/tablelist/TableList";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { Alert } from "@/lib/components/ui/alert";
import { ButtonContainer } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { dayDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { X } from "lucide-react";
import { useEffect } from "react";
import { IoCheckmarkOutline, IoEye } from "react-icons/io5";

function Page() {
  const local = useLocal({
    can_approve: false,
  });

  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_approve = getAccess("approval-verification-profile", roles);
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Verification Profile"
      // feature={["checkbox"]}
      name="verification-profile"
      header={{
        sideLeft: (data: any) => {
          return (
            <div className="flex flex-row flex-grow gap-x-2">
              {data?.selection?.all || data?.selection?.partial?.length ? (
                <>
                  <Alert
                    type={"save"}
                    msg={`Are you sure you want to approve ${
                      data?.selection?.all
                        ? "All"
                        : `${data?.selection?.partial?.length}`
                    } profile?`}
                    onClick={() => {}}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoCheckmarkOutline className="text-xl" />
                      Approve
                    </ButtonContainer>
                  </Alert>
                  <Alert
                    type={"delete"}
                    msg={`Are you sure you want to reject ${
                      data?.selection?.all
                        ? "All"
                        : `${data?.selection?.partial?.length}`
                    } profile?`}
                    onClick={async () => {}}
                  >
                    <ButtonContainer variant={"destructive"}>
                      <X className="text-xl" />
                      Reject
                    </ButtonContainer>
                  </Alert>
                </>
              ) : (
                <></>
              )}
            </div>
          );
        },
      }}
      column={[
        {
          name: "name",
          header: () => <span>Applicant Name</span>,
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "created_at",
          header: () => <span>Register Date</span>,
          renderCell: ({ row, name }: any) => {
            return <>{dayDate(getValue(row, name))}</>;
          },
        },
        {
          name: "action",
          header: () => <span>Action</span>,
          sortable: false,
          renderCell: ({ row }: any) => {
            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                <ButtonLink
                  className="bg-primary"
                  href={`/d/verification-profile/${row.id}/view`}
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
        const prm = {
          ...param,
          status: "INACTIVE",
        };
        const params = await events("onload-param", prm);
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.user_profiles",
          path: `/api/user-profiles${params}`,
          validate: "array",
        });
        console.log({ result });
        return result;
      }}
      onCount={async () => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/user-profiles?page=1&page_size=1&status=INACTIVE`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
  return (
    <div className="flex p-4 flex-col flex-grow bg-white rounded-lg border border-gray-300 shadow-md shadow-gray-300">
      <div className="flex flex-col py-4 pb-0 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Verification Profile</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white overflow-hidden ">
        <TableList
          // feature={["checkbox"]}
          name="verification-profile"
          header={{
            sideLeft: (data: any) => {
              return (
                <div className="flex flex-row flex-grow gap-x-2">
                  {data?.selection?.all || data?.selection?.partial?.length ? (
                    <>
                      <Alert
                        type={"save"}
                        msg={`Are you sure you want to approve ${
                          data?.selection?.all
                            ? "All"
                            : `${data?.selection?.partial?.length}`
                        } profile?`}
                        onClick={() => {}}
                      >
                        <ButtonContainer className={"bg-primary"}>
                          <IoCheckmarkOutline className="text-xl" />
                          Approve
                        </ButtonContainer>
                      </Alert>
                      <Alert
                        type={"delete"}
                        msg={`Are you sure you want to reject ${
                          data?.selection?.all
                            ? "All"
                            : `${data?.selection?.partial?.length}`
                        } profile?`}
                        onClick={async () => {}}
                      >
                        <ButtonContainer variant={"destructive"}>
                          <X className="text-xl" />
                          Reject
                        </ButtonContainer>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              );
            },
          }}
          column={[
            {
              name: "name",
              header: () => <span>Applicant Name</span>,
              renderCell: ({ row, name }: any) => {
                return <>{getValue(row, name)}</>;
              },
            },
            {
              name: "created_at",
              header: () => <span>Register Date</span>,
              renderCell: ({ row, name }: any) => {
                return <>{dayDate(getValue(row, name))}</>;
              },
            },
            {
              name: "action",
              header: () => <span>Action</span>,
              sortable: false,
              renderCell: ({ row }: any) => {
                return (
                  <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                    <ButtonLink
                      className="bg-primary"
                      href={`/d/verification-profile/${row.id}/view`}
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
            const prm = {
              status: "INACTIVE",
              ...param,
            };
            const params = await events("onload-param", prm);
            const result: any = await apix({
              port: "recruitment",
              value: "data.data.user_profiles",
              path: `/api/user-profiles${params}`,
              validate: "array",
            });
            return result;
          }}
          onCount={async () => {
            const result: any = await apix({
              port: "recruitment",
              value: "data.data.total",
              path: `/api/user-profiles?page=1&page_size=1`,
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
