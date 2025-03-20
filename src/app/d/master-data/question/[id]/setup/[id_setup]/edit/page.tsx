"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { labelDocumentType } from "@/lib/utils/document_type";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";

function Page() {
  const id_parent = getParams("id");
  const id = getParams("id_setup");
  const labelPage = "Document Setup";
  const urlPage = `/d/master-data/question/${id_parent}/edit`;
  const local = useLocal({
    can_add: false,
    can_edit: false,
    roles: null as any,
    ready: false as boolean,
    data: null as any,
  });
  useEffect(() => {
    const run = async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: "/api/template-questions/" + id_parent,
        validate: "object",
      });
      local.data = data;
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
                    title: `List Template`,
                    url: `/d/master-data/question`,
                  },
                  {
                    title: `${local?.data?.name}`,
                    url: urlPage,
                  },
                  {
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <Alert
                type={"save"}
                msg={"Are you sure you want to save this new record?"}
                onClick={() => {
                  fm.submit();
                }}
              >
                <ButtonContainer className={"bg-primary"}>
                  <IoMdSave className="text-xl" />
                  Save
                </ButtonContainer>
              </Alert>
              <Alert
                type={"delete"}
                msg={"Are you sure you want to delete this record?"}
                onClick={async () => {
                  await actionToast({
                    task: async () => {
                      await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/document-setup/" + id,
                        method: "delete",
                      });
                    },
                    after: () => {
                      navigate(urlPage);
                    },
                    msg_load: "Delete ",
                    msg_error: "Delete failed ",
                    msg_succes: "Delete success ",
                  });
                }}
              >
                <ButtonContainer variant={"destructive"}>
                  <MdDelete className="text-xl" />
                  Delete
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
          path: "/api/document-setup/update",
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
          path: "/api/document-setup/" + id,
          validate: "object",
        });
        return {
          ...data,
        };
      }}
      showResize={false}
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
                    name={"title"}
                    label={"Title Document"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"document_type"}
                    target={"document_type_id"}
                    label={"Document Type"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: `/api/document-types${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={(item: any) =>
                      labelDocumentType(get(item, "name"))
                    }
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/recruitment-types",
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"value"}
                    onValue={"value"}
                  />
                </div>

                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"header"}
                    label={"Header"}
                    type={"richtext"}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"body"}
                    label={"Body"}
                    type={"richtext"}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"footer"}
                    label={"Footer"}
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
