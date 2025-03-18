"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { getParams } from "@/lib/utils/get-params";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerCustom,
} from "@/lib/components/ui/accordion";
import { cloneFM } from "@/lib/utils/cloneFm";
import { siteurl } from "@/lib/utils/siteurl";
import { apix } from "@/lib/utils/apix";
import { access } from "@/lib/utils/getAccess";
import notFound from "@/app/not-found";
import ImageBetter from "@/lib/components/ui/Image";

function Page() {
  const id = getParams("id");
  const id_posting = getParams("id_posting");
  const labelPage = "Candidate";
  const local = useLocal({
    can_approve: false,
    can_reject: false,
    view: true,
    ready: false as boolean,
    data: null as any,
  });
  useEffect(() => {
    const run = async () => {
      local.can_approve = access("approval-applicant-document-selection");
      local.view = access("view-profile-applicant");
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/job-postings/${id_posting}`,
        validate: "object",
      });
      local.data = data;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (!local.view) return notFound();

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
                    title: `List Job Posting`,
                    url: `/d/administrative/applicant-overview`,
                  },
                  {
                    title: `${local.data?.document_number}`,
                    url: `/d/administrative/applicant-overview/${id_posting}`,
                  },
                  {
                    title: "view",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {/* {local.can_approve &&
                !["APPROVED", "REJECTED"].includes(fm.data?.status) && (
                  <>
                    <Alert
                      type={"save"}
                      msg={
                        "Are you sure you approve this applicant? This decision is final and cannot be reversed."
                      }
                      onClick={() => {
                        fm.data.status = "APPROVED";
                        fm.submit();
                      }}
                    >
                      <ButtonContainer className={"bg-primary"}>
                        <IoCheckmarkOutline className="text-xl" />
                        Approved
                      </ButtonContainer>
                    </Alert>
                    <Alert
                      type={"delete"}
                      msg={
                        "Are you certain you want to reject this applicant? This decision is final and cannot be reversed."
                      }
                      onClick={async () => {
                        fm.data.status = "REJECTED";

                        fm.submit();
                      }}
                    >
                      <ButtonContainer variant={"destructive"}>
                        <X className="text-xl" />
                        Rejected
                      </ButtonContainer>
                    </Alert>
                  </>
                )} */}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {}}
      onLoad={async () => {
        // sekedar testing data, nanti dihapus jika sudah ada

        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/user-profiles/${id}`,
          validate: "object",
        });
        console.log({ data });
        return {
          ...data,
          email: data?.user?.email,
          address: data?.user?.address,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      mode="view"
      children={(fm: any) => {
        return (
          <>
            <div className={"flex flex-col flex-wrap px-4 py-2"}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div className="md:col-span-2">
                  <div className="w-48 h-48">
                    <ImageBetter
                      src={siteurl(fm?.data?.avatar)}
                      alt="Profile"
                      className="rounded-full w-full h-full object-cover  object-center border-2 border-white"
                      defaultSrc={siteurl(
                        fm?.data?.gender === "FEMALE"
                          ? "/default-avatar-women.jpeg"
                          : "/default-avatar.webp"
                      )}
                    />
                  </div>
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Full Name"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"address"}
                    label={"Address"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"phone_number"}
                    label={"No. Telp"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"ktp"} label={"KTP"} type={"upload"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"link_linkedin"}
                    label={"Link LinkedIn"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"age"} label={"Age"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"marital_status"}
                    label={"Marital Status"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"email"} label={"Email"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"gender"}
                    label={"Gender"}
                    type={"text"}
                  />
                </div>

                <div className="md:col-span-2">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={"Work Experience"}
                  >
                    <AccordionItem value="Work Experience">
                      <AccordionTriggerCustom
                        className="flex flex-row items-center"
                        onRightLabel={() => {
                          return <></>;
                        }}
                      >
                        Work Experience
                      </AccordionTriggerCustom>
                      <AccordionContent>
                        <div className="grid grid-cols-1">
                          {fm.data?.work_experiences?.length >= 1 &&
                            fm.data.work_experiences.map(
                              (e: any, idx: number) => {
                                const fm_row = cloneFM(fm, e);
                                return (
                                  <div
                                    className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8"
                                    key={`work_experience_${idx}`}
                                  >
                                    <div>
                                      <Field
                                        fm={cloneFM(fm, e)}
                                        name={"job_experience"}
                                        label={"Job Experience"}
                                        type={"text"}
                                      />
                                    </div>
                                    <div>
                                      <Field
                                        fm={cloneFM(fm, e)}
                                        name={"name"}
                                        label={"Company Name"}
                                        type={"text"}
                                      />
                                    </div>
                                    <div>
                                      <Field
                                        fm={cloneFM(fm, e)}
                                        name={"year_experience"}
                                        label={"Year Experience"}
                                        type={"text"}
                                      />
                                    </div>
                                    <div>
                                      <Field
                                        fm={cloneFM(fm, e)}
                                        name={"job_description"}
                                        label={"Job Description"}
                                        type={"text"}
                                      />
                                    </div>
                                    <div>
                                      <Field
                                        fm={cloneFM(fm, e)}
                                        name={"certificate"}
                                        label={"Certificate"}
                                        type={"upload"}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="md:col-span-2">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={"Educational Background"}
                  >
                    <AccordionItem value="Educational Background">
                      <AccordionTriggerCustom
                        className="flex flex-row items-center"
                        onRightLabel={() => {
                          return <></>;
                        }}
                      >
                        Educational Background
                      </AccordionTriggerCustom>
                      <AccordionContent>
                        <div className="grid grid-cols-1">
                          {fm.data?.educations?.length >= 1 &&
                            fm.data.educations.map((e: any, idx: number) => {
                              const fm_row = cloneFM(fm, e);
                              return (
                                <div
                                  className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8"
                                  key={`educational_background_${idx}`}
                                >
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"education_level"}
                                      label={"Education Level"}
                                      type={"text"}
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"major"}
                                      label={"Major"}
                                      type={"text"}
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"school_name"}
                                      label={"School / College"}
                                      type={"text"}
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"graduate_year"}
                                      label={"Graduation Year"}
                                      type={"text"}
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"gpa"}
                                      label={"GPA"}
                                      type={"text"}
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"certificate"}
                                      label={"Certificate"}
                                      type={"upload"}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="md:col-span-2">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={"Skill"}
                  >
                    <AccordionItem value="Skill">
                      <AccordionTriggerCustom
                        className="flex flex-row items-center"
                        onRightLabel={() => {
                          return <></>;
                        }}
                      >
                        Skill
                      </AccordionTriggerCustom>
                      <AccordionContent>
                        <div className="grid grid-cols-1">
                          {fm.data?.skills?.length >= 1 &&
                            fm.data.skills.map((e: any, idx: number) => {
                              const fm_row = cloneFM(fm, e);
                              return (
                                <div
                                  className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8"
                                  key={`skill_${idx}`}
                                >
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"name"}
                                      label={"Name"}
                                      type={"text"}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"description"}
                                      label={"Description"}
                                      type={"textarea"}
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      fm={cloneFM(fm, e)}
                                      name={"certificate"}
                                      label={"Certificate"}
                                      type={"upload"}
                                    />
                                  </div>
                                </div>
                              );
                            })}
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
