"use client";
import { getParams } from "@/lib/utils/get-params";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { X } from "lucide-react";
import { TbEyeEdit } from "react-icons/tb";
import { DropdownHamburgerBetter } from "@/lib/components/ui/dropdown-menu";
import { siteurl } from "@/lib/utils/siteurl";
import { PDFViewer } from "@/lib/components/export";
import { access } from "@/lib/utils/getAccess";
import { normalDate } from "@/lib/utils/date";
import { IoCheckmarkOutline } from "react-icons/io5";

function Page() {
  const id = getParams("id"); // Replace this with dynamic id retrieval
  const labelPage = "Candidate Agreement";
  const urlPage = `/d/contract-document/document-agreement`;
  const local = useLocal({
    can_approve: false,
    access: false,
    ready: false as boolean,
  });

  useEffect(() => {
    const run = async () => {
      local.can_approve = access("approve-contract-document-agreement");
      local.access = access("read-contract-document-agreement");
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full flex-wrap">
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
            <div className="flex flex-row gap-x-2 items-center">
              <DropdownHamburgerBetter
                className=""
                classNameList="w-48"
                list={[
                  {
                    label: "Revise",
                    icon: <TbEyeEdit className="text-xl" />,
                    msg: "Are you sure you want to revise this record?",
                    alert: true,
                    onClick: async () => {
                      fm.data.status = "REVISED";
                      fm.submit();
                    },
                  },
                  {
                    label: "Approved",
                    icon: <IoCheckmarkOutline className="text-xl" />,
                    msg: "Are you sure you want to revise this record?",
                    alert: true,
                    onClick: async () => {
                      fm.data.status = "APPROVED";
                      fm.submit();
                    },
                  },
                  {
                    label: "Rejected",
                    icon: <X className="text-xl" />,
                    msg: "Are you sure you want to rejected this record?",
                    alert: true,
                    onClick: async () => {
                      fm.data.status = "REJECTED";
                      fm.submit();
                    },
                  },
                ]}
              />
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const data = fm?.data?.document_sending;
        console.log({ data });
        console.log({
          ...data,
          status: fm?.data?.status,
          recruitment_type: data?.job_posting?.recruitment_type,
          email: data?.applicant?.user_profile?.user?.email,
          project_number:
            data?.job_posting?.project_recruitment_header?.document_number,
          project_recruitment_header_id:
            data?.job_posting?.project_recruitment_header_id,
          order: data?.project_recruitment_line?.order,
          document_date: normalDate(data?.document_date),
          joined_date: normalDate(data?.joined_date),
        });
        await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-sending/update",
          method: "put",
          data: {
            ...data,
            status: fm?.data?.status,
            recruitment_type: data?.job_posting?.recruitment_type,
            email: data?.applicant?.user_profile?.user?.email,
            project_number:
              data?.job_posting?.project_recruitment_header?.document_number,
            project_recruitment_header_id:
              data?.job_posting?.project_recruitment_header_id,
            order: data?.project_recruitment_line?.order,
            document_date: normalDate(data?.document_date),
            joined_date: normalDate(data?.joined_date),
          },
        });
      }}
      mode="view"
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-agreement/${id}`,
          validate: "object",
        });
        return {
          ...data,
          email: data?.applicant?.user_profile?.user?.email,
          applicant_name: data?.applicant?.user_profile?.name,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      className="h-full"
      children={(fm: any) => {
        return (
          <>
            <div className={"flex flex-col flex-wrap px-4 py-2 flex-grow"}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"applicant_name"}
                    label={"Recipient's Name"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"email"}
                    label={"Recipient's Email"}
                    type={"text"}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="flex flex-grow flex-row relative">
                <div className="absolute top-0 left-0 w-full h-full min-h-[200px]">
                  <PDFViewer url={siteurl(fm?.data?.path)} />
                </div>
                {/* <iframe
                  src={siteurl("/8ebf0cb8-69e4-4c64-bfa9-ce73851f30a8.pdf")}
                  className="w-full h-full"
                /> */}
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

export default Page;
