"use client";
import get from "lodash.get";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { siteurl } from "@/lib/utils/siteurl";
import { Form } from "@/lib/components/form/Form";
import { Field } from "@/lib/components/form/Field";
import { ButtonBetter } from "@/lib/components/ui/button";
import { IoIosSearch } from "react-icons/io";
import { PinterestLayout } from "@/lib/components/ui/PinterestLayout";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import ServerErrorPage from "@/lib/components/comp/500";
import DefaultHeaderNavigation from "@/app/components/navbarHeader";
import JobCard from "@/app/components/JobCard";
import TestimonialsCard from "@/app/components/testimoni";
import FlowbiteFooterSection from "@/app/components/flowbite-footer";
import { PaginationDemo } from "../components/pagination";
import CardCompanyProfile from "../components/CardCompanyProfile";
import DetailJobs from "../components/DetailJobs";

function HomePage() {
  const local = useLocal({
    open: false,
  });
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col max-w-screen bg-white">
      <DefaultHeaderNavigation />
      <div className="relative flex flex-col flex-grow">
        <div className="flex-grow flex flex-col p-8 ">
          <DetailJobs />
          <CardCompanyProfile />
        </div>
        <div className="flex flex-col">
          <FlowbiteFooterSection />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
