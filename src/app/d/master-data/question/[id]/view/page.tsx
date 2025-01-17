"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { TableList } from "@/lib/components/tablelist/TableList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerCustom,
} from "@/lib/components/ui/accordion";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { cloneFM } from "@/lib/utils/cloneFm";
import { labelDocumentType } from "@/lib/utils/document_type";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoMdSave } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

function Page() {
  const id = getParams("id");
  const labelPage = "Template";
  const urlPage = "/d/master-data/question";
  const local = useLocal({
    can_add: false,
    can_edit: false,
    roles: null as any,
    ready: false as boolean,
  });
  const config = {
    document_checking: "document_checking",
    question: "template_question",
    document_setup: "document_setup",
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
      mode="view"
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
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Template"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"form_type"}
                    label={"Document Type"}
                    type={"dropdown"}
                    onLoad={async () => {
                      return [
                        {
                          label: labelDocumentType(fm?.data?.form_type),
                          value: fm?.data?.form_type,
                        },
                      ];
                    }}
                  />
                </div>

                {["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
                  fm?.data?.form_type
                ) && (
                  <div>
                    <Field
                      fm={fm}
                      name={"document_setup_name"}
                      label={"Document Tittle - Recruitment Type"}
                      type={"text"}
                    />
                  </div>
                )}
                <div>
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    hidden_label={true}
                    label={""}
                    type={"single-checkbox"}
                    onLoad={() => {
                      return [
                        {
                          label: "Active",
                          value: "ACTIVE",
                        },
                      ];
                    }}
                  />
                </div>
                <div>
                  {["TEST", "INTERVIEW", "FGD", "FINAL_INTERVIEW"].includes(
                    fm?.data?.form_type
                  ) && (
                    <Field
                      fm={fm}
                      name={"duration"}
                      label={"Duration (minute)"}
                      type={"money"}
                      suffix={
                        <div className="text-md flex flex-row items-center font-bold">
                          minute
                        </div>
                      }
                    />
                  )}
                </div>
                {/* Detail Question */}
                {["TEST", "INTERVIEW", "FGD", "FINAL_INTERVIEW"].includes(
                  fm?.data?.form_type
                ) && (
                  <div className="col-span-2">
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      defaultValue={"item-1"}
                    >
                      <AccordionItem value="item-1">
                        <AccordionTriggerCustom
                          className="flex flex-row items-center"
                          onRightLabel={() => {
                            return (
                              <div className="mx-2 flex flex-row gap-x-1"></div>
                            );
                          }}
                        >
                          Detail Question
                        </AccordionTriggerCustom>
                        <AccordionContent>
                          <div className="grid grid-cols-1">
                            {fm.data?.template_question?.length >= 1 &&
                              fm.data.template_question.map(
                                (e: any, idx: number) => {
                                  const fm_row = cloneFM(fm, e);
                                  return (
                                    <div
                                      className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8"
                                      key={`question_${idx}`}
                                    >
                                      <div>
                                        <Field
                                          fm={cloneFM(fm, e)}
                                          name={"name"}
                                          label={"Question"}
                                          type={"text"}
                                        />
                                      </div>
                                      <div className="flex flex-row w-full gap-x-1">
                                        <div className="flex-grow flex flex-col">
                                          <Field
                                            fm={cloneFM(fm, e)}
                                            name={"answer_type_name"}
                                            label={"Answer Type"}
                                            type={"text"}
                                          />
                                        </div>
                                      </div>
                                      {[
                                        "multiple choice",
                                        "checkbox",
                                        "dropdown",
                                      ].includes(
                                        typeof fm_row?.data
                                          ?.answer_type_name === "string"
                                          ? fm_row?.data?.answer_type_name.toLowerCase()
                                          : null
                                      ) && (
                                        <div>
                                          <Field
                                            fm={cloneFM(fm, e)}
                                            name={"question_options"}
                                            label={"Option"}
                                            type={"tag"}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Detail Document */}
                {false &&
                  ["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
                    fm?.data?.form_type
                  ) && (
                    <div className="col-span-2">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Detail Document</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                              <div>
                                <Field
                                  fm={fm}
                                  name={"title_document"}
                                  label={"Title Document"}
                                  type={"text"}
                                />
                              </div>
                              <div>
                                <Field
                                  fm={fm}
                                  name={"id_document_type"}
                                  label={"Document Type"}
                                  type={"text"}
                                />
                              </div>
                              <div>
                                <Field
                                  fm={fm}
                                  name={"id_recruitment_type"}
                                  label={"Recruitment Type"}
                                  type={"text"}
                                />
                              </div>

                              <div className="col-span-2">
                                <Field
                                  fm={fm}
                                  name={"header"}
                                  label={"Header"}
                                  type={"richtext"}
                                />
                              </div>
                              <div className="col-span-2">
                                <Field
                                  fm={fm}
                                  name={"notes"}
                                  label={"Notes"}
                                  type={"richtext"}
                                />
                              </div>
                              <div className="col-span-2">
                                <Field
                                  fm={fm}
                                  name={"footer"}
                                  label={"Footer"}
                                  type={"richtext"}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
              </div>
            </div>
          </>
        );
      }}
      // onFooter={(fm: any) => {
      //   if (!fm?.data?.id) return <></>;
      //   return (
      //     <div
      //       className={cx(
      //         ["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
      //           fm?.data?.form_type
      //         )
      //           ? css`
      //               .tbl-search {
      //                 display: none !important;
      //                 padding-left: 2rem;
      //               }
      //             `
      //           : css`
      //               .tbl-search {
      //                 display: none !important;
      //               }
      //               .tbl-pagination {
      //                 display: none !important;
      //               }
      //             `
      //       )}
      //     >
      //       <div className="w-full flex flex-row">
      //         <div className="flex flex-grow flex-col h-[350px]">
      //           {["DOCUMENT_CHECKING"].includes(fm?.data?.form_type) && (
      //             <>
      //               <TableList
      //                 disabledHoverRow={true}
      //                 disabledPagination={true}
      //                 header={{
      //                   sideLeft: (tbl: any) => {
      //                     return <></>;
      //                   },
      //                   sideRight: (tbl: any) => {
      //                     return <> </>;
      //                   },
      //                 }}
      //                 column={[
      //                   {
      //                     name: "name",
      //                     header: () => <span>Document Name</span>,
      //                     renderCell: ({ row, name, cell, tbl }: any) => {
      //                       const fm_row = cloneFM(fm, row);
      //                       return (
      //                         <>
      //                           <Field
      //                             fm={cloneFM(fm, row)}
      //                             hidden_label={true}
      //                             name={"name"}
      //                             label={""}
      //                             type={"text"}
      //                           />
      //                         </>
      //                       );
      //                     },
      //                   },
      //                   {
      //                     name: "format",
      //                     header: () => <span>Format</span>,
      //                     width: 150,
      //                     renderCell: ({ row, name, cell }: any) => {
      //                       const fm_row = cloneFM(fm, row);
      //                       return (
      //                         <>
      //                           <Field
      //                             fm={cloneFM(fm, row)}
      //                             hidden_label={true}
      //                             name={"format"}
      //                             label={""}
      //                             type={"text"}
      //                             onLoad={async () => {
      //                               return [
      //                                 {
      //                                   label: "",
      //                                 },
      //                               ];
      //                             }}
      //                           />
      //                         </>
      //                       );
      //                     },
      //                   },
      //                   {
      //                     name: "action",
      //                     header: () => <span>Action</span>,
      //                     sortable: false,
      //                     renderCell: ({ row, name, cell, tbl }: any) => {
      //                       if (false) return <></>;
      //                       return (
      //                         <div className="flex items-center gap-x-0.5 whitespace-nowrap">
      //                           <ButtonBetter
      //                             className="bg-red-500"
      //                             onClick={() => {
      //                               const deleted_line_ids: any[] =
      //                                 Array.isArray(
      //                                   fm.data?.deleted_line_checking_ids
      //                                 )
      //                                   ? fm.data?.deleted_line_checking_ids
      //                                   : [];
      //                               if (row?.id) {
      //                                 deleted_line_ids.push(row.id);
      //                               }
      //                               fm.data["deleted_line_checking_ids"] =
      //                                 deleted_line_ids;
      //                               tbl.removeRow(row);
      //                               fm.data.document_line =
      //                                 fm.data.document_line.filter(
      //                                   (e: any) => e !== row
      //                                 );
      //                               fm.render();
      //                             }}
      //                           >
      //                             <div className="flex items-center">
      //                               <MdDelete />
      //                             </div>
      //                           </ButtonBetter>
      //                         </div>
      //                       );
      //                     },
      //                   },
      //                 ]}
      //                 onLoad={async (param: any) => {
      //                   return fm.data.document_checking || [];
      //                 }}
      //                 onInit={async (list: any) => {}}
      //               />
      //             </>
      //           )}
      //           {["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
      //             fm?.data?.form_type
      //           ) && (
      //             <>
      //               <TableList
      //                 name="period"
      //                 header={{
      //                   sideLeft: (data: any) => {
      //                     if (!local.can_add) return <></>;
      //                     return <></>;
      //                   },
      //                 }}
      //                 column={[
      //                   {
      //                     name: "title",
      //                     header: () => <span>Tittle Document</span>,
      //                     renderCell: ({ row, name, cell }: any) => {
      //                       return <>{getValue(row, name)}</>;
      //                     },
      //                   },
      //                   {
      //                     name: "document_type.name",
      //                     header: () => <span>Document Type</span>,
      //                     renderCell: ({ row, name, cell }: any) => {
      //                       return labelDocumentType(getValue(row, name));
      //                     },
      //                   },
      //                   {
      //                     name: "action",
      //                     header: () => <span>Action</span>,
      //                     sortable: false,
      //                     renderCell: ({ row, name, cell }: any) => {
      //                       return (
      //                         <div className="flex items-center gap-x-0.5 whitespace-nowrap">
      //                           <ButtonLink
      //                             href={`/d/master-data/question/${id}/setup/${row.id}/view`}
      //                           >
      //                             <div className="flex items-center gap-x-2">
      //                               <IoEye className="text-lg" />
      //                             </div>
      //                           </ButtonLink>
      //                         </div>
      //                       );
      //                     },
      //                   },
      //                 ]}
      //                 onLoad={async (param: any) => {
      //                   const params = await events("onload-param", param);
      //                   const result: any = await apix({
      //                     port: "recruitment",
      //                     value: "data.data.document_setups",
      //                     path: `/api/document-setup${params}`,
      //                     validate: "array",
      //                   });
      //                   return result;
      //                 }}
      //                 onCount={async () => {
      //                   const result: any = await apix({
      //                     port: "recruitment",
      //                     value: "data.data.total",
      //                     path: `/api/document-setup?page=1&page_size=1`,
      //                     validate: "object",
      //                   });
      //                   return getNumber(result);
      //                 }}
      //                 onInit={async (list: any) => {}}
      //               />
      //             </>
      //           )}
      //         </div>
      //       </div>
      //     </div>
      //   );
      // }}
    />
  );
}

export default Page;
