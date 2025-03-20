"use client";
import { Field } from "@/lib/components/form/Field";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { Form } from "@/lib/components/form/Form";
import { ButtonBetter } from "@/lib/components/ui/button";
import { Progress } from "@/lib/components/ui/Progress";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { siteurl } from "@/lib/utils/siteurl";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdSave } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";

function Page() {
  const id = getParams("id");

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
        local.data = {
          ...data,
          questions: question,
        };
      } catch (ex) {}
      const w: any = window;
      local.user = w?.user;
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
  return (
    <div className="flex flex-col flex-grow min-h-screen bg-white">
      <div
        className={cx(
          "flex flex-col bg-white w-full p-4 shadow-md sticky top-0",
          css`
            z-index: 1;
          `
        )}
      >
        <div className="grid grid-cols-2">
          <div>
            <ButtonBetter
              variant="outline"
              onClick={() => {
                window.history.back();
              }}
            >
              <FaAngleLeft />
              Preview Mode
            </ButtonBetter>
          </div>
          <div className="flex flex-row justify-end">
            <div className="">
              <Field
                fm={{
                  fields: {} as any,
                  data: {
                    link: siteurl(`/form/${id}`),
                  },
                  render: () => {},
                }}
                name={"link"}
                hidden_label={true}
                label={"Option"}
                type={"text"}
                placeholder="Your Answer"
                suffix={() => {
                  return (
                    <div
                      className="px-1 cursor-pointer"
                      onClick={async () => {
                        await actionToast({
                          task: async () => {
                            navigator.clipboard.writeText(
                              siteurl(`/form/${id}`)
                            );
                          },
                          after: () => {},
                          msg_load: "Copy ",
                          msg_error: "Failed to copy url ",
                          msg_succes: "Copy url successfully! ",
                        });
                      }}
                    >
                      <IoCopyOutline />
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-grow flex flex-row">
        <div className="hidden md:flex flex-col py-1 min-w-[350px] max-w-[350px] bg-white border-r border-gray-200">
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
                          local.fm.data.tab = idx;
                          local.fm.data = {
                            ...local.fm.data,
                            ...local.data.questions[idx],
                          };
                          local.fm.render();
                          if (
                            typeof local.fm.fields?.answer?.reload ===
                            "function"
                          ) {
                            local.fm.fields.answer.reload();
                          }
                          if (typeof local.fm?.reload === "function") {
                            local.fm.reload();
                          }
                        }}
                      >
                        <p className="flex-grow">
                          <span className="font-bold pr-1">Q{idx + 1}:</span>
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
            <div className="flex flex-row flex-grow items-center">
              <div className="w-full flex flex-col py-2 md:min-w-[350px]">
                <Form
                  onSubmit={async (fm: any) => {
                    local.tab = fm.data.tab;
                    local.render();
                    fm.reload();
                  }}
                  onLoad={async () => {
                    return {
                      ...get(local, `data.questions[${local.tab}]`),
                      tab: local.tab,
                    };
                  }}
                  showResize={false}
                  header={(fm: any) => {
                    return <></>;
                  }}
                  children={(fm: any) => {
                    const typeField = fm?.data?.answer_type_name.toLowerCase();
                    return (
                      <>
                        <div className={cx("flex flex-col flex-wrap px-8")}>
                          <div className="flex flex-col  py-2">
                            <div className="grid gap-2 grid-cols-1">
                              <div className="grid  gap-2 grid-cols-1 p-4 text-xl">
                                <div className="font-bold text-2xl">
                                  {local.tab + 1}. {get(fm, "data.name")}
                                </div>
                                {["text", "paragraph", "attachment"].includes(
                                  typeof fm?.data?.answer_type_name === "string"
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
                                          style="underline"
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
                                            console.log(fm.data.update);
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
                                  typeof fm?.data?.answer_type_name === "string"
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
                                            : typeField === "single checkbox"
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
                                            fm?.data?.question_options || [];
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
            </div>

            <div className="w-full sticky md:absolute bottom-0 left-0 py-3 px-4 text-sm  text-white bg-primary flex flex-row items-center justify-center">
              <p>
                {0} of{" "}
                {formatMoney(getNumber(get(local, `data.questions.length`)))}{" "}
                answered
              </p>
              <div className="w-[150px] px-2">
                <Progress
                  value={0}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
