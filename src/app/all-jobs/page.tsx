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
import DetailJobs from "../components/DetailJobs";
import CardCompanyProfile from "../components/CardCompanyProfile";

function HomePage() {
  const local = useLocal({
    open: false,
  });
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col max-w-screen bg-white">
      <DefaultHeaderNavigation />
      <div
        className={cx(
          "h-64 relative mb-8",
          css`
            background-image: url("${siteurl("/office.png")}");
          `
        )}
      >
        <div className="absolute bottom-[-25px] w-full flex flex-row justify-center items-center px-32">
          <div className="flex flex-grow bg-white shadow-md rounded-md">
            <div className="flex flex-grow">
              <Form
                onSubmit={async (fm: any) => {}}
                onLoad={async () => {
                  return {};
                }}
                showResize={false}
                header={(fm: any) => {
                  return <></>;
                }}
                children={(fm: any) => {
                  return (
                    <>
                      <div className={cx("flex flex-row flex-wrap px-4 py-2")}>
                        <div className="flex-grow grid gap-4 md:gap-6 md:grid-cols-2">
                          <div>
                            <Field
                              fm={fm}
                              name={"recommended_by"}
                              label={"Recommend by"}
                              type={"text"}
                              hidden_label={true}
                              placeholder="Job, title or keywords"
                            />
                          </div>

                          <div>
                            <Field
                              fm={fm}
                              name={"recommended_by"}
                              label={"Recommend by"}
                              type={"text"}
                              hidden_label={true}
                              placeholder="Location"
                            />
                          </div>
                        </div>
                        <div className="flex flex-row items-center">
                          <ButtonBetter>
                            <IoIosSearch />
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
      </div>
      <div className="relative flex flex-col flex-grow">
        <div className="flex-grow flex flex-col p-8 ">
          <div className="flex flex-row items-center justify-between pb-4">
            <p className="font-bold text-3xl">All Jobs</p>
          </div>
          <div className="flex flex-row flex-grow">
            <div>

            <PinterestLayout
              gap={4}
              data={[1, 2, 3, 4, 1]}
              child={() => {
                return <JobCard />;
              }}
              col={1}
            />
            </div>
            <div className="relative flex flex-row flex-grow overflow-y-scroll">
              <div className="absolute top-0 left-0 flex-grow flex flex-col p-8 ">
                <DetailJobs />
                <CardCompanyProfile />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center py-4">
            <PaginationDemo />
          </div>
        </div>
        <div className="flex flex-col">
          <FlowbiteFooterSection />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
