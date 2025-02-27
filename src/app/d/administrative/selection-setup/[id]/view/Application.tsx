import { TableList } from "@/lib/components/tablelist/TableList";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { FC } from "react";
import { HiPlus } from "react-icons/hi";

export const Applicant: FC<any> = ({ fm }) => {
  const local = useLocal({
    tbl: null as any,
    open: false,
  });
  return (
    <div>
      <Dialog open={local.open}>
        <DialogTrigger
          asChild
          onClick={() => {
            local.open = true;
            local.render();
          }}
        >
          <div className="flex flex-col">
            <div className="py-3.5"></div>
            <div className="flex flex-row flex-grow">
              <ButtonContainer className="bg-primary">
                <div className="flex items-center gap-x-0.5">
                  <HiPlus className="text-xl" />
                  <span className="capitalize">Add Applicant</span>
                </div>
              </ButtonContainer>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent
          className={cx(
            " flex flex-col w-1/2",
            css`
              max-width: 100vw;
            `
          )}
          onClick={() => {
            local.open = false;
            local.render();
          }}
        >
          <DialogHeader>
            <DialogTitle>Applicant</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="flex items-center flex-col flex-grow ">
            <div className="w-full h-96 flex flex-row flex-grow bg-white overflow-hidden ">
              <TableList
                disabledHeader={true}
                feature={["checkbox"]}
                name="verification-profile"
                header={{
                  sideLeft: (data: any) => {
                    return <></>;
                  },
                }}
                onInit={(list: any) => {
                  local.tbl = list;
                  local.render();
                }}
                column={[
                  {
                    name: "id_applicant",
                    sortable: false,
                    header: "ID Applicant",
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    name: "name",
                    sortable: false,
                    header: "Applicant Name",
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                  {
                    sortable: false,
                    name: "job_name",
                    header: "Job Name",
                    renderCell: ({ row, name }: any) => {
                      return <>{getValue(row, name)}</>;
                    },
                  },
                ]}
                onLoad={async (param: any) => {
                  const params = await events("onload-param", param);
                  const result: any = await apix({
                    port: "recruitment",
                    value: "data.data.user_profiles",
                    path: `/api/user-profiles${params}`,
                    validate: "array",
                  });
                  return result;
                }}
                onCount={async (params: any) => {
                  const result: any = await apix({
                    port: "recruitment",
                    value: "data.data.total",
                    path: `/api/user-profiles?page=1&page_size=1`,
                    validate: "object",
                  });
                  return getNumber(result);
                }}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose
              asChild
              onClick={async () => {
                await actionToast({
                  task: async () => {
                    const list = local.tbl;
                    const allSelected = list?.selection?.all;
                    const partial = list?.selection?.partial;
                    if (allSelected) {
                      await apix({
                        port: "recruitment",
                        value: "data.data.total",
                        path: `/api/job-postings?page=1&page_size=1`,
                        validate: "object",
                      });
                    } else {
                      await apix({
                        port: "recruitment",
                        value: "data.data.total",
                        path: `/api/job-postings?page=1&page_size=1`,
                        validate: "object",
                      });
                    }
                    fm.reload();
                  },
                  after: () => {
                    local.open = false;
                    local.render();
                  },
                  msg_load: "Add Applicant ",
                  msg_error: "Add Applicant failed ",
                  msg_succes: "Add Applicant success ",
                });
              }}
            >
              <ButtonBetter>
                <div className="flex items-center gap-x-0.5">
                  <span className="capitalize">Ok</span>
                </div>
              </ButtonBetter>
            </DialogClose>
            <DialogClose
              asChild
              onClick={async () => {
                local.open = false;
                local.render();
              }}
            >
              <ButtonBetter variant={"outline"}>
                <div className="flex items-center gap-x-0.5">
                  <span className="capitalize">Cancel</span>
                </div>
              </ButtonBetter>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
