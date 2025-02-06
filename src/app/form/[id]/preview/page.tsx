"use client";
import { Field } from "@/lib/components/form/Field";
import { Form } from "@/lib/components/form/Form";
import { ButtonBetter } from "@/lib/components/ui/button";
import { Skeleton } from "@/lib/components/ui/Skeleton";
import { userToken } from "@/lib/helpers/user";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { cloneFM } from "@/lib/utils/cloneFm";
import { getParams } from "@/lib/utils/get-params";
import { siteurl } from "@/lib/utils/siteurl";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";

function Page() {
  const id = getParams("id");
  const labelPage = "Template";
  const urlPage = "/d/master-data/question";
  const local = useLocal({
    can_add: false,
    can_edit: false,
    roles: null as any,
    ready: false as boolean,
    access: false as boolean,
    user: null as any,
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
  return (
    <div className="flex flex-col flex-grow gap-y-3 bg-second min-h-screen">
      <div className="flex flex-col bg-white w-full p-4 shadow-md">
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
      <div className="w-full flex-grow flex flex-row  rounded-lg overflow-hidden justify-center">
        <div className="w-full max-w-2xl py-2 flex flex-row flex-grow  relative">
          <Form
            onSubmit={async (fm: any) => {
              console.log(fm.data);
            }}
            onLoad={async () => {
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
              const result = {
                id,
                ...data,
                document_setup_name: data?.document_setup?.title,
                document_checking: [],
                template_question: question || [],
              };
              console.log({ result });
              return result;
            }}
            showResize={false}
            header={(fm: any) => {
              return <></>;
            }}
            children={(fm: any) => {
              return (
                <>
                  <div className={cx("flex flex-col flex-wrap")}>
                    <div className="flex flex-col  px-4 py-2">
                      <div className="grid gap-2 grid-cols-1">
                        <div className="grid grid-cols-1 bg-white rounded-lg border border-gray-300 overflow-hidden">
                          <div className="py-1 w-full bg-primary"></div>
                          <div className="grid  gap-2 grid-cols-1 p-4">
                            <div className="font-bold text-2xl">
                              {get(fm, "data.name")}
                            </div>
                            <div className="whitespace-pre-wrap	py-1">
                              {get(fm, "data.description")}
                            </div>
                          </div>
                        </div>
                        {fm.data?.template_question?.length >= 1 &&
                          fm.data.template_question.map(
                            (e: any, idx: number) => {
                              const fm_row = cloneFM(fm, e);
                              const typeField =
                                fm_row?.data?.answer_type_name.toLowerCase();
                              return (
                                <div
                                  className="grid  gap-2 grid-cols-1 bg-white rounded-lg border border-gray-300 p-4"
                                  key={`question_${idx}`}
                                >
                                  <div>{get(e, "name")}</div>
                                  {["text", "paragraph", "attachment"].includes(
                                    typeof fm_row?.data?.answer_type_name ===
                                      "string"
                                      ? fm_row?.data?.answer_type_name.toLowerCase()
                                      : null
                                  ) && (
                                    <div className="grid grid-col-1">
                                      <div>
                                        {typeField === "attachment" ? (
                                          <Field
                                            fm={cloneFM(fm, e)}
                                            name={"answer"}
                                            hidden_label={true}
                                            label={"Option"}
                                            type={"upload"}
                                            placeholder="Your Answer"
                                          />
                                        ) : (
                                          <Field
                                            fm={cloneFM(fm, e)}
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
                                    "single checkbox",
                                    "dropdown",
                                  ].includes(
                                    typeof fm_row?.data?.answer_type_name ===
                                      "string"
                                      ? fm_row?.data?.answer_type_name.toLowerCase()
                                      : null
                                  ) && (
                                    <div className="grid grid-col-1">
                                      <div>
                                        <Field
                                          fm={cloneFM(fm, e)}
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
                                          onLoad={() => {
                                            const data =
                                              e?.question_options || [];
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
                              );
                            }
                          )}
                      </div>
                    </div>
                    <div className="px-4 ">
                      <ButtonBetter
                        className="border-none bg-linear-sidebar-active shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          fm.submit();
                        }}
                      >
                        Submit
                      </ButtonBetter>
                    </div>
                  </div>
                </>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
