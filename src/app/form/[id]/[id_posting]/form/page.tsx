"use client";
import { Field } from "@/lib/components/form/Field";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { Form } from "@/lib/components/form/Form";
import { ButtonBetter } from "@/lib/components/ui/button";
import { Progress } from "@/lib/components/ui/Progress";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import { Skeleton } from "@/lib/components/ui/Skeleton";
import { userToken } from "@/lib/helpers/user";
import { apix } from "@/lib/utils/apix";
import { dayDate, formatTime } from "@/lib/utils/date";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { siteurl } from "@/lib/utils/siteurl";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdSave } from "react-icons/io";
import { LuPartyPopper } from "react-icons/lu";

function Page() {
  const id = getParams("id");
  const id_posting = getParams("id_posting");
  const labelPage = "Template";
  const urlPage = "/d/master-data/question";
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
      try {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-questions/" + id,
          validate: "object",
        });
        const question = data?.questions?.length
          ? data.questions.map((e: any) => {
              return {
                ...e,
                answer_type_name: e?.answer_types?.name,
                question_options: e?.question_options?.length
                  ? e.question_options.map((e: any) => e.option_text)
                  : [],
              };
            })
          : [];
        local.maxPage = question?.length;
        local.data = { ...data, questions: question };
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
          local.access = data.is_applied;
        } catch (ex) {}
      }
      local.can_add = true;
      local.ready = true;
      local.render();
      local.render();
    };
    run();
  }, []);
  if (local.ready && !local.can_add) return notFound();
  if (!local.ready)
    return (
      <div className="flex flex-row flex-grow h-screen bg-second justify-center">
        <div className="w-full flex-grow flex flex-row  rounded-lg overflow-hidden justify-center">
          <div className="w-full max-w-xl py-2 flex flex-row flex-grow  relative">
            <div className={cx("flex flex-col flex-wrap w-full")}>
              <div className="flex flex-col  px-4 py-2">
                <div className="grid gap-2 grid-cols-1">
                  <div className="grid grid-cols-1 bg-white rounded-lg border border-gray-300 overflow-hidden">
                    <div className="py-1 w-full bg-primary"></div>
                    <div className="grid  gap-2 grid-cols-1 p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                        <Skeleton className="h-8 w-[200px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  if (!local.access)
    return (
      <div className="flex flex-row flex-grow h-screen bg-second justify-center">
        <div className="w-full flex-grow flex flex-row  rounded-lg overflow-hidden justify-center">
          <div className="w-full max-w-xl py-2 flex flex-row flex-grow  relative">
            <div className={cx("flex flex-col flex-wrap w-full")}>
              <div className="flex flex-col  px-4 py-2">
                <div className="grid gap-2 grid-cols-1">
                  <div className="grid grid-cols-1 bg-white rounded-lg border border-gray-300 overflow-hidden">
                    <div className="py-1 w-full bg-primary"></div>
                    <div className="grid  gap-2 grid-cols-1 p-4">
                      <div className="font-bold text-2xl">
                        You need permission
                      </div>
                      <div className="whitespace-pre-wrap	py-1">
                        This form can only be viewed by applicants.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
        {false ? (
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

                  <p className="mt-4 text-gray-700">
                    If you experience any technical issues, please contact our
                    support team at{" "}
                    <span className="font-semibold">[Support Contact]</span>.
                  </p>
                  <div className="mt-6 bg-blue-100 p-4 rounded-md text-sm">
                    <h2 className="text-lg font-semibold text-indigo-700">
                      Test Schedule
                    </h2>
                    <p className="text-gray-700">
                      Date:{" "}
                      <span className="font-semibold">
                        {dayDate(new Date())}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Time:{" "}
                      <span className="font-semibold">
                        {formatTime(new Date())} - {formatTime(new Date())}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Duration:{" "}
                      <span className="font-semibold">
                        {local.data.duration} Minutes
                      </span>
                    </p>
                  </div>
                  <p className="mt-6 text-center font-semibold text-indigo-700">
                    Good luck!
                  </p>

                  <p className="mt-2 text-gray-700 text-center">
                    Best regards,
                  </p>
                  <p className="text-gray-700 text-center font-semibold">
                    [Company Name] Recruitment Team
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
                        // {get(e, "name")}
                        return (
                          <div
                            className={cx(
                              "w-full flex flex-row p-4  cursor-pointer",
                              local.tab === idx
                                ? "bg-gray-100"
                                : "hover:bg-gray-100"
                            )}
                            key={`question_sidebar_${idx}`}
                            onClick={() => {
                              local.tab = idx;
                              local.done = false;
                              local.render();
                              if (typeof local.fm?.reload === "function") {
                                local.fm.reload();
                              }
                            }}
                          >
                            <p>
                              <span className="font-bold pr-1">
                                Q{idx + 1}:
                              </span>
                              {get(e, "name")}
                            </p>
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
                          const typeField =
                            fm?.data?.answer_type_name.toLowerCase();
                          let data: any = {
                            question_id: fm.data.id,
                          };
                          const question = fm?.data || [];
                          console.log(question);
                          const formData = new FormData();
                          formData.append("question_id", fm.data.id as any);
                          formData.append(
                            "answers.job_posting_id",
                            id_posting as any
                          );
                          formData.append(
                            "answers.user_profile_id",
                            local.id_profile
                          );
                          if (
                            Array.isArray(question?.answer) &&
                            question?.answer?.length
                          ) {
                            question?.answer.map((e: any) => {
                              formData.append("answers.answer", e);
                            });
                          } else if (typeField === "attachment") {
                            formData.append(
                              "answers[][answer_file]",
                              question?.answer
                            );
                          } else {
                            formData.append("answers.answer", question?.answer);
                          }
                          console.log(formData);
                          console.log({ formData });
                          await apix({
                            port: "recruitment",
                            value: "data.data",
                            method: "post",
                            path: `/api/question-responses`,
                            validate: "object",
                            data: formData,
                            header: "form",
                          });
                          local.tab = fm.data.tab;
                          local.render();
                          fm.reload();
                        }}
                        onLoad={async () => {
                          return get(local, `data.questions[${local.tab}]`);
                          const data: any = await apix({
                            port: "recruitment",
                            value: "data.data",
                            path: "/api/template-questions/" + id,
                            validate: "object",
                          });
                          const question = data?.questions?.length
                            ? data.questions.map((e: any) => {
                                return {
                                  ...e,
                                  answer_type_name: e?.answer_types?.name,
                                  question_options: e?.question_options?.length
                                    ? e.question_options.map(
                                        (e: any) => e.option_text
                                      )
                                    : [],
                                };
                              })
                            : [];
                          const result = {
                            id,
                            ...data,
                            document_setup_name: data?.document_setup?.title,
                            document_checking: [],
                            template_question: question || [],
                            page: 1,
                            maxPage: question?.length,
                          };
                          return result;
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
                                                placeholder="Your Answer"
                                              />
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {[
                                        "multiple choice",
                                        "checkbox",
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
                                                  : "dropdown"
                                              }
                                              placeholder="Choose"
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
                                            fm.data.tab = local.tab - 1;
                                            fm.render();
                                            fm.submit();
                                            local.done = false;
                                            local.render();
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
                                            fm.data.tab = local.tab + 1;
                                            fm.render();
                                            fm.submit();
                                            local.done = false;
                                            local.render();
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
                        onFooter={(fm: any) => {
                          return <></>;
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
export default Page;
