"use client";
import { getParams } from "@/lib/utils/get-params";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { statusMpp } from "@/constants/status-mpp";
import { getNumber } from "@/lib/utils/getNumber";
import get from "lodash.get";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const labelPage = "MPR";
  const urlPage = `/d/mpr`;
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
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "mpp",
          value: "data.data",
          path: `/api/mp-requests/${id}`,
          validate: "object",
        });

        let categories = [] as any[];
        const category: any[] = await apix({
          port: "mpp",
          value: "data.data",
          path: `/api/request-categories`,
          validate: "array",
        });
        if (!Array.isArray(category)) {
          categories = [];
        } else {
          categories = category.map((e) => {
            return {
              value: e.id,
              label: e.name,
              data: e,
            };
          });
        }
        const lines = data?.mp_planning_header?.mp_planning_lines || [];
        const jobs = lines.find((e: any) => e?.job_id === data?.job_id);
        return {
          id,
          ...data,
          categories: categories,
          divisi: data.for_organization_structure,
          job_level: data.job_level_name,
          location: data.for_organization_location_id,
          is_replacement: data.is_replacement ? "penggantian" : "penambahan",
          total_needs: data.male_needs + data.female_needs,
          remaining_balance:
            data.recruitment_type === "MT_Management Trainee"
              ? getNumber(jobs?.remaining_balance_mt)
              : data.recruitment_type === "PH_Professional Hire"
              ? getNumber(jobs?.remaining_balance_ph)
              : 0,
          mpp_name: data.mpp_period.title,
          major_ids: data?.request_majors?.length
            ? data.request_majors.map((e: any) => e?.["Major"]?.["ID"])
            : [],
          mp_planning_header_doc_no: data?.mp_planning_header?.document_number,
        };
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="text-md font-semibold text-gray-900 py-4">
                Requirement Data
              </div>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 ">
                <div>
                  <Field
                    fm={fm}
                    name={"document_number"}
                    label={"Document Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"document_date"}
                    label={"Document Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"mp_planning_header_doc_no"}
                    label={"MPP Reference Number"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"mpp_name"}
                    label={"Periode Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    type={"dropdown"}
                    onChange={() => {
                      const lines = fm.data?.lines || [];
                      const jobs =
                        lines.find((x: any) => x?.job_id === fm.data?.job_id) ||
                        null;
                      const remaining_balance =
                        fm.data.recruitment_type === "MT_Management Trainee"
                          ? getNumber(jobs?.remaining_balance_mt)
                          : fm.data.recruitment_type === "PH_Professional Hire"
                          ? getNumber(jobs?.remaining_balance_ph)
                          : 0;
                      fm.data.remaining_balance = remaining_balance;
                      fm.render();
                    }}
                    onLoad={async () => {
                      return [
                        {
                          value: "MT_Management Trainee",
                          label: "Management Trainee",
                        },
                        {
                          value: "PH_Professional Hire",
                          label: "Professional Hire",
                        },
                        {
                          value: "NS_Non Staff to Staff",
                          label: "Non Staff to Staff",
                        },
                      ];
                    }}
                  />
                </div>
                <div></div>

                <div>
                  <Field
                    fm={fm}
                    name={"for_organization_name"}
                    label={"For Organization"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"emp_organization_name"}
                    label={"Employment Org"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job Position"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"divisi"}
                    label={"Div. / Sect."}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"for_organization_location"}
                    label={"Location"}
                    type={"text"}
                    disabled={true}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"job_level"}
                    label={"Job Level"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"male_needs"}
                    label={"Male Needs"}
                    type={"money"}
                    onChange={() => {
                      fm.data.total_needs =
                        getNumber(fm?.data?.male_needs) +
                        getNumber(fm?.data?.female_needs);
                      fm.render();
                    }}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"female_needs"}
                    label={"Female Needs"}
                    type={"money"}
                    onChange={() => {
                      fm.data.total_needs =
                        getNumber(fm?.data?.male_needs) +
                        getNumber(fm?.data?.female_needs);
                      fm.render();
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    disabled={true}
                    name={"any_gender"}
                    label={"Any Needs"}
                    type={"money"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    disabled={true}
                    name={"total_needs"}
                    label={"Total Needs"}
                    type={"money"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"is_replacement"}
                    label={"Request Category"}
                    type={"dropdown"}
                    onLoad={() => {
                      return [
                        {
                          value: "penambahan",
                          label: "Penambahan",
                        },
                        {
                          value: "penggantian",
                          label: "Penggantian",
                        },
                      ];
                    }}
                    onChange={(item: any) => {
                      if (
                        typeof fm?.fields?.request_category_id?.reload ===
                        "function"
                      )
                        fm.fields.request_category_id.reload();
                    }}
                  />
                </div>
                <div></div>
                {["penggantian", "penambahan"].includes(
                  fm.data?.is_replacement
                ) ? (
                  <div className="md:col-span-2">
                    <Field
                      hidden_label={true}
                      fm={fm}
                      name={"request_category_id"}
                      label={""}
                      type={"single-checkbox"}
                      className={"grid grid-cols-3"}
                      onLoad={() => {
                        const is_replacement =
                          fm.data?.is_replacement === "penggantian"
                            ? true
                            : false;
                        if (!fm.data?.is_replacement) return [];
                        return fm.data?.categories?.length
                          ? fm.data?.categories.filter(
                              (e: any) =>
                                e.data?.is_replacement === is_replacement
                            )
                          : [];
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}

                <div className="flex flex-col gap-y-1">
                  <div className="block mb-2 text-md font-medium text-gray-900 text-sm inline">
                    Age (Min/Max)
                  </div>
                  <div className="flex flex-row flex-grow gap-x-1">
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"minimum_age"}
                        type={"money"}
                        hidden_label={true}
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex flex-row items-center justify-center px-1">
                      -
                    </div>
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"maximum_age"}
                        type={"money"}
                        hidden_label={true}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"marital_status"}
                    label={"Marital Status"}
                    type={"dropdown"}
                    onLoad={() => {
                      return [
                        {
                          value: "single",
                          label: "Single",
                        },
                        {
                          value: "married",
                          label: "Married",
                        },
                        {
                          value: "any",
                          label: "No Rules",
                        },
                      ];
                    }}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"expected_date"}
                    label={"Expected Start Date"}
                    type={"date"}
                  />
                </div>
              </div>

              <div className="text-md font-semibold text-gray-900 py-4">
                Job Specification
              </div>

              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 ">
                <div>
                  <Field
                    fm={fm}
                    name={"minimum_education"}
                    label={"Minimum Education"}
                    type={"dropdown"}
                    onLoad={() => {
                      return [
                        {
                          label: "1 - Doctoral / Professor",
                          value: "S3",
                        },
                        {
                          label: "2 - Master Degree",
                          value: "S2",
                        },
                        { label: "3 - Bachelor", value: "S1" },
                        { label: "4 - Diploma 1", value: "D1" },
                        { label: "5 - Diploma 2", value: "D2" },
                        { label: "6 - Diploma 3", value: "D3" },
                        { label: "7 - Diploma 4", value: "D4" },
                        {
                          label: "8 - Elementary School",
                          value: "SD",
                        },
                        {
                          label: "9 - Senior High School",
                          value: "SMA",
                        },
                        {
                          label: "10 - Junior High School",
                          value: "SMP",
                        },
                        { label: "11 - Unschooled", value: "TS" },
                      ];
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"major_ids"}
                    label={"Major"}
                    type={"multi-dropdown"}
                    // disabled={!fm.data?.minimum_education}
                    onLoad={async () => {
                      const data = fm.data.request_majors;
                      if (!Array.isArray(data)) return [];
                      return data.map((e) => {
                        return {
                          value: get(e, "Major.ID"),
                          label: get(e, "Major.Major"),
                          data: e,
                        };
                      });
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"experiences"}
                    label={"Work Experience"}
                    type={"textarea"}
                  />
                </div>
                <div></div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"required_qualification"}
                    label={"Required Qualification"}
                    type={"textarea"}
                  />
                </div>
              </div>
              <div className="text-md font-semibold text-gray-900 py-4">
                Specific Skills
              </div>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8 ">
                <div>
                  <Field
                    fm={fm}
                    name={"certificate"}
                    label={"Certificate"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"computer_skill"}
                    label={"Computer"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"language_skill"}
                    label={"Languages"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"other_skill"}
                    label={"Others"}
                    type={"text"}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"jobdesc"}
                    label={"Job Desc"}
                    type={"textarea"}
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="block mb-2 text-md font-medium text-gray-900 text-sm inline">
                    Salary Range
                  </div>
                  <div className="flex flex-row flex-grow gap-x-1">
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"salary_min"}
                        type={"text"}
                        hidden_label={true}
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex flex-row items-center justify-center px-1">
                      -
                    </div>
                    <div className="flex-grow">
                      <Field
                        fm={fm}
                        name={"salary_max"}
                        type={"text"}
                        hidden_label={true}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
                <div></div>
                <div>
                  <Field
                    fm={fm}
                    name={"requestor_name"}
                    label={"Requestor"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"department_head_name"}
                    label={"Manager/Dept.Head"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"vp_gm_director_name"}
                    label={"VP/GM/Direktur"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"ceo_name"}
                    label={"CEO"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"hrd_ho_unit_name"}
                    label={"HRD/HO"}
                    disabled={true}
                  />
                </div>
                <div></div>

                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    disabled={true}
                    type={"dropdown"}
                    onLoad={() => {
                      return statusMpp;
                    }}
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
