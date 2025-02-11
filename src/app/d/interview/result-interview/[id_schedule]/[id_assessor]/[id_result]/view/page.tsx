"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { cloneFM } from "@/lib/utils/cloneFm";
import { getParams } from "@/lib/utils/get-params";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";
import { IoCheckmarkOutline } from "react-icons/io5";

function Page() {
  const id_schedule = getParams("id_schedule");
  const id_assessor = getParams("id_assessor");
  const id_result = getParams("id_result");
  const labelPage = "Result Interview";
  const urlPage = `/d/interview/result-interview`;
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    can_approve: true,
  });

  useEffect(() => {
    const run = async () => {
      local.can_edit = true;

      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/interviews/${id_schedule}`,
        validate: "object",
      });
      const result: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/interviews/applicant-schedule?project_recruitment_line_id=${data?.project_recruitment_line_id}&job_posting_id=${data?.job_posting_id}&applicant_id=${id_result}`,
        validate: "object",
      });
      console.log({ result });
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
                    title: `List Applicant Interview`,
                    url: `${urlPage}/${id_schedule}`,
                  },
                  {
                    title: "Form Result",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              {local.can_approve &&
                !["ACCEPTED", "REJECTED"].includes(fm.data?.status) && (
                  <>
                    <Alert
                      type={"save"}
                      msg={"Are you sure you want to save this form result?"}
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
                      msg={"Are you sure you want to accepted this applicant?"}
                      onClick={async () => {
                        await actionToast({
                          task: async () => {
                            await apix({
                              port: "recruitment",
                              path: `/api/interview-applicants/update-status`,
                              method: "post",
                              data: {
                                id: id_result,
                                status: "ACCEPTED",
                              },
                            });
                          },
                          after: () => {
                            fm.data.status === "ACCEPTED";
                            fm.render();
                          },
                          msg_load: "Accepted ",
                          msg_error: "Accepted failed ",
                          msg_succes: "Accepted success ",
                        });
                      }}
                    >
                      <ButtonContainer className={"bg-primary"}>
                        <IoCheckmarkOutline className="text-xl" />
                        Approved
                      </ButtonContainer>
                    </Alert>
                    <Alert
                      type={"delete"}
                      msg={"Are you sure you want to reject this applicant?"}
                      onClick={async () => {
                        await actionToast({
                          task: async () => {
                            await apix({
                              port: "recruitment",
                              path: `/api/interview-applicants/update-status`,
                              method: "post",
                              data: {
                                id: id_result,
                                status: "REJECTED",
                              },
                            });
                          },
                          after: () => {
                            fm.data.status === "REJECTED";
                            fm.render();
                          },
                          msg_load: "Rejected ",
                          msg_error: "Rejected failed ",
                          msg_succes: "Rejected success ",
                        });
                      }}
                    >
                      <ButtonContainer variant={"destructive"}>
                        <X className="text-xl" />
                        Rejected
                      </ButtonContainer>
                    </Alert>
                  </>
                )}
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const question = fm?.data?.question;
        console.log({ question });
        const job_posting_id = fm?.data?.job_posting_id;
        const user_profile_id = fm?.data?.applicant?.user_profile_id;
        const result: any[] = [];
        question.map((e: any) => {
          const answers: any[] = [];
          if (Array.isArray(e?.answer) && e?.answer?.length) {
            e?.answer.map((e: any) => {
              const answer =
                typeof e === "string"
                  ? {
                      answer: e,
                      job_posting_id: job_posting_id,
                      user_profile_id: user_profile_id,
                      interview_assessor_id: id_assessor,
                    }
                  : e?.answer
                  ? {
                      ...e,
                      job_posting_id: job_posting_id,
                      user_profile_id: user_profile_id,
                      interview_assessor_id: id_assessor,
                    }
                  : null;
              if (answer) answers.push(answer);
            });
          } else {
            const answer =
              typeof e?.answer === "string"
                ? {
                    answer: e?.answer,
                    job_posting_id: job_posting_id,
                    user_profile_id: user_profile_id,
                    interview_assessor_id: id_assessor,
                  }
                : e?.answer
                ? {
                    ...e,
                    job_posting_id: job_posting_id,
                    user_profile_id: user_profile_id,
                    interview_assessor_id: id_assessor,
                  }
                : null;
            if (answer) answers.push(answer);
          }
          result.push({
            id: e?.id,
            answers,
          });
        });
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/question-responses/answer-interview",
          method: "post",
          data: {
            template_question_id: get(
              fm?.data,
              "project_recruitment_line.template_activity_line.question_template_id"
            ),
            questions: result,
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/interviews/${id_schedule}`,
          validate: "object",
        });
        const result: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/interviews/applicant-schedule?project_recruitment_line_id=${data?.project_recruitment_line_id}&job_posting_id=${data?.job_posting_id}&applicant_id=${id_result}`,
          validate: "object",
        });
        const applicant: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/applicants/${id_result}`,
          validate: "object",
        });
        console.log({
          ...data,
          applicant,
          question: get(
            result,
            "project_recruitment_line.template_activity_line.template_question.questions"
          ),
        });
        const list_assessor = data?.interview_assessors || [];
        const assessor = list_assessor.find((e: any) => e?.id === id_assessor);
        const list_question = get(
          result,
          "project_recruitment_line.template_activity_line.template_question.questions"
        );

        return {
          ...data,
          job_name: data?.job_posting?.job_name,
          applicant,
          interviewer_name: assessor?.employee_name,
          question: list_question.map((e: any) => {
            const typeAnswer = e?.answer_types?.name.toLowerCase();
            const answer = e?.question_responses || [];
            return {
              ...e,
              id_answer: answer?.[0]?.id,
              answer:
                typeAnswer === "checkbox"
                  ? answer.map((e: any) => e?.answer)
                  : typeAnswer === "attachment"
                  ? answer?.[0]?.answer_file
                  : answer?.[0]?.answer,
            };
          }),
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
                    name={"name"}
                    label={"Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"schedule_date"}
                    label={"Interview Date"}
                    type={"date"}
                    disabled={true}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"job_name"}
                    label={"Job Name"}
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
                    name={"interviewer_name"}
                    label={"Interviewer Name"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
                <div className=" col-span-2 grid gap-4 md:grid-cols-1">
                  {fm?.data?.question?.length ? (
                    <>
                      {fm?.data?.question.map((e: any, idx: number) => {
                        const typeField = e?.answer_types?.name
                          ? e.answer_types?.name.toLowerCase()
                          : null;
                        let fm_row = cloneFM(fm, e);
                        return (
                          <div className="" key={`question_${idx}`}>
                            {["text", "paragraph", "attachment"].includes(
                              typeField
                            ) && (
                              <>
                                {typeField === "attachment" ? (
                                  <Field
                                    fm={fm_row}
                                    name={"answer"}
                                    label={e?.name}
                                    type={"upload"}
                                    placeholder="Your Answer"
                                    onChange={() => {
                                      fm_row.data.update = true;
                                      fm.render();
                                    }}
                                  />
                                ) : (
                                  <Field
                                    fm={fm_row}
                                    name={"answer"}
                                    label={e?.name}
                                    type={
                                      typeField === "attachment"
                                        ? "upload"
                                        : typeField === "paragraph"
                                        ? "textarea"
                                        : "textarea"
                                    }
                                    onChange={() => {
                                      fm_row.data.update = true;
                                      fm.render();
                                    }}
                                    placeholder="Your Answer"
                                  />
                                )}
                              </>
                            )}
                            {[
                              "multiple choice",
                              "checkbox",
                              "single checkbox",
                              "dropdown",
                            ].includes(typeField) && (
                              <>
                                <Field
                                  fm={fm_row}
                                  name={"answer"}
                                  label={e?.name}
                                  type={
                                    typeField === "multiple choice"
                                      ? "radio"
                                      : typeField === "checkbox"
                                      ? "checkbox"
                                      : typeField === "single checkbox"
                                      ? "single-checkbox"
                                      : "dropdown"
                                  }
                                  className={
                                    typeField === "single checkbox"
                                      ? "grid md:grid-cols-4"
                                      : ""
                                  }
                                  placeholder="Choose"
                                  onChange={() => {
                                    fm_row.data.update = true;
                                    fm.render();
                                  }}
                                  onLoad={() => {
                                    const data = e?.question_options || [];
                                    return data.map((e: any) => {
                                      return {
                                        label: e?.option_text,
                                        value: e?.option_text,
                                      };
                                    });
                                  }}
                                />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
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
