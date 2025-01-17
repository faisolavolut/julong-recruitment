"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableList } from "@/lib/components/tablelist/TableList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerCustom,
} from "@/lib/components/ui/accordion";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { cloneFM } from "@/lib/utils/cloneFm";
import { labelDocumentType } from "@/lib/utils/document_type";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoMdSave } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

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
  const config = {
    document_checking: "document_checking",
    question: "template_question",
    document_setup: "document_setup",
  };
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
      mode="view"
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
            <div className="flex flex-row space-x-2 items-center"></div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-questions/update",
          method: "put",
          data: {
            id: fm.data?.id,
            name: fm.data?.name,
            duration: fm.data?.duration,
            description: fm.data?.description, // optional
            status: fm.data?.status === "ACTIVE" ? fm.data?.status : "INACTIVE",
            form_type: fm.data?.form_type,
          },
        });
        // navigate("/d/master-data/question/" + res.id + "/edit");
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-questions/" + id,
          validate: "object",
        });
        return {
          id,
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
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"document_type_id"}
                    label={"Document Type"}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/document-types",
                        validate: "dropdown",
                        keys: {
                          label: (item: any) => {
                            return labelDocumentType(get(item, "name")) || "-";
                          },
                        },
                      });
                      return res;
                    }}
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

                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"content_mail"}
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
