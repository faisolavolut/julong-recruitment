// // "use client";

// // import { Field } from "@/lib/components/form/Field";
// // import { FormBetter } from "@/lib/components/form/FormBetter";
// // import { TableList } from "@/lib/components/tablelist/TableList";
// // import {
// //   Accordion,
// //   AccordionContent,
// //   AccordionItem,
// //   AccordionTrigger,
// //   AccordionTriggerCustom,
// // } from "@/lib/components/ui/accordion";
// // import { Alert } from "@/lib/components/ui/alert";
// // import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
// // import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
// // import { ButtonLink } from "@/lib/components/ui/button-link";
// // import { actionToast } from "@/lib/utils/action";
// // import { apix } from "@/lib/utils/apix";
// // import { cloneFM } from "@/lib/utils/cloneFm";
// // import { labelDocumentType } from "@/lib/utils/document_type";
// // import { events } from "@/lib/utils/event";
// // import { getParams } from "@/lib/utils/get-params";
// // import { getNumber } from "@/lib/utils/getNumber";
// // import { getValue } from "@/lib/utils/getValue";
// // import { useLocal } from "@/lib/utils/use-local";
// // import get from "lodash.get";
// // import { notFound } from "next/navigation";
// // import { useEffect } from "react";
// // import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
// // import { IoMdSave } from "react-icons/io";
// // import { MdDelete } from "react-icons/md";
// // import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// // import { AiOutlineDrag } from "react-icons/ai";

// // function Page() {
// //   const id = getParams("id");
// //   const labelPage = "Template";
// //   const urlPage = "/d/master-data/question";
// //   const local = useLocal({
// //     can_add: false,
// //     can_edit: false,
// //     roles: null as any,
// //     ready: false as boolean,
// //   });
// //   const config = {
// //     document_checking: "document_checking",
// //     question: "template_question",
// //     document_setup: "document_setup",
// //   };
// //   useEffect(() => {
// //     const run = async () => {
// //       local.can_add = true;
// //       local.ready = true;
// //       local.render();
// //     };
// //     run();
// //   }, []);
// //   const handleDragEnd = (result: any, fm: any, name: any) => {
// //     if (!result.destination) return;

// //     const items = Array.from(fm.data?.[name]);
// //     console.log(items);
// //     const [reorderedItem] = items.splice(result.source.index, 1);
// //     items.splice(result.destination.index, 0, reorderedItem);
// //     fm.data[name] = items;
// //     fm.render();
// //     console.log(fm.data[name]);
// //   };
// //   if (local.ready && !local.can_add) return notFound();
// //   return (
// //     <FormBetter
// //       onTitle={(fm: any) => {
// //         return (
// //           <div className="flex flex-row w-full flex-wrap">
// //             <div className="flex flex-col py-4 pt-0 pb-0 flex-grow">
// //               <h2 className="text-xl font-semibold text-gray-900">
// //                 <span className="">{labelPage}</span>
// //               </h2>
// //               <BreadcrumbBetterLink
// //                 data={[
// //                   {
// //                     title: `List ${labelPage}`,
// //                     url: urlPage,
// //                   },
// //                   {
// //                     title: "Edit",
// //                   },
// //                 ]}
// //               />
// //             </div>
// //             <div className="flex flex-row space-x-2 items-center">
// //               <Alert
// //                 type={"delete"}
// //                 msg={"Are you sure you want to save this record?"}
// //                 onClick={() => {
// //                   fm.submit();
// //                 }}
// //               >
// //                 <ButtonContainer className={"bg-primary"}>
// //                   <IoMdSave className="text-xl" />
// //                   Save
// //                 </ButtonContainer>
// //               </Alert>

