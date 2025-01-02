"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { btn } from "@/lib/components/ui/button";
import api from "@/lib/utils/axios";
import { getParams } from "@/lib/utils/get-params";
import { getStatus } from "@/lib/utils/getStatusDate";
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
                  <span className="">Period</span>
                </h2>
                <BreadcrumbBetterLink
                  data={[
                    {
                      title: "List Period",
                      url: "/d/period",
                    },
                    {
                      title: "Detail",
                    },
                  ]}
                />
              </div>
              <div className="flex flex-row space-x-2"></div>
            </div>
          );
        }}
      onSubmit={async (fm: any) => {
        const data = fm.data;
      }}
      onLoad={async () => {
        
        const res: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods/` +
            id
        );
        return res.data.data
        return {
          id,
          status: "open"
        };
      }}
      header={(fm: any) => {
        return (
          <>
          </>
        );
      }}
      children={(fm: any) => {
        return (
          <>
          <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
            <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
              <div>
                <Field
                  fm={fm}
                  name={"title"}
                  label={"Name"}
                  type={"text"}
                  disabled={true}
                />
              </div>
              <div></div>
              <div>
                <Field
                  fm={fm}
                  name={"start_date"}
                  label={"Start Date"}
                  type={"date"}
                  disabled={true}
                />
              </div>
              <div>
                <Field
                  fm={fm}
                  name={"end_date"}
                  label={"End Date"}
                  type={"date"}
                  disabled={true}
                />
              </div>
              <div>
                <Field
                  fm={fm}
                  name={"budget_start_date"}
                  label={"Budget Start date"}
                  type={"date"}
                  disabled={true}
                />
              </div>
              <div>
                <Field
                  fm={fm}
                  name={"budget_end_date"}
                  label={"Budget End Date"}
                  type={"date"}
                  disabled={true}
                />
              </div>
              <div>
                <Field
                  fm={fm}
                  name={"status"}
                  label={"Status"}
                  type={"dropdown"}
                  disabled={true}
                  onLoad={async () => {
                    return [
                      {
                        value: "open",
                        label: "Open",
                      },
                      {
                        value: "not_open",
                        label: "Not Open",
                      },
                      {
                        value: "draft",
                        label: "Draft",
                      },
                      {
                        value: "close",
                        label: "Close",
                      },
                    ];
                  }}
                />
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
