"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { btn, ButtonContainer } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import api from "@/lib/utils/axios";
import { normalDate } from "@/lib/utils/date";
import { getParams } from "@/lib/utils/get-params";
import { getStatus } from "@/lib/utils/getStatusDate";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";

function Page() {
  const id = getParams("id");
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
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2">
              {["open", "not_open", "draft"].includes(fm.data?.status) ? (
                <>
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
                </>
              ) : (
                <></>
              )}

              {["open", "not_open", "draft"].includes(fm.data?.status) ? (
                <>
                  <Alert
                    type={"save"}
                    msg={
                      "Are you sure you want to submit this data? Once submitted, the data will be locked."
                    }
                    onClick={() => {
                      fm.data.status = "open";
                      fm.render();
                      fm.submit();
                    }}
                  >
                    <div className={cx("bg-primary", btn())}>
                      <div className="flex items-center gap-x-0.5">
                        <IoMdSave className="text-xl" />
                        Submit
                      </div>
                    </div>
                  </Alert>
                </>
              ) : (
                <></>
              )}
              {["draft"].includes(fm.data?.status) ? (
                <>
                  <Alert
                    type={"save"}
                    onClick={async () => {
                      await actionToast({
                        task: async () => {
                          await api.delete(
                            `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods/` +
                              id
                          );
                        },
                        after: () => {
                          navigate("/d/period");
                        },
                        msg_load: "Delete ",
                        msg_error: "Delete failed ",
                        msg_succes: "Delete success ",
                      });
                    }}
                  >
                    <ButtonContainer variant="destructive">
                      <MdDelete className="text-xl" />
                      Delete
                    </ButtonContainer>
                  </Alert>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const data = fm.data;
        const param = {
          id: data.id,
          title: data?.title,
          start_date: normalDate(data?.start_date),
          end_date: normalDate(data?.end_date),
          status: data?.status,
          budget_start_date: normalDate(data?.budget_start_date),
          budget_end_date: normalDate(data?.budget_end_date),
        };
        await api.put(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods`,
          param
        );

        const res: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods/` + id
        );
        fm.data = res.data.data;
        fm.render();
      }}
      onLoad={async () => {
        const res: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods/` + id
        );
        return res.data.data;
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
                  <Field fm={fm} name={"title"} label={"Name"} type={"text"} />
                </div>
                <div></div>
                <div>
                  <Field
                    fm={fm}
                    name={"start_date"}
                    label={"Start Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"end_date"}
                    label={"End Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"budget_start_date"}
                    label={"Budget Start date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"budget_end_date"}
                    label={"Budget End Date"}
                    type={"date"}
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
