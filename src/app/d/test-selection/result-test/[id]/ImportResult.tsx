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
import { toast } from "sonner";
import { AiOutlineCloudUpload } from "react-icons/ai";

export const ImportResult: FC<any> = ({ fm }) => {
  const local = useLocal({
    tbl: null as any,
    open: false,
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };
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
            <div className="flex flex-row flex-grow">
              <ButtonContainer className="bg-primary">
                <div className="flex items-center gap-x-0.5">
                  <AiOutlineCloudUpload className="text-xl" />
                  Import Result
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
            <div className="w-full h-64 flex flex-row flex-grow bg-white overflow-hidden ">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">
                        Click to upload the test results
                      </span>
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
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
