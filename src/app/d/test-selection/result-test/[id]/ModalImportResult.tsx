import { ButtonBetter } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { actionToast } from "@/lib/utils/action";
import { useLocal } from "@/lib/utils/use-local";
import { FC, useEffect } from "react";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

export const ModalImportResult: FC<{
  fm: any;
  onUpload: (file: any) => Promise<void>;
  msg: string;
  open: boolean;
  onChangeOpen: (event: boolean) => void;
}> = ({ fm, onUpload, msg, open, onChangeOpen }) => {
  const local = useLocal({
    tbl: null as any,
    open: false,
    fase: "start" as "start" | "preview" | "upload",
    preview: "",
    filename: "",
    extension: "",
    file: null as any,
    count: 0 as number,
  });

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const validMimeType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (fileExtension !== "xlsx" || file.type !== validMimeType) {
      alert("Hanya file .xlsx yang diperbolehkan!");
      event.target.value = "";
      return;
    }
    local.fase = "preview";
    local.preview = `${URL.createObjectURL(file)}.${file.name
      .split(".")
      .pop()}`;
    const extension = file.name.split(".").pop();
    local.filename = file.name;
    local.extension = extension;
    local.file = file;
    local.render();
  };
  useEffect(() => {
    local.fase = "start";
    local.render();
  }, []);
  return (
    <Dialog open={open}>
      <DialogContent
        className={cx(
          " flex flex-col w-1/2",
          css`
            max-width: 100vw;
          `
        )}
        onClick={() => {
          onChangeOpen(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Applicant</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex items-center flex-col flex-grow ">
          <div
            className={cx(
              "w-full flex flex-row flex-grow bg-white overflow-hidden ",
              local.fase === "preview" ? "" : "h-64"
            )}
          >
            {local.fase === "preview" ? (
              <div className="flex flex-col justify-start gap-y-1 p-1 pb-4">
                <div className="flex flex-row items-center gap-x-1">
                  <PiMicrosoftExcelLogoFill className="text-2xl text-green-500" />
                  <p className="  text-sm font-bold">{local.filename}</p>
                </div>
                <p className="">
                  Are you sure you want to proceed with the import? This action
                  is final and cannot be undone. Click OK to continue
                </p>
              </div>
            ) : (
              <>
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
                      accept=".xlsx"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose
            asChild
            onClick={async () => {
              await actionToast({
                task: async () => {
                  if (typeof onUpload === "function") {
                    await onUpload(local.file);
                  }
                  fm.reload();
                },
                after: () => {
                  local.fase = "start";
                  onChangeOpen(false);
                  local.render();
                },
                msg_load: msg + " ",
                msg_error: msg + " failed ",
                msg_succes: msg + " success ",
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
              local.fase = "start";
              onChangeOpen(false);
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
  );
};
function generateRandomColor(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString(); // Return a string representation of the hash
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}
