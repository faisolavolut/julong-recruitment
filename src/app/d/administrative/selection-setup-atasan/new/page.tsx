"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";

function Page() {
  const labelPage = "Document Checking";
  const urlPage = `/d/master-data/document-checking`;
  const local = useLocal({
    can_add: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
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
                    title: "New",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
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
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-verifications",
          method: "post",
          data: {
            ...fm.data,
          },
        });
        if (res) navigate(`${urlPage}/${res?.id}/edit`);
      }}
      onLoad={async () => {
        return {};
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
                    name={"format"}
                    label={"Format"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    target={"template_question_id"}
                    name={"template_question"}
                    label={"Template"}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.template_questions",
                        path: `/api/template-questions${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"name"}
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
