"use client";
import { getParams } from "@/lib/utils/get-params";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerCustom,
} from "@/lib/components/ui/accordion";
import { labelDocumentType } from "@/lib/utils/document_type";
import get from "lodash.get";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const labelPage = "Offering Letter Document";
  const urlPage = `/d/offering-letter/offering-letter-document`;
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
            <div className="flex flex-row space-x-2 items-center"></div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {}}
      mode="view"
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-sending/${id}`,
          validate: "object",
        });
        return {
          ...data,
          email: data?.applicant?.user_profile?.user?.email,
          project_number:
            data?.job_posting?.project_recruitment_header?.document_number,
          project_recruitment_header_id:
            data?.job_posting?.project_recruitment_header_id,
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
                    name={"applicant_name"}
                    label={"Recipient's Name"}
                    disabled={
                      fm?.data?.project_recruitment_line_id &&
                      fm?.data?.job_posting_id
                        ? false
                        : true
                    }
                    type={"dropdown"}
                    onChange={({ data }) => {
                      fm.data.email = data?.user_profile?.user?.email;
                    }}
                    onLoad={async () => {
                      if (
                        !fm?.data?.project_recruitment_line_id ||
                        !fm?.data?.job_posting_id
                      )
                        return [];
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.applicants",
                        path: `/api/applicants/job-posting/${fm?.data?.job_posting_id}?order=${fm?.data?.order}`,
                        validate: "dropdown",
                        keys: { label: "user_profile.name" },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"email"}
                    label={"Recipient's Email"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_posting_id"}
                    label={"Job Name"}
                    required={true}
                    type={"dropdown"}
                    onChange={({ data }) => {
                      fm.data.project_recruitment_header_id =
                        data?.project_recruitment_header_id;
                      fm.data.project_number =
                        data?.project_recruitment_header?.document_number;
                      fm.data.for_organization_id = data?.for_organization_id;
                      fm.render();
                    }}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.job_postings",
                        path: "/api/job-postings?status=IN PROGRESS",
                        validate: "dropdown",
                        keys: {
                          label: (item: any) => {
                            return `${item.job_name} - ${item.document_number}`;
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
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    required={true}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/recruitment-types",
                        validate: "dropdown",
                        keys: { value: "value", label: "value" },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"project_number"}
                    label={"Project Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"for_organization_id"}
                    label={"Organization Name"}
                    required={true}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data.organizations",
                        path: "/api/organizations",
                        validate: "dropdown",
                        keys: { label: "name" },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"project_recruitment_line_id"}
                    label={"Activity"}
                    disabled={
                      fm?.data?.project_recruitment_header_id ? false : true
                    }
                    required={true}
                    type={"dropdown"}
                    onChange={({ data }) => {
                      fm.data.order = data?.order;
                      fm.render();
                    }}
                    onLoad={async () => {
                      if (!fm?.data?.project_recruitment_header_id) return [];
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path:
                          "/api/project-recruitment-lines/header/" +
                          fm?.data?.project_recruitment_header_id,
                        validate: "dropdown",
                        keys: {
                          label: (row: any) =>
                            labelDocumentType(
                              get(row, "template_activity_line.name")
                            ) || "",
                        },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"document_setup_id"}
                    label={"Document Type"}
                    type={"dropdown"}
                    onChange={({ data }) => {
                      const result = data?.header + data?.body + data?.footer;
                      fm.data.detail_content = result;
                      fm.render();
                      if (
                        typeof fm?.fields?.detail_content?.reload === "function"
                      ) {
                        fm?.fields?.detail_content?.reload();
                      }
                    }}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.document_setups",
                        path: "/api/document-setup",
                        validate: "dropdown",
                        keys: { label: "title" },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div className="col-span-2">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={"item-1"}
                  >
                    <AccordionItem value="item-1">
                      <AccordionTriggerCustom className="flex flex-row items-center">
                        Document Content
                      </AccordionTriggerCustom>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                          <div className="col-span-2">
                            <Field
                              hidden_label={true}
                              fm={fm}
                              name={"detail_content"}
                              label={"Question"}
                              type={"richtext"}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
