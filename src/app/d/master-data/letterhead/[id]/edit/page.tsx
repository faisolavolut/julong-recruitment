"use client";
import { getParams } from "@/lib/utils/get-params";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { ButtonLink } from "@/lib/components/ui/button-link";

function Page() {
  const id = getParams("id");
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
            <div className="flex flex-row gap-x-2 items-center">
              <ButtonLink href={`${urlPage}/${id}/doc`}>
                <IoEye className="text-xl" /> View PDF
              </ButtonLink>
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
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        await apix({
          port: "portal",
          value: "data.data",
          path: `/api/organizations/${id}/upload-logo`,
          method: "put",
          type: "form",
          data: {
            ...fm.data,
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "portal",
          value: "data.data",
          path: `/api/organizations/${id}`,
          validate: "object",
        });
        return data;
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
                    name={"name"}
                    label={"Organization Name"}
                    required={true}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"logo"}
                    required={true}
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
