"use client";
import { getParams } from "@/lib/utils/get-params";

import { ButtonBetter } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";

import FlowbiteFooterSection from "@/app/components/flowbite-footer";
import DefaultHeaderNavigation from "@/app/components/navbarHeader";
import { siteurl } from "@/lib/utils/siteurl";
import get from "lodash.get";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { getNumber } from "@/lib/utils/getNumber";
import { actionToast } from "@/lib/utils/action";
import Stepper from "@/app/components/Stepper";
import { LuPartyPopper } from "react-icons/lu";
import { Field } from "@/lib/components/form/Field";
import { Form } from "@/lib/components/form/Form";
import { notFound } from "next/navigation";
import { labelDocumentType } from "@/lib/utils/document_type";
import { dayDate } from "@/lib/utils/date";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { GoClock } from "react-icons/go";
import { IoLinkOutline } from "react-icons/io5";
import { scheduleFase } from "./schedule";
import { cloneFM } from "@/lib/utils/cloneFm";
import { MdOutlineLocationOn } from "react-icons/md";
import { ButtonLink } from "@/lib/components/ui/button-link";
import ImageBetter from "@/lib/components/ui/Image";
import { getValue } from "@/lib/utils/getValue";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const local = useLocal({
    open: false,
    ready: false,
    access: true,
    jobs: [] as any[],
    data: null as any,
    applied: false,
    profile: {} as any,
    line: [] as any,
    steps: [] as any[],
    step: 0,
    stepName: null as any,
    detail: null as any,
    readyTest: false,
  });

  useEffect(() => {
    const run = async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/job-postings/${id}`,
        validate: "object",
      });
      const id_project = data?.project_recruitment_header_id;
      const res: any = await apix({
        port: "recruitment",
        value: "data.data",
        validate: "array",
        path: "/api/project-recruitment-lines/header/" + id_project,
      });

      let now = 0 as number;
      let applicant = null;
      try {
        const profile: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/applicants/me/${id}`,
          validate: "object",
        });
        applicant = profile;
        local.step = profile?.order <= 1 ? 1 : profile?.order;
        local.profile = profile;
        now = profile?.order;
      } catch (ex) {
        local.profile = null;
      }
      local.render();
      let steps = res.map((e: any) => {
        const order = applicant?.order <= 1 ? 1 : applicant?.order;
        return {
          id: e?.order,
          label: labelDocumentType(e?.template_activity_line?.name),
          name: e?.template_activity_line?.template_question?.form_type,
          id_line: e?.id,
          result:
            order === e?.order
              ? applicant?.status === "REJECTED"
                ? "failed"
                : null
              : null,
        };
      });
      steps = steps?.sort((a: any, b: any) => a?.id - b?.id);
      const stepNumber = steps?.length ? steps?.map((e: any) => e?.id) : [];
      const max = Math.max(...stepNumber);
      const stepNow = steps.find((e: any) =>
        now >= max ? e?.id === max : e?.id === now
      );
      const stepName = stepNow?.name;
      // console.log(stepName);
      const test = await scheduleFase({
        step: stepName,
        data: {
          id: id,
          id_line: stepNow?.id_line,
          applicant,
        },
      });
      console.log({ test });
      if (stepName === "FINAL_RESULT") {
        local.step = stepNow?.id + 1;
      }
      if (!test) {
        local.readyTest = false;
      } else {
        local.readyTest = true;
        local.detail = test;
      }
      local.stepName = applicant?.status === "REJECTED" ? "REJECTED" : stepName;
      local.steps = steps;
      local.data = data;
      local.applied = data?.is_applied;
      local.ready = true;
      local.render();
    };
    run();
  }, []);
  if (!local.profile) notFound();
  return (
    <div className="flex flex-col max-w-screen bg-white min-h-screen">
      <DefaultHeaderNavigation />
      <div className="relative flex flex-col flex-grow">
        {local.ready ? (
          <div className="flex flex-col justify-center items-center">
            <div className="flex-grow flex w-full flex-col max-w-screen-xl">
              <div className="flex-grow flex flex-col ">
                <div
                  className={cx(
                    "bg-gradient-to-r from-blue-500 to-blue-700 p-6 gap-y-2 md:gap-y-0 flex items-center flex-col md:flex-row shadow-lg bg-no-repeat bg-cover	bg-center	",
                    css`
                      background-image: url("${siteurl("/frame.jpg")}");
                    `
                  )}
                >
                  <div className="flex flex-col gap-y-1 md:px-10 gap-x-4 w-full md:w-auto">
                    <div className="w-16 h-16">
                      <ImageBetter
                        src={siteurl(get(local, "data.organization_logo"))}
                        alt="Logo Company"
                        className="rounded-full w-full h-full object-cover border-2 border-white"
                        defaultSrc={siteurl("/404-img.jpg")}
                      />
                    </div>
                    <div className="text-black">
                      <p className="flex items-center font-bold text-3xl	 flex-row gap-x-2">
                        {get(local, "data.name") || get(local, "data.job_name")}
                      </p>
                      <div className="h-0.5 w-full bg-black rounded-full"></div>
                      <p className="text-sm flex items-center flex-row gap-x-2">
                        {get(local, "data.for_organization_name")}
                      </p>
                    </div>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex flex-col gap-x-4 gap-y-2  w-full md:w-auto md:min-w-[350px] ">
                    <div className="flex flex-row w-full flex-wrap">
                      <div className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-md max-w-md mx-auto">
                        <div className="hidden">
                          <h3 className="text-sm font-medium text-gray-500">
                            Salary (Rupiah)
                          </h3>
                          <p className="text-lg font-semibold text-green-600">
                            Rp
                            {formatMoney(
                              getNumber(get(local, "data.salary_min"))
                            )}{" "}
                            - Rp
                            {formatMoney(
                              getNumber(get(local, "data.salary_max"))
                            )}
                          </p>
                          <p className="text-xs text-gray-400">
                            Monthly salary
                          </p>
                        </div>
                        <div className="border-l border-gray-300 h-full mx-4 hidden"></div>
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={25}
                              height={25}
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="m15 19.923l-6-2.1l-3.958 1.53q-.384.143-.713-.083T4 18.634V6.404q0-.268.13-.489t.378-.307L9 4.077l6 2.1l3.958-1.53q.384-.143.713.054t.329.588v12.384q0 .287-.159.498q-.158.212-.426.298zm-.5-1.22v-11.7l-5-1.745v11.7zm1 0L19 17.55V5.7l-3.5 1.304zM5 18.3l3.5-1.342v-11.7L5 6.45zM15.5 7.004v11.7zm-7-1.746v11.7z"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-500 mt-1">
                            Job Location
                          </h3>
                          <p className="text-lg font-semibold text-gray-800">
                            {get(local, "data.for_organization_location")}
                          </p>
                        </div>
                      </div>
                    </div>
                    {local.applied ? (
                      <ButtonLink
                        className="w-full bg-second text-black hover:bg-second cursor-pointer	"
                        href={`/job-posting/${id}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19 6.5h-3v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3m-9-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm10 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.05h3v1.05a1 1 0 0 0 2 0v-1.05h6v1.05a1 1 0 0 0 2 0v-1.05h3Zm0-7H4v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"
                          ></path>
                        </svg>
                        View Detail
                      </ButtonLink>
                    ) : (
                      <ButtonBetter
                        className="w-full   bg-gradient-to-r from-blue-100 to-blue-50 "
                        onClick={async () => {
                          await actionToast({
                            task: async () => {
                              await apix({
                                port: "recruitment",
                                path: `/api/applicants/apply?job_posting_id=${id}`,
                                method: "get",
                              });
                            },
                            after: () => {
                              local.applied = true;
                              local.render();
                            },
                            msg_load: "Apply Position ",
                            msg_error: "Apply Position failed ",
                            msg_succes: "Apply Position success ",
                          });
                        }}
                      >
                        <div className="flex flex-grow flex-row items-center gap-x-2 text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19 6.5h-3v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3m-9-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm10 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.05h3v1.05a1 1 0 0 0 2 0v-1.05h6v1.05a1 1 0 0 0 2 0v-1.05h3Zm0-7H4v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"
                            ></path>
                          </svg>
                          Apply for this position
                        </div>
                      </ButtonBetter>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-x-4 p-4 md:p-8">
                  <div className={cx("grid grid-cols-3 gap-x-4 flex-grow")}>
                    <div className="col-span-3 flex flex-col gap-y-4">
                      <div className="border border-gray-200 flex flex-col md:py-4 rounded-lg">
                        <div className="text-sm md:text-md font-bold flex flex-col border-b border-gray-200 px-4 mx-4 py-2">
                          Activity Details
                        </div>
                        <div className="flex flex-col flex-grow py-4 px-2 md:px-0">
                          <Stepper steps={local.steps} step={local.step} />
                        </div>
                      </div>
                      {local.stepName === "ADMINISTRATIVE_SELECTION" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className=" flex flex-row items-center  justify-center text-md gap-x-2 px-4 mx-4 py-2">
                            Thank you for submitting your application. We are
                            pleased to inform you that your CV is currently
                            under review by our HR team.
                          </div>
                        </div>
                      ) : local.stepName === "REJECTED" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                            Thank you for your time and effort throughout the
                            recruitment process. We sincerely appreciate your
                            interest in our company and wish you all the best in
                            your career journey.
                          </div>
                        </div>
                      ) : local.stepName === "TEST" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                            You've Passed to the Next Stage! Please stay tuned
                            and check your email regularly for updates.
                          </div>
                          {local.readyTest ? (
                            <>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <p className="font-bold">Schedule Test:</p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <RiCalendarScheduleLine />
                                  {`${dayDate(
                                    get(local, "detail.schedule_date")
                                  )}`}
                                </p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <GoClock />
                                  {`${get(local, "detail.start_time")} - ${get(
                                    local,
                                    "detail.end_time"
                                  )}`}
                                </p>
                                {get(local, "detail.location") ? (
                                  <p className=" flex flex-row gap-x-2 items-center">
                                    <MdOutlineLocationOn />
                                    <a
                                      target="_blank"
                                      className="text-primary underline"
                                      href={get(local, "detail.location")}
                                    >
                                      Link Location
                                    </a>
                                  </p>
                                ) : (
                                  <></>
                                )}
                                {get(local, "detail.url") ? (
                                  <p className=" flex flex-row gap-x-2 items-center">
                                    <IoLinkOutline />
                                    <a
                                      target="_blank"
                                      className="text-primary underline"
                                      href={get(local, "detail.url")}
                                    >
                                      Link Test
                                    </a>
                                  </p>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : local.stepName === "INTERVIEW" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                            You've Passed to the Next Stage! Please stay tuned
                            and check your email regularly for updates.
                          </div>
                          {local.readyTest ? (
                            <>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <p className="font-bold">Schedule Interview:</p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <RiCalendarScheduleLine />
                                  {`${dayDate(
                                    get(local, "detail.schedule_date")
                                  )}`}
                                </p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <GoClock />
                                  {`${get(local, "detail.start_time")} - ${get(
                                    local,
                                    "detail.end_time"
                                  )}`}
                                </p>
                                {get(local, "detail.location_link") ? (
                                  <p className=" flex flex-row gap-x-2 items-center">
                                    <MdOutlineLocationOn />
                                    <a
                                      target="_blank"
                                      className="text-primary underline"
                                      href={get(local, "detail.location_link")}
                                    >
                                      Link Location
                                    </a>
                                  </p>
                                ) : (
                                  <></>
                                )}
                                {get(local, "detail.meeting_link") ? (
                                  <p className=" flex flex-row gap-x-2 items-center">
                                    <IoLinkOutline />
                                    <a
                                      target="_blank"
                                      className="text-primary underline"
                                      href={get(local, "detail.meeting_link")}
                                    >
                                      Link Interview
                                    </a>
                                  </p>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : local.stepName === "FINAL_INTERVIEW" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                            You've Passed to the Next Stage! Please stay tuned
                            and check your email regularly for updates.
                          </div>
                          {local.readyTest ? (
                            <>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <p className="font-bold">Schedule Interview:</p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <RiCalendarScheduleLine />
                                  {`${dayDate(
                                    get(local, "detail.schedule_date")
                                  )}`}
                                </p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <GoClock />
                                  {`${get(local, "detail.start_time")} - ${get(
                                    local,
                                    "detail.end_time"
                                  )}`}
                                </p>
                                {get(local, "detail.location_link") ? (
                                  <p className=" flex flex-row gap-x-2 items-center">
                                    <MdOutlineLocationOn />
                                    <a
                                      target="_blank"
                                      className="text-primary underline"
                                      href={get(local, "detail.location_link")}
                                    >
                                      Link Location
                                    </a>
                                  </p>
                                ) : (
                                  <></>
                                )}
                                {get(local, "detail.meeting_link") ? (
                                  <p className=" flex flex-row gap-x-2 items-center">
                                    <IoLinkOutline />
                                    <a
                                      target="_blank"
                                      className="text-primary underline"
                                      href={get(local, "detail.meeting_link")}
                                    >
                                      Link Interview
                                    </a>
                                  </p>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : local.stepName === "FGD" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                            You've Passed to the Next Stage! Please stay tuned
                            and check your email regularly for updates.
                          </div>
                          {local.readyTest ? (
                            <>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <p className="font-bold">Schedule FGD:</p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <RiCalendarScheduleLine />
                                  {dayDate(get(local, "detail.start_date")) ===
                                  dayDate(get(local, "detail.end_date"))
                                    ? dayDate(get(local, "detail.start_date"))
                                    : `${dayDate(
                                        get(local, "detail.start_date")
                                      )} - ${dayDate(
                                        get(local, "detail.end_date")
                                      )}`}
                                </p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <GoClock />
                                  {`${get(local, "detail.start_time")} - ${get(
                                    local,
                                    "detail.end_time"
                                  )}`}
                                </p>
                                <p className=" flex flex-row gap-x-2 items-center">
                                  <IoLinkOutline />
                                  <a
                                    target="_blank"
                                    className="text-primary underline"
                                    href={get(local, "detail.url")}
                                  >
                                    Link Location
                                  </a>
                                </p>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : local.stepName === "OFFERING_LETTER" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations Your Offer Letter is Ready!{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          {local?.readyTest ? (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                We are thrilled to inform you that you have
                                successfully completed the recruitment process,
                                and your{" "}
                                {getValue(local.detail, "document_setup.title")}{" "}
                                has been prepared.
                              </div>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <Form
                                  onSubmit={async (fm: any) => {
                                    await apix({
                                      port: "recruitment",
                                      value: "data.data",
                                      path: "/api/document-agreement",
                                      method: "post",
                                      type: "form",
                                      data: {
                                        file: fm?.data?.file,
                                        document_sending_id: local.detail?.id,
                                        applicant_id:
                                          local?.detail?.applicant?.id,
                                      },
                                    });
                                  }}
                                  onLoad={async () => {
                                    return {
                                      employee_contract:
                                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/Contract.pdf",
                                      ...local.detail,
                                    };
                                  }}
                                  afterLoad={async (fm: any) => {
                                    if (
                                      fm.data?.status_aggrement === "SUBMITTED"
                                    ) {
                                      fm.mode = "view";
                                      fm.render();
                                    }
                                  }}
                                  showResize={false}
                                  header={(fm: any) => {
                                    return <></>;
                                  }}
                                  children={(fm: any) => {
                                    return (
                                      <>
                                        <div
                                          className={cx(
                                            "flex flex-row flex-wrap py-2"
                                          )}
                                        >
                                          <div className="flex-grow grid gap-4 grid-cols-1">
                                            <div>
                                              <div className="flex">
                                                <Field
                                                  fm={fm}
                                                  classField={""}
                                                  name={"path"}
                                                  label={
                                                    "Upload the signed offer letter in PDF format."
                                                  }
                                                  disabled={true}
                                                  type={"upload"}
                                                  required={true}
                                                />
                                              </div>
                                            </div>
                                            <div>
                                              <div className="flex">
                                                <Field
                                                  fm={fm}
                                                  hidden_label={true}
                                                  classField={""}
                                                  name={"file"}
                                                  label={
                                                    "Upload the signed offer letter in PDF format."
                                                  }
                                                  type={"upload"}
                                                />
                                              </div>
                                            </div>
                                            {fm.data?.status_aggrement !==
                                            "SUBMITTED" ? (
                                              <div className="flex flex-row items-center">
                                                <ButtonBetter
                                                  className=" px-6"
                                                  onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    fm.submit();
                                                  }}
                                                >
                                                  Submit
                                                </ButtonBetter>
                                              </div>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                We are pleased to inform you that you have
                                successfully completed the recruitment process.
                                Your{" "}
                                {getValue(local.detail, "document_setup.title")}{" "}
                                is currently being processed. Please check your
                                email or our website regularly for updates. We
                                will notify you as soon as it is ready.
                              </div>
                            </>
                          )}
                        </div>
                      ) : local.stepName === "CONTRACT_DOCUMENT" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          {local.readyTest ? (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                Your Contract is Ready! We are pleased to inform
                                you that you have successfully completed the
                                necessary steps, and your job contract is now
                                ready.
                              </div>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <Form
                                  onSubmit={async (fm: any) => {
                                    await apix({
                                      port: "recruitment",
                                      value: "data.data",
                                      path: "/api/document-agreement",
                                      method: "post",
                                      type: "form",
                                      data: {
                                        file: fm?.data?.file,
                                        document_sending_id: local.detail?.id,
                                        applicant_id:
                                          local?.detail?.applicant?.id,
                                      },
                                    });
                                  }}
                                  onLoad={async () => {
                                    return {
                                      employee_contract:
                                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/Contract.pdf",
                                      ...local.detail,
                                    };
                                  }}
                                  afterLoad={async (fm: any) => {
                                    if (
                                      fm.data?.status_aggrement === "SUBMITTED"
                                    ) {
                                      fm.mode = "view";
                                      fm.render();
                                    }
                                  }}
                                  children={(fm: any) => {
                                    return (
                                      <>
                                        <div
                                          className={cx(
                                            "flex flex-row flex-wrap py-2"
                                          )}
                                        >
                                          <div className="flex-grow grid gap-4 grid-cols-1">
                                            <div>
                                              <div className="flex">
                                                {fm.data?.path ? (
                                                  <>
                                                    <Field
                                                      fm={fm}
                                                      classField={""}
                                                      name={"path"}
                                                      label={
                                                        "Cover Letter New Employee"
                                                      }
                                                      disabled={true}
                                                      type={"upload"}
                                                      required={true}
                                                    />
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                            </div>
                                            <div>
                                              <div className="flex">
                                                <Field
                                                  fm={fm}
                                                  hidden_label={true}
                                                  classField={""}
                                                  name={"file"}
                                                  label={
                                                    "Upload the signed offer letter in PDF format."
                                                  }
                                                  required={true}
                                                  type={"upload"}
                                                />
                                              </div>
                                            </div>
                                            {fm.data?.status_aggrement !==
                                            "SUBMITTED" ? (
                                              <div className="flex flex-row items-center">
                                                <ButtonBetter
                                                  className=" px-6"
                                                  onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    fm.submit();
                                                  }}
                                                >
                                                  Submit
                                                </ButtonBetter>
                                              </div>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                We are currently processing your job contract.
                                Please check your email or our website regularly
                                for updates. We will notify you as soon as it is
                                ready.
                              </div>
                            </>
                          )}
                        </div>
                      ) : local.stepName === "DOCUMENT_CHECKING" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          {local.readyTest ? (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                Congratulations on becoming a part of{" "}
                                {get(local, "data.for_organization_name")}! As
                                part of the new employee verification process,
                                we kindly request you to submit the following
                                documents:
                              </div>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <Form
                                  onSubmit={async (fm: any) => {
                                    const data = fm?.data;
                                    await apix({
                                      port: "recruitment",
                                      value: "data.data",
                                      path: "/api/document-verification-headers/update",
                                      method: "put",
                                      data: {
                                        id: fm?.data?.id,
                                        project_recruitment_line_id:
                                          data?.project_recruitment_line_id,
                                        applicant_id: data?.applicant_id,
                                        job_posting_id: data?.job_posting_id,
                                        status: "SUBMITTED",
                                      },
                                    });
                                    fm.data.status = "SUBMITTED";
                                    fm.mode = "view";
                                    fm.render();
                                  }}
                                  onLoad={async () => {
                                    const data = local.detail;
                                    return {
                                      employee_contract:
                                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/Contract.pdf",
                                      ...local.detail,
                                    };
                                  }}
                                  afterLoad={async (fm: any) => {
                                    if (
                                      fm.data?.status_aggrement === "SUBMITTED"
                                    ) {
                                      fm.mode = "view";
                                      fm.render();
                                    }
                                  }}
                                  children={(fm: any) => {
                                    return (
                                      <>
                                        <div
                                          className={cx(
                                            "flex flex-row flex-wrap py-2"
                                          )}
                                        >
                                          <div className="flex-grow md:grid gap-4 grid-cols-1 md:grid-cols-2">
                                            {fm?.data
                                              ?.document_verification_lines
                                              ?.length ? (
                                              <>
                                                {fm?.data?.document_verification_lines.map(
                                                  (item: any, idx: number) => {
                                                    const format =
                                                      item
                                                        ?.document_verification
                                                        ?.format;
                                                    if (format === "text") {
                                                      return (
                                                        <div
                                                          key={`files-${
                                                            idx + 1
                                                          }`}
                                                        >
                                                          <Field
                                                            fm={cloneFM(
                                                              fm,
                                                              item
                                                            )}
                                                            isDebounce={true}
                                                            name={"answer"}
                                                            // “Nomor NPWP” : min 15 digit, max 16 digit “Nomor Kartu BPJS TK” : min/max 11 digit “Nomor KTP” : min/max 16 digit “Nomor Kartu BPJS KS” : min/max 13 digit
                                                            label={item?.name}
                                                            placeholder={
                                                              item?.name ===
                                                              "Nomor Kartu BPJS KS"
                                                                ? "min/max 13 digit"
                                                                : item?.name ===
                                                                  "Nomor KTP"
                                                                ? "min/max 16 digit"
                                                                : item?.name ===
                                                                  "Nomor NPWP"
                                                                ? "min 15 digit, max 16 digit"
                                                                : item?.name ===
                                                                  "Nomor Kartu BPJS TK"
                                                                ? "min/max 11 digit"
                                                                : ""
                                                            }
                                                            onChange={async (
                                                              ev
                                                            ) => {
                                                              await actionToast(
                                                                {
                                                                  task: async () => {
                                                                    const res =
                                                                      await apix(
                                                                        {
                                                                          port: "recruitment",
                                                                          value:
                                                                            "data.data",
                                                                          path:
                                                                            "/api/document-verification-lines/" +
                                                                            item?.id +
                                                                            "/answer",
                                                                          method:
                                                                            "put",
                                                                          data: {
                                                                            answer:
                                                                              ev,
                                                                            id: item?.id,
                                                                          },
                                                                        }
                                                                      );
                                                                    if (res) {
                                                                      fm.data.document_verification_lines[
                                                                        idx
                                                                      ] = {
                                                                        ...fm
                                                                          .data
                                                                          .document_verification_lines[
                                                                          idx
                                                                        ],
                                                                        answer:
                                                                          res?.answer,
                                                                      };
                                                                      fm.render();
                                                                    }
                                                                  },
                                                                  failed:
                                                                    () => {
                                                                      fm.data.document_verification_lines[
                                                                        idx
                                                                      ] = {
                                                                        ...fm
                                                                          .data
                                                                          .document_verification_lines[
                                                                          idx
                                                                        ],
                                                                        answer:
                                                                          ev,
                                                                      };
                                                                      fm.render();
                                                                    },
                                                                  after:
                                                                    () => {},
                                                                  msg_load:
                                                                    "Update ",
                                                                  msg_error:
                                                                    "Update failed ",
                                                                  msg_succes:
                                                                    "Update success ",
                                                                }
                                                              );
                                                            }}
                                                            type={"text"}
                                                          />
                                                        </div>
                                                      );
                                                    }
                                                    return (
                                                      <div
                                                        key={`files-${idx + 1}`}
                                                      >
                                                        <Field
                                                          fm={cloneFM(fm, item)}
                                                          name={"path"}
                                                          label={item?.name}
                                                          onChange={async () => {
                                                            if (
                                                              format !== "text"
                                                            ) {
                                                              await actionToast(
                                                                {
                                                                  task: async () => {
                                                                    const res =
                                                                      await apix(
                                                                        {
                                                                          port: "recruitment",
                                                                          value:
                                                                            "data.data",
                                                                          path: "/api/document-verification-lines/upload",
                                                                          method:
                                                                            "post",
                                                                          type: "form",
                                                                          data: {
                                                                            file: item?.path,
                                                                            id: item?.id,
                                                                          },
                                                                        }
                                                                      );
                                                                    if (res) {
                                                                      fm.data.document_verification_lines[
                                                                        idx
                                                                      ] = {
                                                                        ...fm
                                                                          .data
                                                                          .document_verification_lines[
                                                                          idx
                                                                        ],
                                                                        path: res?.path,
                                                                      };
                                                                      fm.render();
                                                                    }
                                                                  },
                                                                  failed:
                                                                    () => {
                                                                      fm.data.document_verification_lines[
                                                                        idx
                                                                      ] = {
                                                                        ...fm
                                                                          .data
                                                                          .document_verification_lines[
                                                                          idx
                                                                        ],
                                                                        path: null,
                                                                      };
                                                                      fm.render();
                                                                    },
                                                                  after:
                                                                    () => {},
                                                                  msg_load:
                                                                    "Upload ",
                                                                  msg_error:
                                                                    "Upload failed ",
                                                                  msg_succes:
                                                                    "Upload success ",
                                                                }
                                                              );
                                                            } else {
                                                            }
                                                          }}
                                                          type={
                                                            format === "text"
                                                              ? "text"
                                                              : "upload"
                                                          }
                                                          description={() => {
                                                            if (
                                                              item?.name ===
                                                              "Kartu BPJS TK"
                                                            )
                                                              return (
                                                                <p>
                                                                  Please upload
                                                                  your file
                                                                  using the{" "}
                                                                  <span
                                                                    className="cursor-pointer text-primary underline"
                                                                    onClick={async () => {
                                                                      await actionToast(
                                                                        {
                                                                          task: async () => {
                                                                            const res =
                                                                              await apix(
                                                                                {
                                                                                  port: "recruitment",
                                                                                  method:
                                                                                    "get",
                                                                                  value:
                                                                                    "data",
                                                                                  options:
                                                                                    {
                                                                                      responseType:
                                                                                        "blob",
                                                                                      headers:
                                                                                        {
                                                                                          Accept:
                                                                                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Memastikan format yang benar
                                                                                        },
                                                                                    },
                                                                                  path: `/api/document-verification-headers/bpjs-tk`,
                                                                                }
                                                                              );
                                                                            const url =
                                                                              window.URL.createObjectURL(
                                                                                new Blob(
                                                                                  [
                                                                                    res,
                                                                                  ]
                                                                                )
                                                                              );
                                                                            const link =
                                                                              document.createElement(
                                                                                "a"
                                                                              );
                                                                            link.href =
                                                                              url;
                                                                            link.setAttribute(
                                                                              "download",
                                                                              "Kartu BPJS TK.xlsx"
                                                                            );
                                                                            document.body.appendChild(
                                                                              link
                                                                            );
                                                                            link.click();
                                                                          },
                                                                          msg_load:
                                                                            "Download Template",
                                                                          msg_error:
                                                                            "Download Template Failed",
                                                                          msg_succes:
                                                                            "Download Template Success",
                                                                        }
                                                                      );
                                                                    }}
                                                                  >
                                                                    BPJS
                                                                    Employment
                                                                    Card (BPJS
                                                                    TK) template
                                                                  </span>
                                                                </p>
                                                              );
                                                            return <></>;
                                                          }}
                                                        />
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {fm.data?.status !== "SUBMITTED" ? (
                                              <div className="flex flex-row items-center col-span-2">
                                                <ButtonBetter
                                                  className=" px-6"
                                                  onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    fm.submit();
                                                  }}
                                                >
                                                  Submit
                                                </ButtonBetter>
                                              </div>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                Congratulations on becoming a part of{" "}
                                {get(local, "data.for_organization_name")}! We
                                are currently preparing the list of documents
                                required for the new employee verification
                                process. Please stay tuned and check your email
                                or our website regularly for updates. We will
                                notify you once the details are ready.
                              </div>
                            </>
                          )}
                        </div>
                      ) : local.stepName === "FINAL_RESULT" ? (
                        <div className="border border-gray-200 flex flex-col py-4 rounded-lg">
                          <div className="font-bold flex flex-row items-center text-lg gap-x-2 border-b border-gray-200 px-4 mx-4 py-2">
                            Congratulations{" "}
                            <LuPartyPopper className="text-pink-500" />
                          </div>
                          {local.readyTest ? (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                Your Cover Letter is Ready! Welcome to Julong
                                Group Indonesia ! We are excited to have you on
                                board and look forward to working with you.
                              </div>
                              <div className="flex flex-col flex-grow py-4 pt-0 px-8">
                                <Form
                                  onSubmit={async (fm: any) => {}}
                                  onLoad={async () => {
                                    return {
                                      ...local.detail,
                                      employee_contract:
                                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/Contract.pdf",
                                    };
                                  }}
                                  showResize={false}
                                  header={(fm: any) => {
                                    return <></>;
                                  }}
                                  children={(fm: any) => {
                                    return (
                                      <>
                                        <div
                                          className={cx(
                                            "flex flex-row flex-wrap py-2"
                                          )}
                                        >
                                          <div className="flex-grow grid gap-4 grid-cols-1">
                                            <div>
                                              <div className="flex">
                                                {fm.data?.path ? (
                                                  <>
                                                    <Field
                                                      fm={fm}
                                                      classField={""}
                                                      name={"path"}
                                                      label={
                                                        "Cover Letter New Employee"
                                                      }
                                                      disabled={true}
                                                      type={"upload"}
                                                      required={true}
                                                    />
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className=" flex flex-row items-center text-md gap-x-2 px-4 mx-4 py-2">
                                Welcome to Julong Group Indonesia! We are
                                excited to have you on board. Your cover letter
                                is currently being processed. Please stay tuned
                                and check your email or our website regularly
                                for updates. We will notify you as soon as it is
                                ready.
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow">
            <div className="h-screen w-full flex flex-row items-center justify-center">
              <div className="spinner-better"></div>
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <FlowbiteFooterSection />
        </div>
      </div>
    </div>
  );
}

export default Page;
