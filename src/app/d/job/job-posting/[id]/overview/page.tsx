"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { Alert } from "@/lib/components/ui/alert";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { getParams } from "@/lib/utils/get-params";

function Page() {
  const id = getParams("id");
  const labelPage = "Job Posting";
  const urlPage = `/d/job/job-posting`;
  const local = useLocal({
    can_edit: false,
    can_delete: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.can_delete = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_edit && !local.can_delete) return notFound();

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
                    title: "Overview",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {local.can_edit && (
                <Alert
                  type={"save"}
                  msg={"Are you sure you want to save this record?"}
                  onClick={() => {
                    fm.submit();
                  }}
                >
                  <ButtonContainer className={"bg-primary"}>
                    <IoMdSave className="text-xl" />
                    Save
                  </ButtonContainer>
                </Alert>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const data = fm.data;
        if (typeof data?.organization_logo === "string") {
          delete data["organization_logo"];
        }
        if (typeof data?.poster === "string") {
          delete data["poster"];
        }
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/job-postings/update",
          method: "put",
          type: "form",
          data: {
            ...data,
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/job-postings/${id}`,
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
            <div
              className={cx(
                "flex flex-col flex-wrap",
                css`
                  .field-form {
                    border: none;
                    border-radius: none;
                  }
                  .richtext-field {
                    border: none;
                    border-radius: none;
                  }
                `
              )}
            >
              <div className="grid gap-4 mb-4 grid-cols-3">
                <div className="col-span-3">
                  <Field
                    fm={fm}
                    name={"content_description"}
                    label={""}
                    hidden_label={true}
                    type={"richtext"}
                  />
                </div>
                <div></div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

export default Page;