// //               <Alert
// //                 type={"delete"}
// //                 msg={"Are you sure you want to delete this record?"}
// //                 onClick={async () => {
// //                   await actionToast({
// //                     task: async () => {
// //                       await apix({
// //                         port: "recruitment",
// //                         value: "data.data",
// //                         path: "/api/template-questions/" + id,
// //                         method: "delete",
// //                       });
// //                     },
// //                     after: () => {
// //                       navigate("/d/master-data/question");
// //                     },
// //                     msg_load: "Delete ",
// //                     msg_error: "Delete failed ",
// //                     msg_succes: "Delete success ",
// //                   });
// //                 }}
// //               >
// //                 <ButtonContainer variant={"destructive"}>
// //                   <MdDelete className="text-xl" />
// //                   Delete
// //                 </ButtonContainer>
// //               </Alert>
// //             </div>
// //           </div>
// //         );
// //       }}
// //       onSubmit={async (fm: any) => {
// //         const res = await apix({
// //           port: "recruitment",
// //           value: "data.data",
// //           path: "/api/template-questions/update",
// //           method: "put",
// //           data: {
// //             id: fm.data?.id,
// //             document_setup_id: fm.data?.document_setup_id,
// //             name: fm.data?.name,
// //             duration: fm.data?.duration,
// //             description: fm.data?.description, // optional
// //             status: fm.data?.status === "ACTIVE" ? fm.data?.status : "INACTIVE",
// //             form_type: fm.data?.form_type,
// //           },
// //         });
// //       }}
// //       onLoad={async () => {
// //         const data: any = await apix({
// //           port: "recruitment",
// //           value: "data.data",
// //           path: "/api/template-questions/" + id,
// //           validate: "object",
// //         });
// //         const res: any = await apix({
// //           port: "recruitment",
// //           value: "data.data",
// //           path: "/api/answer-types",
// //           validate: "array",
// //         });
// //         const result = res.map((e: any) => {
// //           return {
// //             value: e.id,
// //             label: `${e.name}`,
// //           };
// //         });
// //         const question = data?.questions?.length
// //           ? data.questions.map((e: any) => {
// //               return {
// //                 ...e,
// //                 answer_type_name: e?.answer_types?.name,
// //                 question_options: e?.question_options?.length
// //                   ? e.question_options.map((e: any) => e.option_text)
// //                   : [],
// //                 keys: e?.id,
// //               };
// //             })
// //           : [];
// //         return {
// //           id,
// //           ...data,
// //           document_checking: [],
// //           list_answer_type: result,
// //           template_question: question || [],
// //         };
// //       }}
// //       showResize={false}
// //       header={(fm: any) => {
// //         return <></>;
// //       }}
// //       children={(fm: any) => {
// //         return (
// //           <>
// //             <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
// //               <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
// //                 <div>
// //                   <Field
// //                     fm={fm}
// //                     name={"name"}
// //                     label={"Template"}
// //                     type={"text"}
// //                   />
// //                 </div>
// //                 <div>
// //                   <Field
// //                     fm={fm}
// //                     name={"form_type"}
// //                     label={"Document Type"}
// //                     type={"dropdown"}
// //                     onLoad={async () => {
// //                       const res: any = await apix({
// //                         port: "recruitment",
// //                         value: "data.data",
// //                         path: "/api/template-questions/form-types",
// //                         validate: "dropdown",
// //                         keys: {
// //                           value: "value",
// //                           label: (item: any) => {
// //                             switch (get(item, "value")) {
// //                               case "ADMINISTRATIVE_SELECTION":
// //                                 return "Administrative";
// //                                 break;
// //                               case "TEST":
// //                                 return "Test";
// //                                 break;

// //                               case "INTERVIEW":
// //                                 return "Interview";
// //                                 break;

// //                               case "SURAT_PENGANTAR_MASUK":
// //                                 return "Surat Pengantar Masuk";
// //                                 break;
// //                               case "SURAT_IZIN_ORANG_TUA":
// //                                 return "Surat Izin Orang Tua";
// //                                 break;
// //                               case "FGD":
// //                                 return "FGD";
// //                                 break;

// //                               case "FINAL_INTERVIEW":
// //                                 return "Final Interview";
// //                                 break;

// //                               case "OFFERING_LETTER":
// //                                 return "Offering Letter";
// //                                 break;

