"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { Alert } from "@/lib/components/ui/alert";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { getNumber } from "@/lib/utils/getNumber";
import get from "lodash.get";

function Page() {
  const labelPage = "FGD Result";
  const urlPage = `/d/fgd/result`;
  const local = useLocal({
    can_add: false,
    ready: false as boolean,
  });
  const compute = (fm: any) => {
    const data = fm?.data;
    const result =
      getNumber(get(data, "problem_solving")) +
      getNumber(get(data, "logical_thinking")) +
      getNumber(get(data, "leadership")) +
      getNumber(get(data, "team_work")) +
      getNumber(get(data, "initiative")) +
      getNumber(get(data, "flexible_idealist"));
    fm.data.fgd_value = getNumber(result);
    fm.render();
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
          path: "/api/job-postings",
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
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"fgd_date"}
                    label={"FGD Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_position"}
                    label={"Job Position"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"work_experience"}
                    label={"Work Experience"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"education"}
                    label={"Education"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"usia"}
                    label={"Usia"}
                    type={"money"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"major"}
                    label={"Major"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"no_telephone"}
                    label={"No. Telephone"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"gpa"}
                    label={"GPA"}
                    type={"money"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"name_of_assessor"}
                    label={"Name of Assessor"}
                    type={"text"}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"description_result"}
                    label={"Description Result"}
                    type={"textarea"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"verbal_communication"}
                    label={"Verbal Communication"}
                    type={"money"}
                    onChange={() => {
                      compute(fm);
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"problem_solving"}
                    label={"Problem Solving"}
                    type={"money"}
                    onChange={() => {
                      compute(fm);
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"logical_thinking"}
                    label={
                      "Logical Thinking / Case Understanding & Analysis Method"
                    }
                    type={"money"}
                    onChange={() => {
                      compute(fm);
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"leadership"}
                    label={"Leadership"}
                    type={"money"}
                    onChange={() => {
                      compute(fm);
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"team_work"}
                    label={"Team Work"}
                    type={"money"}
                    onChange={() => {
                      compute(fm);
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"initiative"}
                    label={"Initiative"}
                    type={"money"}
                    onChange={() => {
                      compute(fm);
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"flexible_idealist"}
                    label={"Flexible Idealist"}
                    type={"money"}
                    onChange={() => {
                      compute(fm);
                    }}
                  />
                </div>
                <div></div>
                <div>
                  <Field
                    fm={fm}
                    name={"user_comments"}
                    label={"User Comments"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"fgd_value"}
                    label={"FGD Value"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"method_interview"}
                    label={"Method Interview"}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/method-interviews",
                        validate: "dropdown",
                        keys: {
                          label: "name",
                        },
                      });
                      return [
                        {
                          label: "Offline",
                          value: "OFFLINE",
                        },
                        {
                          label: "Online",
                          value: "ONLINE",
                        },
                      ];
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"region_interview"}
                    label={"Region Interview"}
                    type={"textarea"}
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
