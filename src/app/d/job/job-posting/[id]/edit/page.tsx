"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { Alert } from "@/lib/components/ui/alert";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { getParams } from "@/lib/utils/get-params";
import { actionToast } from "@/lib/utils/action";
import { normalDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";

function Page() {
  const id = getParams("id");
  const labelPage = "Job Posting";
  const urlPage = `/d/job/job-posting`;
  const local = useLocal({
    can_edit: false,
    can_delete: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;
      local.can_delete = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready && !local.can_edit && !local.can_delete) return notFound();

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
                    title: "Edit",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {fm?.data?.status === "DRAFT" && local.can_edit && (
                <>
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
                  <Alert
                    type={"save"}
                    msg={"Are you sure you want to save this record?"}
                    onClick={() => {
                      fm.data.status = "IN PROGRESS";
                      fm.submit();
                    }}
                  >
                    <ButtonContainer className={"bg-primary"}>
                      <IoMdSave className="text-xl" />
                      Submit
                    </ButtonContainer>
                  </Alert>
                </>
              )}
              {local.can_delete && (
                <Alert
                  type={"delete"}
                  msg={"Are you sure you want to delete this record?"}
                  onClick={async () => {
                    await actionToast({
                      task: async () => {
                        await apix({
                          port: "recruitment",
                          path: `/api/job-postings/${id}`,
                          method: "delete",
                        });
                      },
                      after: () => {
                        navigate("/d/job/job-posting");
                      },
                      msg_load: "Delete ",
                      msg_error: "Delete ",
                      msg_succes: "Delete successfully! ",
                    });
                  }}
                >
                  <ButtonContainer variant={"destructive"}>
                    <MdDelete className="text-xl" />
                    Delete
                  </ButtonContainer>
                </Alert>
              )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const data = { ...fm.data };

        data["deleted_organization_logo"] = "false";
        data["deleted_poster"] = "false";
        if (!data?.organization_logo) {
          data["deleted_organization_logo"] = "true";
        }
        if (!data?.poster) {
          data["deleted_poster"] = "true";
        }
        if (typeof data?.organization_logo === "string") {
          delete data["organization_logo"];
        }
        if (typeof data?.poster === "string") {
          delete data["poster"];
        }
        delete data["project_recruitment_header"];
        delete data["mp_request"];
        delete data["for_organization"];
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/job-postings/update",
          method: "put",
          type: "form",
          data: {
            ...data,
            document_date: normalDate(fm?.data?.document_date),
            start_date: normalDate(fm?.data?.start_date),
            end_date: normalDate(fm?.data?.end_date),
          },
        });
        if (res) {
          if (fm.data.status !== "DRAFT") navigate(`${urlPage}/${id}/view`);
        }
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/job-postings/${id}`,
          validate: "object",
        });
        if (data.status !== "DRAFT") navigate(`${urlPage}/${id}/view`);
        console.log({
          ...data,
          for_organization_id: data?.for_organization_id,
          for_organization: {
            id: data?.for_organization_id,
            name: data?.for_organization_name,
          },
        });
        return {
          ...data,
          for_organization_id: data?.for_organization_id,
          for_organization: {
            id: data?.for_organization_id,
            name: data?.for_organization_name,
          },
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
                    required={true}
                    target={"project_recruitment_header_id"}
                    name={"project_recruitment_header"}
                    label={"No. Reference Project"}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", {
                        ...param,
                        status: "IN PROGRESS",
                      });
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.project_recruitment_headers",
                        path: `/api/project-recruitment-headers${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"document_number"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"document_date"}
                    label={"Document Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"document_number"}
                    label={"Document No."}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
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

                <div>
                  <Field
                    fm={fm}
                    required={true}
                    target={"mp_request_id"}
                    name={"mp_request"}
                    label={"MPR Document No"}
                    type={"dropdown-async"}
                    onChange={(item: any) => {
                      const data = item?.data;
                      fm.data["job_id"] = data?.job_id;
                      fm.data["job_name"] = data?.job_name;
                      fm.data["minimum_experience"] = data?.minimum_experience;
                      fm.data["for_organization_location_id"] =
                        data?.for_organization_location_id;
                      fm.data["for_organization_location"] = {
                        id: data?.for_organization_location_id,
                        name: data?.for_organization_location_name,
                      };

                      const template = `<p>Description Post</p><p></p><p>1. Job Description </p><p>{job_description}</p><p></p><p>2. Required Qualification </p><p>{required_qualification}</p><p></p><p>3. Work Experience </p><p>{experiences}</p><p></p><p>4. Specific Skills </p><p>{specific_skills}</p><p></p><p>5. Benefits</p><p></p>`;

                      let skill = `
      ${
        data?.certificate ? `<p>Certificate</p><p>${data?.certificate}</p>` : ""
      }
      ${
        data?.computer_skill
          ? `<p>Computer</p><p>${data?.computer_skill}</p>`
          : ""
      }
      ${
        data?.language_skill
          ? `<p>Language</p><p>${data?.language_skill}</p>`
          : ""
      }
      ${data?.other_skill ? `<p>Others</p><p>${data?.other_skill}</p>` : ""}
    `;

                      const result = template
                        .replace("{job_description}", data.jobdesc || "")
                        .replace(
                          "{required_qualification}",
                          data.required_qualification || ""
                        )
                        .replace("{experiences}", data.experiences || "")
                        .replace("{specific_skills}", skill.trim());

                      fm.data.content_description = result;
                      fm.render();

                      if (
                        typeof fm?.fields?.content_description.reload ===
                        "function"
                      ) {
                        fm?.fields?.content_description.reload();
                      }
                    }}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data.mp_request_header",
                        path: `/api/mp-requests${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"document_number"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"job_name"}
                    label={"Job Position"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"start_date"}
                    label={"Start Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"end_date"}
                    label={"End Date"}
                    type={"date"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    label={"Status"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"link"}
                    label={"Link Job Posting"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    target="for_organization_id"
                    name={"for_organization"}
                    label={"Company"}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data.organizations",
                        path: `/api/organizations${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"name"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"minimum_work_experience"}
                    label={"Minimum Experience"}
                    type={"money"}
                    suffix={() => {
                      return <div className="text-sm px-2">Year</div>;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"salary_min"}
                    label={"Minimal Range Salary"}
                    type={"money"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"salary_max"}
                    label={"Maximal Range Salary"}
                    type={"money"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"organization_logo"}
                    label={"Logo Company"}
                    type={"upload"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    required={true}
                    name={"poster"}
                    label={"Poster Recruitment"}
                    type={"upload"}
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    fm={fm}
                    name={"content_description"}
                    label={"Description Post a Job"}
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
