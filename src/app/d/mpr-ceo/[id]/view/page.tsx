"use client";
import { AlertCeoApprove } from "@/lib/components/comp/AlertCeoApprove";
import { AlertCeoApproveMPR } from "@/lib/components/comp/AlertCeoApproveMPR";
import { AlertCeoReject } from "@/lib/components/comp/AlertCeoReject";
import { AlertCeoRejectMPR } from "@/lib/components/comp/AlertCeoRejectMPR";
import { TableList } from "@/lib/components/tablelist/TableList";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonBetter } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import MyDocument from "@/lib/components/ui/Document";
import DocumentMPR from "@/lib/components/ui/DocumentMPR";
import api from "@/lib/utils/axios";
import { shortDate } from "@/lib/utils/date";
import { events } from "@/lib/utils/event";
import { getParams } from "@/lib/utils/get-params";
import { accessMe, getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
import { Button } from "flowbite-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoEye } from "react-icons/io5";

function Page() {
  const id = getParams("id");
  const local = useLocal({
    can_add: false,
    can_edit: false,
    client: false,
    data: null as any,
    can_approval: false,
  });
  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      const res: any = await api.get(
        `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-requests/` + id
      );
      const data = res.data.data;
      
      let categories = [] as any[];
      const ctg: any = await api.get(
        `${process.env.NEXT_PUBLIC_API_MPP}/api/request-categories`
      );
      const category: any[] = ctg.data?.data;
      if (!Array.isArray(category)) categories = [];
      categories = category.map((e) => {
        return {
          value: e.id,
          label: e.name,
          data: e,
        };
      });
      const lines = data.mp_planning_header.mp_planning_lines || [];
      const jobs = lines.find((e: any) => e.job_id === data.job_id);
      local.data = {
        id,
        ...data,
        categories: categories,
        divisi: data.for_organization_structure,
        job_level: data.job_level_name,
        location: data.for_organization_location_id,
        is_replacement: data.is_replacement ? "penggantian" : "penambahan",
        total_needs: data.male_needs + data.female_needs,
        remaining_balance:
          data.recruitment_type === "MT_Management Trainee"
            ? getNumber(jobs?.remaining_balance_mt)
            : data.recruitment_type === "PH_Professional Hire"
            ? getNumber(jobs?.remaining_balance_ph)
            : 0,
        mpp_name: data.mpp_period.title,
        major_ids: data.request_majors.map((e: any) => e?.["Major"]?.["ID"]),
        is_approve:
          data.status === "NEED APPROVAL" &&
          data.organization_category === "Non Field" &&
          data.mp_request_type === "OFF_BUDGET" &&
          !data.ceo &&
          data.vp_gm_director
            ? true
            : false,
      };
      local.can_approval = getAccess("approval-mpr-ceo", roles);
      local.render();
    };
    run();
  }, []);
  if (typeof window === "undefined") notFound();
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Manpower Planning Request</span>
        </h2>
        <BreadcrumbBetterLink
          data={[
            {
              title: "List Manpower Request",
              url: "/d/mpr-ceo",
            },
            {
              title: "Detail",
            },
          ]}
        />
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden shadow">
        <div className="flex flex-grow flex-col">
          <div className="flex flex-grow bg-[#525659] overflow-y-scroll flex-col items-center relative">
            {local.data && (
              <PDFViewer className="flex-grow w-full">
                <DocumentMPR  data={local.data}/>
              </PDFViewer>
            )}
          </div>
          {local.data?.is_approve && local.can_approval && (
            <div className="flex flex-row items-center justify-center">
              <div className="flex flex-row gap-x-1 py-2">
                <AlertCeoRejectMPR lc={local}/>
                <AlertCeoApproveMPR  fm={local}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
