"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { getParams } from "@/lib/utils/get-params";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const id = getParams("id");
  const labelPage = "Mail Template";
  const urlPage = "/d/master-data/mail-template";
  const local = useLocal({
    can_add: false,
    can_edit: false,
    roles: null as any,
    ready: false as boolean,
  });
  useEffect(() => {
    const run = async () => {
      // local.ready = false;
      // local.render();
      local.can_add = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);
  if (local.ready && !local.can_add) return notFound();
  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full flex-wrap">
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
                    title: "View",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center"></div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {}}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/mail-templates/" + id,
          validate: "object",
        });
        return {
          id,
          name_type: data?.document_type?.name,
          ...data,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      mode={"view"}
      children={(fm: any) => {
        return (
          <>
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"name_type"}
                    label={"Document Type"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"subject"}
                    label={"Subject"}
                    type={"text"}
                  />
                </div>

                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"body"}
                    label={"Mail Text"}
                    type={"richtext"}
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
