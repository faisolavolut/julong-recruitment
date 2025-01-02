"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { btn } from "@/lib/components/ui/button";
import api from "@/lib/utils/axios";
import { getParams } from "@/lib/utils/get-params";
import { IoMdSave } from "react-icons/io";
function Page() {
  const id = getParams("id")
  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full">
            <div className="flex flex-col py-4 pt-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 ">
                <span className="">Plafon</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: "List Plafon",
                    url: "/d/master-data/plafon",
                  },
                  {
                    title: "Edit"
                  }
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2">
              {/* <Alert type={"delete"} onClick={() => {}}>
                <div className={cx("bg-red-500", btn())}>
                  <div className="flex items-center gap-x-0.5">
                    <MdDelete className="text-xl" />
                    Delete
                  </div>
                </div>
              </Alert> */}
              <Alert
                type={"save"}
                onClick={() => {
                  fm.submit();
                }}
              >
                <div className={cx("bg-primary", btn())}>
                  <div className="flex items-center gap-x-0.5">
                    <IoMdSave className="text-xl" />
                    Save
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const data = fm?.data
        
        const param = {
          id,
          plafon: Number(data.plafon),
          job_id: data.job_id
        }
        const res: any = await api.put(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/job-plafons`, param
        );
        
      }}
      onLoad={async () => {
        
        const res: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/job-plafons/` +
            id
        );
        return res.data.data
      }}
      header={(fm: any) => {
        return <></>;
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"organization_name"}
                    label={"Organization"}
                    disabled={true}
                  />
                </div>
                <div>
                 
                <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"plafon"} label={"Plafon"} type={"money"} />
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

export default Page;
