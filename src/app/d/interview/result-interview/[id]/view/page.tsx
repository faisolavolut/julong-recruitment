"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

function Page() {
  const labelPage = "Result Interview";
  const urlPage = `/d/interview/result-interview`;
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    can_approve: true,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_edit) return notFound();

  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full">
            <div className="flex flex-col py-4 pt-0 pb-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="">{labelPage}</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: `List ${labelPage}`,
                    url: urlPage,
                  },
                  {
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {local.can_approve && (
                <Alert
                  type={"save"}
                  msg={"Are you sure you want to save this record?"}
                  onClick={() => {
                    fm.submit();
                  }}
                >
                  <ButtonContainer className={"bg-primary"}>
                    <IoCheckmarkOutline className="text-xl" />
                    Approved
                  </ButtonContainer>
                </Alert>
              )}
              {local.can_approve && (
                <Alert
                  type={"delete"}
                  msg={"Are you sure you want to delete this record?"}
                  onClick={async () => {
                    await apix({
                      port: "recruitment",
                      path: `/api/job-postings`,
                      method: "delete",
                    });
                  }}
                >
                  <ButtonContainer variant={"destructive"}>
                    <X className="text-xl" />
                    Rejected
                  </ButtonContainer>
                </Alert>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/job-postings",
          method: "put",
          data: {
            ...fm.data,
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/job-postings`,
          validate: "object",
        });
        return data;
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={"flex flex-col flex-wrap px-4 py-2"}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"interview_date"}
                    label={"Interview Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"interviewer_name"}
                    label={"Interviewer Name"}
                    type={"text"}
                    disabled={true}
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
