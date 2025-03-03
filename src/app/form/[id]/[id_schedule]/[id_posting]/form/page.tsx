"use client";
import { Field } from "@/lib/components/form/Field";
import {
  convertToTimeOnly,
  formatMoney,
} from "@/lib/components/form/field/TypeInput";
import { Form } from "@/lib/components/form/Form";
import { ButtonBetter } from "@/lib/components/ui/button";
import { Progress } from "@/lib/components/ui/Progress";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import { userToken } from "@/lib/helpers/user";
import { apix } from "@/lib/utils/apix";
import { dayDate, formatTime, normalDate } from "@/lib/utils/date";
import { formatHoursTime } from "@/lib/utils/formatTime";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { siteurl } from "@/lib/utils/siteurl";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaPlay } from "react-icons/fa6";
import { IoMdSave } from "react-icons/io";
import { LuPartyPopper } from "react-icons/lu";
import { BsArrowReturnRight } from "react-icons/bs";
import { actionToast } from "@/lib/utils/action";

function Page() {
  const id = getParams("id");
  const id_posting = getParams("id_posting");
  const id_schedule = getParams("id_schedule");

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startForm, setStartForm] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examEndTime, setExamEndTime] = useState<number | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [expired, setExpired] = useState<boolean>(false);
  const [reminder, setReminder] = useState<boolean>(false);

  const local = useLocal({
    can_add: false,
    can_edit: false,
    roles: null as any,
    ready: false as boolean,
    access: false as boolean,
    user: null as any,
    data: null as any,
    fm: null as any,
    tab: 0 as number,
    maxPage: 0 as number,
    done: false as boolean,
    id_profile: null as any,
    jobposting: null as any,
    start: false,
    end: true,
    detail: null as any,
    id_applicant: null as any,
    header: null as any,
  });
  const config = {
    document_checking: "document_checking",
    question: "template_question",
    document_setup: "document_setup",
  };
  useEffect(() => {
    const run = async () => {
      userToken();
      const w: any = window;
      local.user = w?.user;
      try {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/user-profiles/user",
          method: "get",
        });
        local.id_profile = res.id;
      } catch (ex) {}
      let startTime = null as any;
      let listQuestion = [] as any[];
      let id_line = null as any;
      try {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/job-postings/${id_posting}`,
          validate: "object",
        });

        const profile: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/applicants/me/${id_posting}`,
          validate: "object",
        });
        // const jobposting = await apix({
        //   port: "recruitment",
        //   value: "data.data",
        //   path: `/api/project-recruitment-lines/header/${data?.)}?form_type=TEST`,
        //   method: "get",
        // });
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/project-recruitment-lines/header/${profile?.job_posting?.project_recruitment_header_id}?form_type=TEST`,
          method: "get",
        });
        id_line = res?.[0]?.id;
      } catch (ex) {}
      let id_testschedule = null as any;
      try {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/test-schedule-headers/my-schedule?job_posting_id=${id_posting}&project_recruitment_line_id=${id_line}`,
          method: "get",
        });
        id_testschedule = res?.test_applicants?.test_schedule_header_id;
        local.header = res;
        local.id_applicant = res?.test_applicants?.id;
        startTime = res?.test_applicants?.started_time;
        listQuestion =
          get(
            res,
            "project_recruitment_line.template_activity_line.template_question.questions"
          ) || [];
        listQuestion = Array.isArray(listQuestion)
          ? listQuestion.map((e: any) => {
              const typeAnswer = e?.answer_types?.name.toLowerCase();
              const answer = e?.question_responses || [];
              return {
                ...e,
                deleted_ids: answer.map((e: any) => e?.id),
                answer:
                  typeAnswer === "checkbox"
                    ? answer.map((e: any) => e?.answer)
                    : typeAnswer === "attachment"
                    ? answer?.[0]?.answer_file
                    : answer?.[0]?.answer,
                answer_type_name: e?.answer_types?.name,
                question_options: e?.question_options?.length
                  ? e.question_options.map((e: any) => e.option_text)
                  : [],
              };
            })
          : [];
        if (res?.test_applicants?.assessment_status === "COMPLETED")
          setIsDone(true);
      } catch (ex) {
        console.error(ex);
      }
      local.render();
      if (!isDone) {
        try {
          const schedule = await apix({
            port: "recruitment",
            value: "data.data",
            path: "/api/test-schedule-headers/" + id_testschedule,
            validate: "object",
          });
          const result = {
            ...schedule,
            start_date: new Date(
              `${normalDate(schedule?.schedule_date)} ${convertToTimeOnly(
                schedule?.start_time
              )}`
            ),
            end_date: new Date(
              `${normalDate(schedule?.schedule_date)} ${convertToTimeOnly(
                schedule?.end_time
              )}`
            ),
          };
          local.detail = result;
          setStartTime(new Date(result.start_date));
          setEndTime(new Date(result.end_date));
          setExpired(
            result.end_date
              ? Date.now() > new Date(result.end_date).getTime()
              : true
          );
        } catch (ex) {}
        try {
          const data: any = await apix({
            port: "recruitment",
            value: "data.data",
            path: "/api/template-questions/" + id,
            validate: "object",
          });

          setDuration(data.duration);
          if (startTime) {
            const startFormTime = new Date(startTime).getTime();
            setStartForm(startFormTime);
            setExamEndTime(startFormTime + data?.duration * 60000);
            setIsStarted(true);
          }
          local.maxPage = data?.questions?.length;
          local.data = {
            ...data,
            questions: listQuestion || [],
          };
        } catch (ex) {}
        if (w?.user) {
          try {
            const data: any = await apix({
              port: "recruitment",
              value: "data.data",
              path: `/api/job-postings/${id_posting}`,
              validate: "object",
            });
            local.jobposting = data;
            local.access = data?.is_applied;
          } catch (ex) {}
        }
      }
      local.ready = true;
      local.render();
      local.render();
    };
    run();
  }, []);
  useEffect(() => {
    if (!isStarted || !examEndTime) return;
    const left = Math.max(0, examEndTime - Date.now());
    setTimeLeft(left);
    const timer = setInterval(() => {
      const left = Math.max(0, examEndTime - Date.now());
      setTimeLeft(left);
      if (left <= 0) {
        setExpired(true);
      } else {
        setExpired(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examEndTime, isStarted]);
  const formatTimeLeft = () => {
    if (timeLeft <= 0) return "00:00";
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };
  if (!local.ready)
    return (
      <div className="flex flex-col flex-grow min-h-screen bg-white">
        <div className="flex flex-row p-4 bg-primary text-white font-bold">
          <img
            src={siteurl("/jobsuit-white.png")}
            className="mr-3 h-3 rounded"
            alt="Flowbite Logo"
          />
        </div>
        <div className="w-full flex-grow flex flex-row">
          <div className="flex flex-col flex-grow ">
            <div className="bg-gray-100 text-sm  flex items-center justify-center p-6 flex-grow">
              <div className="spinner-better"></div>
            </div>
          </div>
        </div>
      </div>
    );
  if (!local.access)
    return (
      <div className="flex flex-col flex-grow min-h-screen bg-white">
        <div className="flex flex-row p-4 bg-primary text-white font-bold">
          <img
            src={siteurl("/jobsuit-white.png")}
            className="mr-3 h-3 rounded"
            alt="Flowbite Logo"
          />
        </div>
        <div className="w-full flex-grow flex flex-row">
          <div className="flex flex-col flex-grow ">
            <div className="bg-gray-100 text-sm  flex items-center justify-center p-6 flex-grow">
              <div className="max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-center text-indigo-700">
                  Access Denied
                </h1>
                <p className="mt-4 text-gray-700">
                  You do not have the necessary permissions to view this
                  content. Contact the administrator or support to verify if you
                  have access to this form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col flex-grow min-h-screen bg-white">
      <div className="flex flex-row p-4 bg-primary text-white font-bold relative">
        <img
          src={siteurl("/jobsuit-white.png")}
          className="mr-3 h-3 rounded"
          alt="Flowbite Logo"
        />
        {isStarted && !isDone ? (
          <div
            className={cx(
              "absolute  bg-white px-2 text-sm rounded-full",
              css`
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              `,
              timeLeft <= 300000 ? "text-red-500" : "text-primary"
            )}
          >
            {formatTimeLeft()}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full flex-grow flex flex-row">
        {isDone ? (
          <>
            <div className="flex flex-col flex-grow ">
              <div className="bg-gray-100 text-sm  flex items-center justify-center p-6 flex-grow">
                <div className="max-w-2xl bg-white shadow-lg rounded-lg p-6">
                  <h1 className="text-2xl font-bold text-center text-indigo-700">
                    Thanks
                  </h1>
                  <p className="mt-4 text-gray-700 text-center">
                    Your response has been recorded. Thank you for your
                    submission!
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : !expired && !isStarted ? (
          <>
            <div className="flex flex-col flex-grow ">
              <div className="bg-gray-100 text-sm  flex items-center justify-center p-6 flex-grow">
                <div className="max-w-2xl bg-white shadow-lg rounded-lg p-6">
                  <h1 className="text-2xl font-bold text-center text-indigo-700">
                    Recruitment Test Instructions
                  </h1>
                  <p className="mt-4 text-gray-700">Dear Candidate,</p>
                  <p className="mt-2 text-gray-700">
                    Thank you for applying to{" "}
                    <span className="font-semibold">
                      {local.jobposting.for_organization_name}
                    </span>
                    . You are required to complete the recruitment test as part
                    of our selection process. Please read the following
                    instructions carefully:
                  </p>

                  <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
                    <li>
                      Ensure a stable internet connection before starting the
                      test.
                    </li>
                    <li>
                      Read each question carefully and answer to the best of
                      your ability.
                    </li>
                    <li>
                      Do not refresh or close the browser while taking the test.
                    </li>
                    <li>
                      The test is time-limited, so manage your time wisely.
                    </li>
                    <li>
                      Any form of cheating or assistance from others will result
                      in disqualification.
                    </li>
                  </ul>

                  <div className="mt-6 bg-blue-100 p-4 rounded-md text-sm">
                    <h2 className="text-lg font-semibold text-indigo-700">
                      Test Schedule
                    </h2>
                    <p className="text-gray-700">
                      Date:{" "}
                      <span className="font-semibold">
                        {dayDate(get(local, "detail.start_date")) ===
                        dayDate(get(local, "detail.end_date"))
                          ? dayDate(get(local, "detail.start_date"))
                          : `${dayDate(
                              get(local, "detail.start_date")
                            )} - ${dayDate(get(local, "detail.end_date"))}`}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Time:{" "}
                      <span className="font-semibold">
                        {formatTime(get(local, "detail.start_date"))} -{" "}
                        {formatTime(get(local, "detail.end_date"))}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Duration:{" "}
                      <span className="font-semibold">
                        {formatHoursTime(local.data.duration)}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-center py-2">
                    <ButtonBetter
                      onClick={async () => {
                        await actionToast({
                          task: async () => {
                            await apix({
                              port: "recruitment",
                              path: `/api/test-applicants/update-status`,
                              method: "put",
                              data: {
                                id: local.id_applicant,
                                status: "IN_PROGRESS",
                              },
                            });
                          },
                          after: () => {
                            setIsStarted(true);
                          },
                          msg_load: "Start ",
                          msg_error: "Start failed ",
                          msg_succes: "Start success ",
                        });
                      }}
                      className="text-sm flex flex-row gap-x-1"
                      disabled={
                        !startTime ||
                        !endTime ||
                        Date.now() < startTime.getTime() ||
                        Date.now() > endTime.getTime()
                      }
                    >
                      <FaPlay />
                      Start
                    </ButtonBetter>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : expired ? (
          <>
            <div className="flex flex-col flex-grow ">
              <div className="bg-gray-100 text-sm  flex items-center justify-center p-6 flex-grow">
                <div className="max-w-2xl bg-white shadow-lg rounded-lg p-6">
                  <h1 className="text-2xl font-bold text-center text-indigo-700">
                    Form Closed
                  </h1>
                  <p className="mt-4 text-gray-700 text-center">
                    This form is no longer available. If you need further
                    information, please check with the admin or support team.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col py-1 w-2/6 bg-white border-r border-gray-200">
              <div className="grid grid-cols-1 bg-white">
                <div className="grid  gap-2 grid-cols-1 p-4 border-b border-gray-200">
                  <div className="font-bold text-2xl">
                    {get(local, "data.name")}
                  </div>
                  <div className="whitespace-pre-wrap	py-1">
                    {get(local, "data.description")}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 flex-grow">
                <ScrollArea className="w-full h-full flex flex-col gap-y-2">
                  {local?.data?.questions?.length ? (
                    <>
                      {local?.data?.questions.map((e: any, idx: any) => {
                        const typeField = e?.answer_type_name.toLowerCase();
                        return (
                          <div
                            className={cx(
                              "w-full flex flex-col p-4  cursor-pointer",
                              local.tab === idx
                                ? "bg-gray-100"
                                : "hover:bg-gray-100"
                            )}
                            key={`question_sidebar_${idx}`}
                            onClick={() => {
                              local.tab = idx;
                              local.done = false;
                              local.render();
                              if (typeof local.fm?.submit === "function") {
                                local.fm.submit();
                              }

                              if (typeof local.fm?.reload === "function") {
                                local.fm.reload();
                              }
                            }}
                          >
                            <p className="flex-grow">
                              <span className="font-bold pr-1">
                                Q{idx + 1}:
                              </span>
                              {get(e, "name")}
                            </p>
                            {(Array.isArray(get(e, "answer")) &&
                              get(e, "answer.length")) ||
                            (!Array.isArray(get(e, "answer")) &&
                              get(e, "answer")) ? (
                              <div className="flex flex-row gap-x-1">
                                <div className="text-gray-500 line-clamp-1 pl-1">
                                  <BsArrowReturnRight />
                                </div>
                                <p className="flex-grow text-xs text-gray-500">
                                  {previewAnswer(get(e, "answer"), typeField)}
                                </p>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </ScrollArea>
              </div>
            </div>

            <div className="flex flex-col flex-grow relative">
              <div className="flex flex-col flex-grow items-center justify-center">
                {local.done ? (
                  <>
                    <div className="w-full flex flex-col py-2 ">
                      <div className=" flex flex-col py-4 ">
                        <div className="font-bold flex flex-row items-center justify-center text-lg gap-x-2  px-4 mx-4 py-2">
                          Thanks <LuPartyPopper className="text-pink-500" />
                        </div>
                        <div className=" flex flex-row justify-center text-center items-center text-md gap-x-2 px-4 mx-4 py-2">
                          Your response has been successfully recorded in our
                          database! You can still edit your answers as long as
                          the form remains open.
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full flex flex-col py-2 ">
                      <Form
                        onSubmit={async (fm: any) => {
                          if (fm.data?.update) {
                            const typeField =
                              fm?.data?.answer_type_name.toLowerCase();
                            const question = fm?.data || [];
                            const formData = new FormData();
                            formData.append("question_id", fm.data.id as any);
                            if (fm?.data?.deleted_ids?.length) {
                              fm?.data?.deleted_ids.map((e: any) => {
                                formData.append("deleted_answer_ids[]", e);
                              });
                            }
                            if (
                              Array.isArray(question?.answer) &&
                              question?.answer?.length
                            ) {
                              question?.answer.map((e: any) => {
                                formData.append(
                                  "answers.job_posting_id",
                                  id_posting as any
                                );
                                formData.append(
                                  "answers.user_profile_id",
                                  local.id_profile
                                );
                                formData.append("answers.answer", e);
                              });
                            } else if (typeField === "attachment") {
                              formData.append(
                                "answers.job_posting_id",
                                id_posting as any
                              );
                              formData.append(
                                "answers.user_profile_id",
                                local.id_profile
                              );
                              formData.append(
                                "answers[][answer_file]",
                                question?.answer
                              );
                            } else {
                              formData.append(
                                "answers.job_posting_id",
                                id_posting as any
                              );
                              formData.append(
                                "answers.user_profile_id",
                                local.id_profile
                              );
                              formData.append(
                                "answers.answer",
                                question?.answer
                              );
                            }
                            await apix({
                              port: "recruitment",
                              value: "data.data",
                              method: "post",
                              path: `/api/question-responses`,
                              validate: "object",
                              data: formData,
                              header: "form",
                            });
                          } else {
                          }
                          if (fm.data?.status === "COMPLETED") {
                            await apix({
                              port: "recruitment",
                              path: `/api/test-applicants/update-status`,
                              method: "put",
                              data: {
                                id: local.id_applicant,
                                status: "COMPLETED",
                              },
                            });
                            setIsDone(true);
                          } else {
                            if (typeof fm?.data?.tab === "number") {
                              local.tab = fm.data.tab;
                              local.render();
                            }
                            fm.reload();
                          }
                        }}
                        onLoad={async () => {
                          return get(local, `data.questions[${local.tab}]`);
                        }}
                        showResize={false}
                        header={(fm: any) => {
                          return <></>;
                        }}
                        children={(fm: any) => {
                          const typeField =
                            fm?.data?.answer_type_name.toLowerCase();
                          return (
                            <>
                              <div
                                className={cx("flex flex-col flex-wrap px-8")}
                              >
                                <div className="flex flex-col  py-2">
                                  <div className="grid gap-2 grid-cols-1">
                                    <div className="grid  gap-2 grid-cols-1 p-4 text-xl">
                                      <div className="font-bold text-2xl">
                                        {local.tab + 1}. {get(fm, "data.name")}
                                      </div>
                                      {[
                                        "text",
                                        "paragraph",
                                        "attachment",
                                      ].includes(
                                        typeof fm?.data?.answer_type_name ===
                                          "string"
                                          ? fm?.data?.answer_type_name.toLowerCase()
                                          : null
                                      ) && (
                                        <div className="grid grid-col-1">
                                          <div>
                                            {typeField === "attachment" ? (
                                              <Field
                                                fm={fm}
                                                name={"answer"}
                                                hidden_label={true}
                                                label={"Option"}
                                                type={"upload"}
                                                placeholder="Your Answer"
                                                onChange={() => {
                                                  fm.data.update = true;
                                                  fm.render();
                                                }}
                                              />
                                            ) : (
                                              <Field
                                                fm={fm}
                                                name={"answer"}
                                                style="gform"
                                                hidden_label={true}
                                                label={"Option"}
                                                type={
                                                  typeField === "attachment"
                                                    ? "upload"
                                                    : typeField === "paragraph"
                                                    ? "textarea"
                                                    : "text"
                                                }
                                                onChange={() => {
                                                  fm.data.update = true;
                                                  fm.render();
                                                }}
                                                placeholder="Your Answer"
                                              />
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {[
                                        "multiple choice",
                                        "checkbox",
                                        "single checkbox",
                                        "dropdown",
                                      ].includes(
                                        typeof fm?.data?.answer_type_name ===
                                          "string"
                                          ? fm?.data?.answer_type_name.toLowerCase()
                                          : null
                                      ) && (
                                        <div className="grid grid-col-1">
                                          <div>
                                            <Field
                                              fm={fm}
                                              name={"answer"}
                                              hidden_label={true}
                                              label={"Option"}
                                              type={
                                                typeField === "multiple choice"
                                                  ? "radio"
                                                  : typeField === "checkbox"
                                                  ? "checkbox"
                                                  : typeField ===
                                                    "single checkbox"
                                                  ? "single-checkbox"
                                                  : "dropdown"
                                              }
                                              placeholder="Choose"
                                              onChange={() => {
                                                fm.data.update = true;
                                                fm.render();
                                              }}
                                              onLoad={() => {
                                                const data =
                                                  fm?.data?.question_options ||
                                                  [];
                                                return data.map((e: string) => {
                                                  return {
                                                    label: e,
                                                    value: e,
                                                  };
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div className="px-4 ">
                                    {local.tab > 0 && local.maxPage > 1 ? (
                                      <>
                                        <ButtonBetter
                                          className="rounded-full bg-primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (!fm.data.update) {
                                              local.tab = local.tab - 1;
                                              local.render();
                                              fm.reload();
                                              local.done = false;
                                              local.render();
                                            } else {
                                              fm.data.tab = local.tab - 1;
                                              fm.render();
                                              fm.submit();
                                              local.done = false;
                                              local.render();
                                            }
                                          }}
                                        >
                                          <FaAngleLeft /> Prev
                                        </ButtonBetter>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  <div className="px-4 flex flex-row justify-end">
                                    {local.tab < local.maxPage - 1 &&
                                    local.maxPage > 1 ? (
                                      <>
                                        <ButtonBetter
                                          className="rounded-full bg-primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (!fm.data.update) {
                                              local.tab = local.tab + 1;
                                              local.render();
                                              fm.reload();
                                              local.done = false;
                                              local.render();
                                            } else {
                                              fm.data.tab = local.tab + 1;
                                              fm.render();
                                              fm.submit();
                                              local.done = false;
                                              local.render();
                                            }
                                          }}
                                        >
                                          Next <FaAngleRight />
                                        </ButtonBetter>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {local.tab === local.maxPage - 1 ? (
                                      <>
                                        <ButtonBetter
                                          className="rounded-full bg-primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            fm.data.status = "COMPLETED";
                                            fm.render();
                                            fm.submit();
                                            local.done = false;
                                            local.render();
                                          }}
                                        >
                                          Submit <IoMdSave />
                                        </ButtonBetter>
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
                        onInit={(e: any) => {
                          local.fm = e;
                          local.render();
                        }}
                      />
                    </div>

                    <div className="w-full absolute bottom-0 left-0 py-3 px-4 text-sm  text-white bg-primary flex flex-row items-center justify-center">
                      <p>
                        {answerQuestion(local?.data)} of{" "}
                        {formatMoney(
                          getNumber(get(local, `data.questions.length`))
                        )}{" "}
                        answered
                      </p>
                      <div className="w-[150px] px-2">
                        <Progress
                          value={
                            (getNumber(answerQuestion(local?.data)) /
                              getNumber(get(local, `data.questions.length`))) *
                            100
                          }
                          className={cx(
                            `  w-full bg-transparent border-white border`,
                            css`
                              .indicator {
                                background: white;
                                border-radius: 10px;
                              }
                            `
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
const answerQuestion = (data: any) => {
  const answer = data.questions.filter((e: any) => e.answer);
  return answer?.length;
};
const previewAnswer = (data: any, type?: string) => {
  if (Array.isArray(data)) {
    return data.join(", ");
  }
  if (type === "attachment") {
    return "Already upload file";
  }
  return data;
};

export default Page;
