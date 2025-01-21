"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
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
import { apix } from "@/lib/utils/apix";
import { labelDocumentType } from "@/lib/utils/document_type";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";

function Page() {
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
                    title: "New",
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
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        console.log({ data: fm.data });
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/mail-templates",
          method: "post",
          data: {
            ...fm.data,
          },
        });
        navigate("/d/master-data/mail-template/" + res.id + "/edit");
      }}
      onLoad={async () => {
        return {
          content_mail: `<p>Congratulations! You’ve Advanced to the Next Stage of Our Recruitment Process</p><p>Dear {candidate_name},</p><p>Thank you for your interest in joining our team at {company_name}. We are pleased to inform you that you have successfully passed the initial stage of our recruitment process.</p><p>We appreciate the effort you have put into your application and are excited about the possibility of having you on board. The next stage of the recruitment process will be:</p><p><strong>{event}</strong></p><p><strong>Date</strong>: {date}</p><p><strong>Time</strong>: {time}</p><p><strong>Location</strong>: {location}</p><p><strong>Preparation</strong>: {preparation}</p><p>Please confirm your availability for this stage by replying to this email no later than {deadline}. If you have any questions or require further assistance, feel free to contact us at {contact_information}.</p><p>We look forward to seeing you in the next stage and wish you the best of luck!</p><p>Best regards,</p><p>{employee_name}</p><p>{job_name}</p><p>{company_name}</p><p>{contact_information}</p>`,
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