// //                               case "CONTRACT_DOCUMENT":
// //                                 return "Contract Document";
// //                                 break;

// //                               case "DOCUMENT_CHECKING":
// //                                 return "Document Checking";
// //                                 break;

// //                               default:
// //                                 return get(item, "value");
// //                             }
// //                           },
// //                         },
// //                       });
// //                       return res;
// //                     }}
// //                   />
// //                 </div>
// //                 {["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
// //                   fm?.data?.form_type
// //                 ) && (
// //                   <div>
// //                     <Field
// //                       fm={fm}
// //                       name={"document_setup_id"}
// //                       label={"Document Tittle - Recruitment Type"}
// //                       type={"dropdown"}
// //                       onLoad={async () => {
// //                         const res: any = await apix({
// //                           port: "recruitment",
// //                           value: "data.data.document_setups",
// //                           path: "/api/document-setup",
// //                           validate: "dropdown",
// //                           keys: {
// //                             label: (item: any) => {
// //                               return get(item, "title");
// //                             },
// //                           },
// //                         });
// //                         return res;
// //                       }}
// //                     />
// //                   </div>
// //                 )}
// //                 <div>
// //                   <Field
// //                     fm={fm}
// //                     name={"description"}
// //                     label={"Description"}
// //                     type={"textarea"}
// //                   />
// //                 </div>
// //                 <div>
// //                   <Field
// //                     fm={fm}
// //                     name={"status"}
// //                     hidden_label={true}
// //                     label={""}
// //                     type={"single-checkbox"}
// //                     onLoad={() => {
// //                       return [
// //                         {
// //                           label: "Active",
// //                           value: "ACTIVE",
// //                         },
// //                       ];
// //                     }}
// //                   />
// //                 </div>
// //                 <div>
// //                   {["TEST", "INTERVIEW", "FGD", "FINAL_INTERVIEW"].includes(
// //                     fm?.data?.form_type
// //                   ) && (
// //                     <Field
// //                       fm={fm}
// //                       name={"duration"}
// //                       label={"Duration (minute)"}
// //                       type={"money"}
// //                       suffix={
// //                         <div className="text-md flex flex-row items-center font-bold">
// //                           minute
// //                         </div>
// //                       }
// //                     />
// //                   )}
// //                 </div>
// //                 {/* Detail Question */}
// //                 {["TEST", "INTERVIEW", "FGD", "FINAL_INTERVIEW"].includes(
// //                   fm?.data?.form_type
// //                 ) && (
// //                   <div className="md:col-span-2">
// //                     <Accordion
// //                       type="single"
// //                       collapsible
// //                       className="w-full"
// //                       defaultValue={"item-1"}
// //                     >
// //                       <AccordionItem value="item-1">
// //                         <AccordionTriggerCustom
// //                           className="flex flex-row items-center"
// //                           onRightLabel={() => {
// //                             return (
// //                               <div className="mx-2 flex flex-row gap-x-1">
// //                                 <ButtonBetter
// //                                   onClick={(event) => {
// //                                     event.preventDefault();
// //                                     event.stopPropagation();
// //                                     const data =
// //                                       fm?.data?.template_question || [];
// //                                     const findShortAnswer = fm.data
// //                                       ?.list_answer_type?.length
// //                                       ? fm.data?.list_answer_type.find(
// //                                           (e: any) =>
// //                                             e.label.toLowerCase() === "text"
// //                                         )
// //                                       : null;
// //                                     data.push({
// //                                       answer_type_id: findShortAnswer?.value,
// //                                       answer_type_name: findShortAnswer?.label,
// //                                       keys: uuid(),
// //                                     });
// //                                     console.log({ data });
// //                                     fm.data.template_question = data;
// //                                     fm.render();
// //                                   }}
// //                                 >
// //                                   <svg
// //                                     xmlns="http://www.w3.org/2000/svg"
// //                                     width={25}
// //                                     height={25}
// //                                     viewBox="0 0 24 24"
// //                                   >
// //                                     <path
// //                                       fill="none"
// //                                       stroke="currentColor"
// //                                       strokeLinecap="round"
// //                                       strokeLinejoin="round"
// //                                       strokeMiterlimit={10}
// //                                       strokeWidth={1.5}
// //                                       d="M6 12h12m-6 6V6"
// //                                     ></path>
// //                                   </svg>
// //                                   Add Question
// //                                 </ButtonBetter>
// //                                 <ButtonBetter
// //                                   onClick={async (event) => {
// //                                     event.preventDefault();
// //                                     event.stopPropagation();
// //                                     const data = fm.data?.template_question;
// //                                     const question = data.map((e: any) => {
// //                                       let res = {
// //                                         question_options: e.question_options
// //                                           ?.length
// //                                           ? e.question_options.map(
// //                                               (e: any, idx: number) => {
// //                                                 let ids: any = {};
// //                                                 if (e?.id) {
// //                                                   ids = {
// //                                                     ...ids,
// //                                                     id: e.id,
// //                                                   };
// //                                                 }
// //                                                 return {
// //                                                   ...ids,
// //                                                   option_text: e,
// //                                                 };
// //                                               }
// //                                             )
// //                                           : [],
// //                                       } as any;
// //                                       if (e?.id) {
// //                                         res = {
// //                                           ...res,
// //                                           id: e.id,
// //                                         };
// //                                       }
// //                                       console.log(
// //                                         { res },
// //                                         ![
// //                                           "multiple choice",
// //                                           "checkbox",
// //                                           "dropdown",
// //                                         ].includes(
// //                                           typeof e?.answer_type_name ===
// //                                             "string"
// //                                             ? e?.answer_type_name.toLowerCase()
// //                                             : null
// //                                         )
// //                                       );
// //                                       if (
// //                                         ![
// //                                           "multiple choice",
// //                                           "checkbox",
// //                                           "dropdown",
// //                                         ].includes(
// //                                           typeof e?.answer_type_name ===
// //                                             "string"
// //                                             ? e?.answer_type_name.toLowerCase()
// //                                             : null
// //                                         )
// //                                       ) {
// //                                         try {
// //                                           delete res["question_options"];
// //                                         } catch (ex) {}
// //                                       }
// //                                       return {
// //                                         ...res,
// //                                         answer_type_id: e?.answer_type_id,
// //                                         name: e.name,
// //                                       };
// //                                     });
// //                                     // let result =
// //                                     await actionToast({
// //                                       task: async () => {
// //                                         let result = await apix({
// //                                           port: "recruitment",
// //                                           value: "data.data",
// //                                           path: "/api/questions",
// //                                           method: "post",
// //                                           data: {
// //                                             template_question_id: id,
// //                                             questions: question,
// //                                             deleted_question_ids:
// //                                               get(
// //                                                 fm,
// //                                                 "data.deleted_question_ids"
// //                                               ) || [],
// //                                           },
// //                                         });
// //                                       },
// //                                       after: () => {},
// //                                       msg_load: "Saving ",
// //                                       msg_error: "Saving failed ",
// //                                       msg_succes: "Saving success ",
// //                                     });
// //                                     console.log(question);
// //                                   }}
// //                                 >
// //                                   <svg
// //                                     xmlns="http://www.w3.org/2000/svg"
// //                                     width={25}
// //                                     height={25}
// //                                     viewBox="0 0 24 24"
// //                                   >
// //                                     <path
// //                                       fill="none"
// //                                       stroke="currentColor"
// //                                       strokeLinecap="round"
// //                                       strokeLinejoin="round"
// //                                       strokeWidth={1.5}
// //                                       d="M7.558 3.75H7.25a3.5 3.5 0 0 0-3.5 3.5v9.827a3.173 3.173 0 0 0 3.173 3.173v0m.635-16.5v2.442a2 2 0 0 0 2 2h2.346a2 2 0 0 0 2-2V3.75m-6.346 0h6.346m0 0h.026a3 3 0 0 1 2.122.879l3.173 3.173a3.5 3.5 0 0 1 1.025 2.475v6.8a3.173 3.173 0 0 1-3.173 3.173v0m-10.154 0V15a3 3 0 0 1 3-3h4.154a3 3 0 0 1 3 3v5.25m-10.154 0h10.154"
// //                                     ></path>
// //                                   </svg>
// //                                   Save
// //                                 </ButtonBetter>
// //                               </div>
// //                             );
// //                           }}
// //                         >
// //                           Detail Question
// //                         </AccordionTriggerCustom>
// //                         <AccordionContent>
// //                           <div className="grid grid-cols-1">
// //                             <DragDropContext
// //                               onDragEnd={(result) =>
// //                                 handleDragEnd(result, fm, "template_question")
// //                               }
// //                             >
// //                               <Droppable
// //                                 droppableId="questions"
// //                                 isDropDisabled={false}
// //                                 isCombineEnabled={false}
// //                                 ignoreContainerClipping={false}
// //                               >
// //                                 {(provided) => (
// //                                   <div
// //                                     {...provided.droppableProps}
// //                                     ref={provided.innerRef}
// //                                     className="space-y-4"
// //                                   >
// //                                     {fm.data?.template_question?.length >= 1 &&
// //                                       fm.data.template_question.map(
// //                                         (e: any, idx: number) => {
// //                                           const fm_row = cloneFM(fm, e);
// //                                           console.log(`question_${e?.keys}`);
// //                                           return (
// //                                             <Draggable
// //                                               key={e?.keys}
// //                                               draggableId={e?.keys}
// //                                               index={idx}
// //                                             >
// //                                               {(provided) => (
// //                                                 <div
// //                                                   ref={provided.innerRef} // Pastikan innerRef diterapkan di sini
// //                                                   {...provided.draggableProps}
// //                                                   {...provided.dragHandleProps}
// //                                                   className="p-4 border rounded-md bg-white shadow"
// //                                                 >
// //                                                   <div className="flex items-center gap-4">
// //                                                     <span
// //                                                       // Ikon drag untuk menggeser
// //                                                       className="cursor-grab text-gray-400"
// //                                                     >
// //                                                       <AiOutlineDrag
// //                                                         size={20}
// //                                                       />
// //                                                     </span>
// //                                                     <div className="w-full">
// //                                                       <Field
// //                                                         fm={fm_row}
// //                                                         name={"name"}
// //                                                         label={"Question"}
// //                                                         type={"text"}
// //                                                       />
// //                                                     </div>
// //                                                   </div>
// //                                                   <div className="flex flex-row w-full gap-x-1 mt-4">
// //                                                     <div className="flex-grow flex flex-col">
// //                                                       <Field
// //                                                         fm={fm_row}
// //                                                         name={"answer_type_id"}
// //                                                         label={"Answer Type"}
// //                                                         type={"dropdown"}
// //                                                         onChange={(
// //                                                           item: any
// //                                                         ) => {
// //                                                           fm_row.data.answer_type_name =
// //                                                             item?.label;
// //                                                           fm.render();
// //                                                         }}
// //                                                         onLoad={async () => {
// //                                                           return (
// //                                                             fm.data
// //                                                               ?.list_answer_type ||
// //                                                             []
// //                                                           );
// //                                                         }}
// //                                                       />
// //                                                     </div>
// //                                                     <div className="">
// //                                                       <ButtonBetter
// //                                                         className="mt-7"
// //                                                         variant="destructive"
// //                                                         onClick={(event) => {
// //                                                           event.preventDefault();
// //                                                           event.stopPropagation();
// //                                                           const data: any[] =
// //                                                             fm?.data
// //                                                               ?.template_question ||
// //                                                             [];
// //                                                           fm.data.template_question =
// //                                                             data.filter(
// //                                                               (_, i) =>
// //                                                                 i !== idx
// //                                                             );
// //                                                           const delete_id =
// //                                                             fm.data
// //                                                               .deleted_question_ids ||
// //                                                             [];
// //                                                           if (e?.id) {
// //                                                             delete_id.push(
// //                                                               e?.id
// //                                                             );
// //                                                             fm.data.deleted_question_ids =
// //                                                               delete_id;
// //                                                           }
// //                                                           fm.render();
// //                                                         }}
// //                                                       >
// //                                                         {/* Ikon delete */}
// //                                                         <svg
// //                                                           xmlns="http://www.w3.org/2000/svg"
// //                                                           width={25}
// //                                                           height={25}
// //                                                           viewBox="0 0 24 24"
// //                                                         >
// //                                                           <path
// //                                                             fill="currentColor"
// //                                                             d="M20 5a1 1 0 1 1 0 2h-1l-.003.071l-.933 13.071A2 2 0 0 1 16.069 22H7.93a2 2 0 0 1-1.995-1.858l-.933-13.07L5 7H4a1 1 0 0 1 0-2zm-3.003 2H7.003l.928 13h8.138zM14 2a1 1 0 1 1 0 2h-4a1 1 0 0 1 0-2z"
// //                                                           ></path>
// //                                                         </svg>
// //                                                       </ButtonBetter>
// //                                                     </div>
// //                                                   </div>
// //                                                   {[
// //                                                     "multiple choice",
// //                                                     "checkbox",
// //                                                     "dropdown",
// //                                                   ].includes(
// //                                                     fm_row?.data?.answer_type_name?.toLowerCase()
// //                                                   ) && (
// //                                                     <div>
// //                                                       <Field
// //                                                         fm={fm_row}
// //                                                         name={
// //                                                           "question_options"
// //                                                         }
// //                                                         label={"Option"}
// //                                                         type={"tag"}
// //                                                       />
// //                                                     </div>
// //                                                   )}
// //                                                 </div>
// //                                               )}
// //                                             </Draggable>
// //                                           );
// //                                         }
// //                                       )}
// //                                     {provided.placeholder}
// //                                   </div>
// //                                 )}
// //                               </Droppable>
// //                             </DragDropContext>
// //                           </div>
// //                         </AccordionContent>
// //                       </AccordionItem>
// //                     </Accordion>
// //                   </div>
// //                 )}

