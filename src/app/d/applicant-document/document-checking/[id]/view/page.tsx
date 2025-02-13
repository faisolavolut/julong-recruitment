"use client";
import { getParams } from "@/lib/utils/get-params";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { Alert } from "@/lib/components/ui/alert";
import { ButtonContainer } from "@/lib/components/ui/button";
import { IoMdSave } from "react-icons/io";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerCustom,
} from "@/lib/components/ui/accordion";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const labelPage = "Candidate Agreement";
  const urlPage = `/d/offering-letter/offering-letter-agreement`;
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
              <Alert
                type={"save"}
                msg={"Are you sure you want to submit this record?"}
                onClick={() => {
                  fm.data.status = "IN PROGRESS";
                  fm.render();
                  fm.submit();
                }}
              >
                <ButtonContainer className={"bg-primary"}>
                  <IoMdSave className="text-xl" />
                  Submit
                </ButtonContainer>
              </Alert>
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
          port: "recruitment",
          value: "data.data",
          path: "/api/document-sending/update",
          method: "put",
          data: {
            ...fm.data,
          },
        });
      }}
      mode="view"
      onLoad={async () => {
        return {
          email: "sample@sample.com",
          applicant_name: "Sample Name",
        };
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-sending/${id}`,
          validate: "object",
        });
        return {
          ...data,
          email: data?.applicant?.user_profile?.user?.email,
          applicant_name: data?.applicant?.user_profile?.name,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      className="h-full"
      children={(fm: any) => {
        return (
          <>
            <div className={"flex flex-col flex-wrap px-4 py-2 flex-grow"}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"project_name"}
                    label={"Project Name"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job Name"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Employee Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"for_organization_name"}
                    label={"Organization"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"for_organization_structure"}
                    label={"Department"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                    disabled={true}
                  />
                </div>
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
                      List Document
                    </AccordionTriggerCustom>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <Field
                            fm={fm}
                            name={"offering_letter"}
                            label={"Offering Letter"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"contract_document"}
                            label={"Contract Document"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"surat_pengantar_masuk"}
                            label={"Surat Pengantar Masuk"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"ktp"}
                            label={"KTP"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"kartu_keluarga"}
                            label={"Kartu Keluarga"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"ijazah"}
                            label={"Ijazah"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"kartu_bpjs"}
                            label={"Kartu BPJS"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"surat_keterangan_kerja"}
                            label={"Surat Keterangan Kerja"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"surat_keterangan_kesehatan"}
                            label={"Surat Keterangan Kesehatan"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"skck"}
                            label={"SKCK"}
                            type={"upload"}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"npwp"}
                            label={"NPWP"}
                            type={"upload"}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

export default Page;
