"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { getParams } from "@/lib/utils/get-params";
import { Alert } from "@/lib/components/ui/alert";
import { ButtonContainer } from "@/lib/components/ui/button";
import { MdDelete } from "react-icons/md";

function Page() {
  const id = getParams("id");
  const labelPage = "Type Test";
  const urlPage = `/d/master-data/type-test`;
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
                    title: "Edit",
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
              {local.can_delete && (
                <Alert
                  type={"delete"}
                  msg={"Are you sure you want to delete this record?"}
                  onClick={async () => {
                    await apix({
                      port: "recruitment",
                      path: `/api/type-test/${id}`,
                      method: "delete",
                    });
                  }}
                >
                  <ButtonContainer variant={"destructive"}>
                    <MdDelete className="text-xl" />
                    Delete
                  </ButtonContainer>
                </Alert>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {}}
      mode={"view"}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/type-test/${id}`,
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
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    type={"single-checkbox"}
                    onLoad={() => {
                      return [
                        {
                          label: "Active",
                          value: "ACTIVE",
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
