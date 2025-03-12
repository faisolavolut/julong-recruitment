"use client";
import { getParams } from "@/lib/utils/get-params";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { IoEye } from "react-icons/io5";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const labelPage = "Letterhead";
  const urlPage = `/d/master-data/letterhead`;
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
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
                    title: "View",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row gap-x-2 items-center">
              <ButtonLink href={`${urlPage}/${id}/doc`}>
                <IoEye className="text-xl" /> View PDF
              </ButtonLink>
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {}}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/project-recruitment-headers/${id}`,
          validate: "object",
        });
        const lineData = data?.project_recruitment_lines || [];
        const ids = lineData.map((e: any) => e?.id);
        const line: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/template-activity-lines/template-activity/${data?.template_activity_id}`,
          validate: "array",
        });
        let lines = lineData || [];
        let del_ids: any[] = [];
        return {
          ...data,
          line: lines,
          del_ids,
          ready: true,
          project_pic: data?.project_pic_id
            ? {
                id: data.project_pic_id,
                name: data.project_pic_name,
              }
            : null,
        };
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
                    target={"for_organization_id"}
                    name={"for_organization"}
                    label={"Organization Name"}
                    required={true}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data.organizations",
                        path: `/api/organizations${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"name"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"path"}
                    label={"Letterhead"}
                    type={"upload"}
                    description={
                      "Upload an image with a 5:1 ratio (1000px × 200px)"
                    }
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
