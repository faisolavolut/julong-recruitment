"use client";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { IoEye } from "react-icons/io5";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { getParams } from "@/lib/utils/get-params";
import { ButtonBetterTooltip } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { RiAiGenerate } from "react-icons/ri";
import {
  detectUniqueExperience,
  getTotalExperience,
} from "@/app/lib/workExperiences";
import { FilePreview } from "@/lib/components/form/field/FilePreview";
import { get_user } from "@/lib/utils/get_user";

function Page() {
  const id_schedule = getParams("id_schedule");
  const local = useLocal({
    can_add: false,
    can_edit: false,
    tab: "interview",
    interview: null as any,
    final_interview: null as any,
    order_interview: 0,
    order_final_interview: 0,
    assessor: {
      interview: null as any,
      final_interview: null as any,
    },
    schedule: null as any,
    ready: false,
  });

  useEffect(() => {
    const run = async () => {
      local.can_add = access("create-final-result-interview");
      local.can_edit = access("edit-final-result-interview");

      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/interviews/${id_schedule}`,
        validate: "object",
      });
      const assessors = data?.interview_assessors;
      const myAssessor = assessors.find(
        (er: any) => er?.employee_id === get_user("employee.id")
      );
      local.schedule = data;
      console.log({ data, myAssessor });
      //
      local.assessor = myAssessor;
      local.ready = true;
      local.render();
      return;
      // const data: any = await apix({
      //   port: "recruitment",
      //   value: "data.data",
      //   path: `/api/job-postings/${id_posting}`,
      //   validate: "object",
      // });
      // try {
      //   const final_interview: any = await apix({
      //     port: "recruitment",
      //     value: "data.data",
      //     path: `/api/project-recruitment-lines/header/${data?.project_recruitment_header_id}?form_type=INTERVIEW`,
      //     validate: "object",
      //   });
      //   const assessor_final_interview: any = await apix({
      //     port: "recruitment",
      //     value: "data.data",
      //     path: `/api/interviews/assessor-schedule?project_recruitment_line_id=${final_interview?.[0]?.id}&job_posting_id=${id_posting}`,
      //     validate: "object",
      //   });
      //   local.assessor.final_interview =
      //     assessor_final_interview?.[0]?.interview_assessor;
      //   local.final_interview = final_interview?.[0];
      //   local.order_final_interview = final_interview?.[0]?.order;
      //   const interview: any = await apix({
      //     port: "recruitment",
      //     value: "data.data",
      //     path: `/api/project-recruitment-lines/header/${data?.project_recruitment_header_id}?form_type=INTERVIEW`,
      //     validate: "object",
      //   });
      //   const assessor_interview: any = await apix({
      //     port: "recruitment",
      //     value: "data.data",
      //     path: `/api/interviews/assessor-schedule?project_recruitment_line_id=${interview?.[0]?.id}&job_posting_id=${id_posting}`,
      //     validate: "object",
      //   });
      //   local.assessor.interview = assessor_interview?.[0]?.interview_assessor;
      //   local.interview = interview?.[0];
      //   local.order_interview = interview?.[0]?.order;
      // } catch (ex) {}
      // try {
      // } catch (ex) {}
    };
    run();
  }, []);
  if (!local.ready)
    return (
      <div className="flex-grow flex-grow flex flex-row items-center justify-center">
        <div className="spinner-better"></div>
      </div>
    );
  return (
    <TableUI
      tab={[
        { id: "interview", name: "Interview" },
        { id: "final_interview", name: "Final Interview" },
      ]}
      modeTab="only-title"
      onTab={(e: string) => {
        local.tab = e;
        local.render();
      }}
      breadcrumb={[
        {
          title: "List Job Posting",
          url: "/d/interview/result-interview",
        },
        {
          title: "List Applicant",
          // url: "/d/interview/result-interview/" + id_posting,
        },
      ]}
      title="Result Interview"
      name="result-interview"
      header={{
        sideLeft: (data: any) => {
          return <></>;
        },
      }}
      column={[
        {
          name: "user_profile.name",
          header: "Applicant Name",
          renderCell: ({ row, name }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "job_name",
          header: "Job Name",
          renderCell: ({ row, name }: any) => {
            return (
              <>
                {detectUniqueExperience(
                  getValue(row, "user_profile.work_experiences")
                )}
              </>
            );
          },
        },
        {
          name: "job_experience",
          header: "Job Experience",
          renderCell: ({ row, name }: any) => {
            return (
              <>
                {detectUniqueExperience(
                  getValue(row, "user_profile.work_experiences"),
                  "company_name",
                  "company experiences"
                )}
              </>
            );
          },
        },
        {
          name: "user_profile.work_experiences",
          header: "Work Experience (Year)",
          renderCell: ({ row, name }: any) => {
            return <>{getTotalExperience(getValue(row, name))}</>;
          },
        },
        {
          name: "user_profile.curriculum_vitae",
          header: "CV",
          renderCell: ({ row, name }: any) => {
            return (
              <FilePreview
                url={getValue(row, name)}
                disabled={true}
                limit_name={10}
              />
            );
          },
        },
        {
          name: "assessment_status",
          sortable: false,
          header: "Status Selection",
          renderCell: ({ row, render }: any) => {
            if (row.status === "ACCEPTED") {
              return (
                <div className="bg-green-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                  Accepted
                </div>
              );
            } else if (row.status === "REJECTED") {
              return (
                <div className="bg-red-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                  Rejected
                </div>
              );
            }
            return (
              <div className="bg-gray-500 text-center py-1 text-xs rounded-full font-bold text-white flex flex-row items-center justify-center w-24">
                Pending
              </div>
            );
          },
        },
        {
          name: "action",

          header: "Action",
          filter: false,
          sortable: false,
          renderCell: ({ row }: any) => {
            const form = false;
            let id_line = null;
            let assessor = local.assessor as any;
            if (!assessor)
              return (
                <div className="flex items-center gap-x-0.5 whitespace-nowrap"></div>
              );
            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                {local.assessor ? (
                  <ButtonBetterTooltip
                    tooltip={"Create Result Interview"}
                    className="bg-primary"
                    onClick={async () => {
                      await actionToast({
                        task: async () => {
                          navigate(
                            `/d/interview/result-interview/${id_schedule}/${assessor.id}/${row?.applicant_id}/view`
                          );
                        },
                        after: () => {},
                        msg_load: "Form result ",
                        msg_error: "Form result failed ",
                        msg_succes: "Form result success ",
                      });
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <RiAiGenerate className="text-lg" />
                    </div>
                  </ButtonBetterTooltip>
                ) : (
                  <ButtonLink
                    className="bg-primary"
                    href={`/d/interview/result-interview/${id_schedule}/${assessor.id}/${row?.applicant_id}/view`}
                  >
                    <div className="flex items-center gap-x-2">
                      <IoEye className="text-lg" />
                    </div>
                  </ButtonLink>
                )}
              </div>
            );
          },
        },
      ]}
      onLoad={async (param: any) => {
        const params = await events("onload-param", {
          ...param,
        });

        const result: any = await apix({
          port: "recruitment",
          value: "data.data.interview_applicants",
          path: `/api/interview-applicants/interview-assessor/${id_schedule}${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async (params: any) => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/interview-applicants/interview-assessor/${id_schedule}${params}`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
