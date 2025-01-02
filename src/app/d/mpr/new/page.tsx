"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import api from "@/lib/utils/axios";
import { normalDate, shortDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { get_user } from "@/lib/utils/get_user";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";

function Page() {
  const local = useLocal({
    can_add: false,
    ready: false as boolean,
  });
  useEffect(() => {
    const run = async () => {
      local.ready = false;
      local.render();
      const roles = await userRoleMe();
      try {
        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods/current?status=complete`
        );
        if (res?.data?.data) {
          local.can_add = getAccess("create-mpr", roles);
        }
      } catch (ex) {}
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
            <div className="flex flex-col py-4 pt-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 ">
                <span className="">Manpower Request</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: "List Manpower Request",
                    url: "/d/mpr",
                  },
                  {
                    title: "Detail",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2">
              <Alert
                type={"delete"}
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
        const data = fm.data;
        fm.error = {};
        fm.render();
        // total_needs
        const prm: any = {
          document_number: data.document_number,
          document_date: normalDate(data.document_date),
          mpp_period_id: data.mpp_period_id,
          recruitment_type: data.recruitment_type,
          for_organization_id: data.for_organization_id,
          organization_id: data.for_organization_id,
          emp_organization_id: data.emp_organization_id,
          job_id: data.job_id,
          request_category_id: data.request_category_id,
          expected_date: normalDate(data.expected_date),
          male_needs: data.male_needs,
          female_needs: data.female_needs,
          minimum_age: data.minimum_age,
          job_level_id: data.job_level_id,
          maximum_age: data.maximum_age,
          marital_status: data.marital_status,
          minimum_education: data.minimum_education,
          required_qualification: data.required_qualification,
          experiences: data.experiences,
          major_ids: data.major_ids,
          notes: null, // Tidak ada field notes di data asli
          status: data.status,
          recommended_by: null, // Tidak ada field recommended_by di data asli
          approved_by: null, // Tidak ada field approved_by di data asli
          requestor_id: data.requestor_id,
          organization_location_id: data.location,
          for_organization_location_id: data.location,
          for_organization_structure_id: data.organization_structure_id,
          organization_structure_id: data.organization_structure_id,
          certificate: data.certificate, // Optional
          computer_skill: data.computer_skill, // Optional
          language_skill: data.language_skill, // Optional
          other_skill: data.other_skill, // Optional
          jobdesc: data.jobdesc,
          salary_min: data.salary_min,
          salary_max: data.salary_max,
          is_replacement: data.is_replacement === "penggantian" ? true : false,
          mp_request_type: data.mp_planning_header_id
            ? "ON_BUDGET"
            : "OFF_BUDGET",
          mp_planning_header_id: data.mp_planning_header_id,
        };
        if (prm.mp_request_type === "ON_BUDGET") {
          const category = [
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
          if (
            prm.recruitment_type === "MT_Management Trainee" ||
            prm.recruitment_type === "PH_Professional Hire"
          ) {
            const total =
              getNumber(prm.female_needs) + getNumber(prm.male_needs);
            const remaining_balance = getNumber(data?.remaining_balance);
            if (total > remaining_balance) {
              fm.error = {
                ...fm.error,
                total_needs:
                  "Total needs must not exceed the remaining balance",
              };
              fm.render();
              throw new Error(
                "Failed the total needs exceed the remaining balance."
              );
            }
          }
        }

        const res: any = await api.post(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests`,
          prm
        );

        navigate("/d/mpr/" + res.data?.data?.id + "/edit");
      }}
      onLoad={async () => {
        const document_number = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests/document-number`
        );
        const id_org = get_user("employee.organization_id");
        const location = await api.get(
          `${process.env.NEXT_PUBLIC_API_PORTAL}/api/organization-locations/` +
            get_user("employee.employee_job.organization_location_id")
        );
        const org = await api.get(
          `${process.env.NEXT_PUBLIC_API_PORTAL}/api/organizations/` + id_org
        );
        const current_open = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/mpp-periods/status?status=complete`
        );
        const ctg: any = await api.get(
          `${process.env.NEXT_PUBLIC_API_MPP}/api/request-categories`
        );
        let categories = [] as any[];
        const data: any[] = ctg.data?.data;
        if (!Array.isArray(data)) categories = [];
        categories = data.map((e) => {
          return {
            value: e.id,
            label: e.name,
            data: e,
          };
        });

        return {
          document_number: document_number.data.data,
          document_date: new Date(),
          organization: org?.data?.data?.name,
          budget_year_from:
            current_open?.data?.data?.mppperiod?.budget_start_date,
          budget_year_to: current_open?.data?.data?.mppperiod?.budget_end_date,
          mpp_name: current_open?.data?.data?.mppperiod?.title,
          requestor: get_user("employee.name"),
          job: get_user("employee.employee_job.name"),
          for_organization_id: get_user("employee.organization_id"),
          total_recruit: 0,
          total_promote: 0,
          mpp_period_id: current_open?.data?.data?.mppperiod?.id,
          organization_id: id_org,
          requestor_id: get_user("employee.id"),
          status: "DRAFT",
          organization_location_id: get_user(
            "employee.employee_job.organization_location_id"
          ),
          categories: categories,
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
                    name={"mp_planning_header_id"}
                    label={"MPP Reference Number"}
                    type={"dropdown"}
                    onChange={(e: any) => {
                      const line = e?.data.mp_planning_lines;
                      fm.data["lines"] = line;

                      const jobs =
                        line.find((x: any) => x?.job_id === fm.data?.job_id) ||
                        null;
                      const remaining_balance =
                        fm.data.recruitment_type === "MT_Management Trainee"
                          ? getNumber(jobs?.remaining_balance_mt)
                          : fm.data.recruitment_type === "PH_Professional Hire"
                          ? getNumber(jobs?.remaining_balance_ph)
                          : 0;
                      fm.data.remaining_balance = remaining_balance;
                      fm.render();
                      if (typeof fm?.fields?.job_id?.reload === "function") {
                        fm.fields.job_id.reload();
                      }
                    }}
                    onLoad={async () => {
                      try {
                        if (!fm.data?.mpp_period_id) {
                          return [];
                        }
                        const param = {
                          paging: 1,
                          take: 500,
                        };
                        const params = await events("onload-param", param);
                        const res: any = await api.get(
                          `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/get-something?organization_id=${fm.data.for_organization_id}&status=COMPLETED&mpp_period_id=${fm.data?.mpp_period_id}`
                        );

                        const data: any[] = res.data.data;
                        if (!Array.isArray(data)) return [];
                        return data.map((e) => {
                          return {
                            value: e.id,
                            label: e.document_number,
                            data: e,
                          };
                        });
                      } catch (ex) {
                        return [];
                      }
                    }}
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
                    name={"for_organization_id"}
                    label={"For Organization"}
                    type={"dropdown"}
                    disabled={true}
                    onChange={(e: any) => {
                      const locations = e.data?.organization_locations;
                      fm.data["list_location"] = locations;
                      fm.render();
                    }}
                    onLoad={async () => {
                      const param = {
                        paging: 1,
                        take: 500,
                      };
                      const params = await events("onload-param", param);
                      const res: any = await api.get(
                        `${process.env.NEXT_PUBLIC_API_PORTAL}/api/organizations` +
                          params
                      );
                      const data: any[] = res.data.data.organizations;
                      if (!Array.isArray(data)) return [];
                      return data.map((e) => {
                        return {
                          value: e.id,
                          label: e.name,
                          data: e,
                        };
                      });
                    }}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"emp_organization_id"}
                    label={"Employment Org"}
                    type={"dropdown"}
                    disabled={!fm.data?.for_organization_id}
                    onLoad={async () => {
                      const param = {
                        paging: 1,
                        take: 500,
                      };
                      const params = await events("onload-param", param);
                      const res: any = await api.get(
                        `${process.env.NEXT_PUBLIC_API_PORTAL}/api/organizations` +
                          params
                      );
                      const data: any[] = res.data.data.organizations;
                      if (!Array.isArray(data)) return [];
                      return data.map((e) => {
                        return {
                          value: e.id,
                          label: e.name,
                          data: e,
                        };
                      });
                    }}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"job_id"}
                    label={"Job Position"}
                    type={"dropdown"}
                    disabled={!fm.data?.for_organization_id}
                    onChange={(e: any) => {
                      console.log({ data: e.data });
                      const organization_structure_name =
                        e.data?.organization_structure_name;
                      fm.data["divisi"] = organization_structure_name;
                      fm.data["for_organization_id_structure_id"] =
                        e.data?.organization_structure_id;
                      fm.data["organization_structure_id"] =
                        e.data?.organization_structure_id;
                      fm.data["for_organization_id_structure_id"] =
                        e.data?.organization_structure_id;
                      fm.data["job_level"] = get(e, "data.job_level.name");
                      fm.data["job_level_id"] = e.data?.job_level?.id;
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
                      if (!fm.data?.for_organization_id) return [];
                      const param = {
                        paging: 1,
                        take: 500,
                      };
                      const params = await events("onload-param", param);
                      try {
                        const res: any = fm.data?.mp_planning_header_id
                          ? await api.get(
                              `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/jobs/${fm.data?.mp_planning_header_id}` +
                                params
                            )
                          : await api.get(
                              `${process.env.NEXT_PUBLIC_API_PORTAL}/api/jobs/organization/${fm.data?.for_organization_id}` +
                                params
                            );
                        const data: any[] = res.data.data;
                        if (!Array.isArray(data)) return [];
                        return data.map((e) => {
                          return {
                            value: e.id,
                            label: e.name,
                            data: e,
                          };
                        });
                      } catch (ex) {
                        return [];
                      }
                    }}
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
                    name={"location"}
                    label={"Location"}
                    type={"dropdown"}
                    disabled={!fm.data?.for_organization_id}
                    onLoad={async () => {
                      if (!fm.data?.for_organization_id) return [];
                      const param = {
                        paging: 1,
                        take: 1000,
                      };
                      const params = await events("onload-param", param);
                      const res: any = await api.get(
                        `${process.env.NEXT_PUBLIC_API_PORTAL}/api/organization-locations/organization/${fm.data?.for_organization_id}` +
                          params
                      );
                      const data: any[] = res.data.data;
                      if (!Array.isArray(data)) return [];
                      return data.map((e) => {
                        return {
                          value: e.id,
                          label: e.name,
                          data: e,
                        };
                      });
                    }}
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
                    disabled={true}
                    name={"remaining_balance"}
                    label={"Remaining Balance"}
                    type={"money"}
                  />
                </div>
                <div></div>
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
                    name={"total_needs"}
                    label={"Total Needs"}
                    type={"money"}
                  />
                </div>
                <div></div>
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
                  <div className="col-span-2">
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
                    onChange={() => {
                      const run = async () => {
                        if (fm.data?.minimum_education) {
                          fm.data.enable_majors = false;
                          try {
                            const res: any = await api.get(
                              `${process.env.NEXT_PUBLIC_API_MPP}/api/majors/education-level?education_level=` +
                                fm.data?.minimum_education
                            );
                            if (
                              Array.isArray(res?.data?.data) &&
                              res?.data?.data?.length
                            ) {
                              fm.data.enable_majors = true;
                            }
                          } catch (ex) {}
                        } else {
                          fm.data.enable_majors = false;
                        }
                        fm.render();
                      };
                      run();
                    }}
                    onLoad={() => {
                      return [
                        {
                          label: "1 - Doctoral / Professor",
                          value: "1 - Doctoral / Professor",
                        },
                        {
                          label: "2 - Master Degree",
                          value: "2 - Master Degree",
                        },
                        { label: "3 - Bachelor", value: "3 - Bachelor" },
                        { label: "4 - Diploma 1", value: "4 - Diploma 1" },
                        { label: "5 - Diploma 2", value: "5 - Diploma 2" },
                        { label: "6 - Diploma 3", value: "6 - Diploma 3" },
                        { label: "7 - Diploma 4", value: "7 - Diploma 4" },
                        {
                          label: "8 - Elementary School",
                          value: "8 - Elementary School",
                        },
                        {
                          label: "9 - Senior High School",
                          value: "9 - Senior High School",
                        },
                        {
                          label: "10 - Junior High School",
                          value: "10 - Junior High School",
                        },
                        { label: "11 - Unschooled", value: "11 - Unschooled" },
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
                    disabled={
                      !fm.data?.minimum_education || !fm.data?.enable_majors
                    }
                    onLoad={async () => {
                      if (!fm.data?.minimum_education) {
                        return [];
                      }
                      const res: any = await api.get(
                        `${process.env.NEXT_PUBLIC_API_MPP}/api/majors/education-level?education_level=` +
                          fm.data.minimum_education
                      );
                      const data: any[] = res.data.data;
                      if (!Array.isArray(data)) {
                        return [];
                      }
                      return data.map((e) => {
                        return {
                          value: e.id,
                          label: e.major,
                          data: e,
                        };
                      });
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"experiences"}
                    label={"Work Experience"}
                    type={"textarea"}
                  />
                </div>
                <div></div>
                <div className="col-span-2">
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
                <div className="col-span-2">
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
                    name={"direktur"}
                    label={"VP/GM/Direktur"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"manager"}
                    label={"Manager/Dept.Head"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field fm={fm} name={"ceo"} label={"CEO"} disabled={true} />
                </div>
                <div></div>

                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    disabled={true}
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
