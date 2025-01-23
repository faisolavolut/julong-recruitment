"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { Alert } from "@/lib/components/ui/alert";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { normalDate } from "@/lib/utils/date";
import get from "lodash.get";
import { current } from "tailwindcss/colors";
import { getNumber } from "@/lib/utils/getNumber";
import { QuestionPage } from "../QuestionPage";

function Page() {
  const labelPage = "Test";
  const urlPage = `/d/test-selection/applicant-overview`;
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
            <div className="flex flex-row space-x-2 items-center"></div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/job-postings",
          method: "post",
          type: "form",
          data: {
            ...fm.data,
            document_date: normalDate(fm?.data?.document_date),
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
          },
        });
        if (res) navigate(`${urlPage}/${res?.id}/edit`);
      }}
      onLoad={async () => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/job-postings/document-number",
        });
        return {
          step: 0,
          current_step: {
            label: "Personal Information",
            value: "personal_information",
            fields: [
              { name: "first_name", type: "text", label: "First Name" },
              { name: "last_name", type: "text", label: "Last Name" },
              { name: "email", type: "email", label: "Email Address" },
            ],
          },
          status: "DRAFT",
          document_number: res,
          steps: [
            {
              label: "Personal Information",
              value: "personal_information",
              fields: [
                { name: "first_name", type: "text", label: "First Name" },
                { name: "last_name", type: "text", label: "Last Name" },
                { name: "email", type: "email", label: "Email Address" },
              ],
            },
            {
              label: "Address Details",
              value: "address_details",
              fields: [
                { name: "address", type: "text", label: "Address" },
                { name: "city", type: "text", label: "City" },
                { name: "zip_code", type: "text", label: "ZIP Code" },
              ],
            },
            {
              label: "Confirmation",
              value: "confirmation",
              submit: true, // Menandakan halaman terakhir dengan tombol submit
              fields: [
                {
                  name: "terms",
                  type: "checkbox",
                  label: "I agree to the terms and conditions",
                },
              ],
            },
          ],
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
              {fm.data?.step === "home" ? (
                <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8"></div>
              ) : (
                <></>
              )}
              <QuestionPage
                fm={fm}
                tab={"current_step.value"}
                value="personal_information"
              >
                <div>
                  <Field fm={fm} name={"name"} label={"Name"} type={"text"} />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"gender"}
                    label={"Gender"}
                    type={"dropdown"}
                    onLoad={() => {
                      return [
                        {
                          value: "MALE",
                          label: "Male",
                        },
                        {
                          value: "FEMALE",
                          label: "Female",
                        },
                      ];
                    }}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"phone"} label={"Phone"} type={"text"} />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"birth_date"}
                    label={"Birth Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"age"} label={"Age"} type={"money"} />
                </div>
              </QuestionPage>
              <QuestionPage
                fm={fm}
                tab={"current_step.value"}
                value="address_details"
              >
                <div>
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Address"}
                    type={"text"}
                  />
                </div>
              </QuestionPage>
              <QuestionPage
                fm={fm}
                tab={"current_step.value"}
                value="confirmation"
              >
                <div>
                  <Field fm={fm} name={"name"} label={"Notes"} type={"text"} />
                </div>
              </QuestionPage>
              <div>
                {fm.data?.step === 0 ? (
                  <>
                    <ButtonBetter
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fm.data.step = getNumber(fm.data?.step) + 1;
                        fm.render();
                        fm.data.current_step = get(
                          fm,
                          `data.steps[${getNumber(fm.data.step)}]`
                        );
                        fm.render();
                        console.log({
                          current: fm.data.current_step,
                          step: fm.data.step,
                        });
                      }}
                    >
                      Start
                    </ButtonBetter>
                  </>
                ) : get(fm, `data.current_step.submit`) ? (
                  <>
                    <ButtonBetter
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fm.data.step = "start";
                        fm.data.current_step = get(fm, `data.steps[0]`);
                        fm.render();
                      }}
                    >
                      Submit
                    </ButtonBetter>
                  </>
                ) : (
                  <div>
                    <ButtonBetter
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fm.data.step = getNumber(fm.data?.step) - 1;
                        fm.render();
                        fm.data.current_step = get(
                          fm,
                          `data.steps[${getNumber(fm.data.step)}]`
                        );
                        fm.render();
                        console.log({
                          current: fm.data.current_step,
                          step: fm.data.step,
                        });
                      }}
                    >
                      Prev
                    </ButtonBetter>
                    <ButtonBetter
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fm.data.step = getNumber(fm.data?.step) + 1;
                        fm.render();
                        fm.data.current_step = get(
                          fm,
                          `data.steps[${getNumber(fm.data?.step)}]`
                        );
                        fm.render();
                      }}
                    >
                      Next
                    </ButtonBetter>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

export default Page;