// //                 {/* Detail Document */}
// //                 {false &&
// //                   ["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
// //                     fm?.data?.form_type
// //                   ) && (
// //                     <div className="md:col-span-2">
// //                       <Accordion type="single" collapsible className="w-full">
// //                         <AccordionItem value="item-1">
// //                           <AccordionTrigger>Detail Document</AccordionTrigger>
// //                           <AccordionContent>
// //                             <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
// //                               <div>
// //                                 <Field
// //                                   fm={fm}
// //                                   name={"title_document"}
// //                                   label={"Title Document"}
// //                                   type={"text"}
// //                                 />
// //                               </div>
// //                               <div>
// //                                 <Field
// //                                   fm={fm}
// //                                   name={"id_document_type"}
// //                                   label={"Document Type"}
// //                                   type={"text"}
// //                                 />
// //                               </div>
// //                               <div>
// //                                 <Field
// //                                   fm={fm}
// //                                   name={"id_recruitment_type"}
// //                                   label={"Recruitment Type"}
// //                                   type={"text"}
// //                                 />
// //                               </div>

// //                               <div className="md:col-span-2">
// //                                 <Field
// //                                   fm={fm}
// //                                   name={"header"}
// //                                   label={"Header"}
// //                                   type={"richtext"}
// //                                 />
// //                               </div>
// //                               <div className="md:col-span-2">
// //                                 <Field
// //                                   fm={fm}
// //                                   name={"notes"}
// //                                   label={"Notes"}
// //                                   type={"richtext"}
// //                                 />
// //                               </div>
// //                               <div className="md:col-span-2">
// //                                 <Field
// //                                   fm={fm}
// //                                   name={"footer"}
// //                                   label={"Footer"}
// //                                   type={"richtext"}
// //                                 />
// //                               </div>
// //                             </div>
// //                           </AccordionContent>
// //                         </AccordionItem>
// //                       </Accordion>
// //                     </div>
// //                   )}
// //               </div>
// //             </div>
// //           </>
// //         );
// //       }}
// //       // onFooter={(fm: any) => {
// //       //   if (!fm?.data?.id) return <></>;
// //       //   return (
// //       //     <div
// //       //       className={cx(
// //       //         ["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
// //       //           fm?.data?.form_type
// //       //         )
// //       //           ? css`
// //       //               .tbl-search {
// //       //                 display: none !important;
// //       //                 padding-left: 2rem;
// //       //               }
// //       //             `
// //       //           : css`
// //       //               .tbl-search {
// //       //                 display: none !important;
// //       //               }
// //       //               .tbl-pagination {
// //       //                 display: none !important;
// //       //               }
// //       //             `
// //       //       )}
// //       //     >
// //       //       <div className="w-full flex flex-row">
// //       //         <div className="flex flex-grow flex-col h-[350px]">
// //       //           {["DOCUMENT_CHECKING"].includes(fm?.data?.form_type) && (
// //       //             <>
// //       //               <TableList
// //       //                 disabledHoverRow={true}
// //       //                 disabledPagination={true}
// //       //                 header={{
// //       //                   sideLeft: (tbl: any) => {
// //       //                     if (true)
// //       //                       return (
// //       //                         <>
// //       //                           <div className="flex flex-row gap-x-2 items-center">
// //       //                             <div className="flex flex-row flex-grow space-x-2">
// //       //                               <ButtonBetter
// //       //                                 className="bg-primary"
// //       //                                 onClick={() => {
// //       //                                   tbl.addRow({});
// //       //                                   tbl.render();
// //       //                                   fm.render();
// //       //                                 }}
// //       //                               >
// //       //                                 <div className="flex items-center gap-x-0.5">
// //       //                                   <HiPlus className="text-md" />
// //       //                                   <span className="capitalize">
// //       //                                     Add New
// //       //                                   </span>
// //       //                                 </div>
// //       //                               </ButtonBetter>
// //       //                             </div>
// //       //                           </div>
// //       //                         </>
// //       //                       );
// //       //                     return <></>;
// //       //                   },
// //       //                   sideRight: (tbl: any) => {
// //       //                     return (
// //       //                       <>
// //       //                         <div className="flex flex-row gap-x-2 items-center">
// //       //                           <div className="flex flex-row flex-grow space-x-2">
// //       //                             <ButtonBetter
// //       //                               onClick={async (event) => {
// //       //                                 event.preventDefault();
// //       //                                 event.stopPropagation();
// //       //                                 const data = fm.data?.document_checking;
// //       //                                 await actionToast({
// //       //                                   task: async () => {
// //       //                                     let result = await apix({
// //       //                                       port: "recruitment",
// //       //                                       value: "data.data",
// //       //                                       path: "/api/questions",
// //       //                                       method: "post",
// //       //                                       data: {
// //       //                                         template_question_id: id,
// //       //                                         data: data,
// //       //                                         deleted_question_ids:
// //       //                                           get(
// //       //                                             fm,
// //       //                                             "data.deleted_line_checking_ids"
// //       //                                           ) || [],
// //       //                                       },
// //       //                                     });
// //       //                                   },
// //       //                                   after: () => {},
// //       //                                   msg_load: "Saving ",
// //       //                                   msg_error: "Saving failed ",
// //       //                                   msg_succes: "Saving success ",
// //       //                                 });
// //       //                               }}
// //       //                             >
// //       //                               <svg
// //       //                                 xmlns="http://www.w3.org/2000/svg"
// //       //                                 width={25}
// //       //                                 height={25}
// //       //                                 viewBox="0 0 24 24"
// //       //                               >
// //       //                                 <path
// //       //                                   fill="none"
// //       //                                   stroke="currentColor"
// //       //                                   strokeLinecap="round"
// //       //                                   strokeLinejoin="round"
// //       //                                   strokeWidth={1.5}
// //       //                                   d="M7.558 3.75H7.25a3.5 3.5 0 0 0-3.5 3.5v9.827a3.173 3.173 0 0 0 3.173 3.173v0m.635-16.5v2.442a2 2 0 0 0 2 2h2.346a2 2 0 0 0 2-2V3.75m-6.346 0h6.346m0 0h.026a3 3 0 0 1 2.122.879l3.173 3.173a3.5 3.5 0 0 1 1.025 2.475v6.8a3.173 3.173 0 0 1-3.173 3.173v0m-10.154 0V15a3 3 0 0 1 3-3h4.154a3 3 0 0 1 3 3v5.25m-10.154 0h10.154"
// //       //                                 ></path>
// //       //                               </svg>
// //       //                               Save
// //       //                             </ButtonBetter>
// //       //                           </div>
// //       //                         </div>
// //       //                       </>
// //       //                     );
// //       //                   },
// //       //                 }}
// //       //                 column={[
// //       //                   {
// //       //                     name: "name",
// //       //                     header: "Document Name",
// //       //                     renderCell: ({ row, name, cell, tbl }: any) => {
// //       //                       const fm_row = cloneFM(fm, row);
// //       //                       return (
// //       //                         <>
// //       //                           <Field
// //       //                             fm={cloneFM(fm, row)}
// //       //                             hidden_label={true}
// //       //                             name={"name"}
// //       //                             label={""}
// //       //                             type={"text"}
// //       //                           />
// //       //                         </>
// //       //                       );
// //       //                     },
// //       //                   },
// //       //                   {
// //       //                     name: "format",
// //       //                     header: "Format",
// //       //                     width: 150,
// //       //                     renderCell: ({ row, name, cell }: any) => {
// //       //                       const fm_row = cloneFM(fm, row);
// //       //                       return (
// //       //                         <>
// //       //                           <Field
// //       //                             fm={cloneFM(fm, row)}
// //       //                             hidden_label={true}
// //       //                             name={"format"}
// //       //                             label={""}
// //       //                             type={"text"}
// //       //                             onLoad={async () => {
// //       //                               return [
// //       //                                 {
// //       //                                   label: "",
// //       //                                 },
// //       //                               ];
// //       //                             }}
// //       //                           />
// //       //                         </>
// //       //                       );
// //       //                     },
// //       //                   },
// //       //                   {
// //       //                     name: "action",
// //       //
//                     header: "Action",
//                     filter: false,
// //       //                     sortable: false,
// //       //                     renderCell: ({ row, name, cell, tbl }: any) => {
// //       //                       if (false) return <></>;
// //       //                       return (
// //       //                         <div className="flex items-center gap-x-0.5 whitespace-nowrap">
// //       //                           <ButtonBetter
// //       //                             className="bg-red-500"
// //       //                             onClick={() => {
// //       //                               const deleted_line_ids: any[] =
// //       //                                 Array.isArray(
// //       //                                   fm.data?.deleted_line_checking_ids
// //       //                                 )
// //       //                                   ? fm.data?.deleted_line_checking_ids
// //       //                                   : [];
// //       //                               if (row?.id) {
// //       //                                 deleted_line_ids.push(row.id);
// //       //                               }
// //       //                               fm.data["deleted_line_checking_ids"] =
// //       //                                 deleted_line_ids;
// //       //                               tbl.removeRow(row);
// //       //                               fm.data.document_line =
// //       //                                 fm.data.document_line.filter(
// //       //                                   (e: any) => e !== row
// //       //                                 );
// //       //                               fm.render();
// //       //                             }}
// //       //                           >
// //       //                             <div className="flex items-center">
// //       //                               <MdDelete />
// //       //                             </div>
// //       //                           </ButtonBetter>
// //       //                         </div>
// //       //                       );
// //       //                     },
// //       //                   },
// //       //                 ]}
// //       //                 onLoad={async (param: any) => {
// //       //                   return fm.data.document_checking || [];
// //       //                 }}
// //       //                 onInit={async (list: any) => {}}
// //       //               />
// //       //             </>
// //       //           )}
// //       //         </div>
// //       //       </div>
// //       //     </div>
// //       //   );
// //       // }}
// //     />
// //   );
// // }

// // export default Page;
