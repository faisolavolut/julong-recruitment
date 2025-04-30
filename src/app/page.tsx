"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocal } from "@/lib/utils/use-local";
import ServerErrorPage from "../lib/components/comp/500";
import DefaultHeaderNavigation from "./components/navbarHeader";
import { Form } from "@/lib/components/form/Form";
import { Field } from "@/lib/components/form/Field";
import { ButtonBetter } from "@/lib/components/ui/button";
import { IoIosSearch } from "react-icons/io";
import JobCard from "./components/JobCard";
import { PinterestLayout } from "@/lib/components/ui/PinterestLayout";
import FlowbiteFooterSection from "./components/flowbite-footer";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { apix } from "@/lib/utils/apix";
import { MdOutlineLocationOn } from "react-icons/md";
import { get_user } from "@/lib/utils/get_user";

function HomePage() {
  const router = useRouter();
  const local = useLocal({
    ready: false,
    access: true,
    jobs: [] as any[],
    user: null as any,
  });
  useEffect(() => {
    const run = async () => {
      try {
        const res = await apix({
          port: "recruitment",
          value: "data.data.job_postings",
          path: `/api${
            get_user("id") ? `/` : `/no-auth/`
          }job-postings/show-only?page=1&page_size=8&status=IN PROGRESS`,
          method: "get",
        });
        local.jobs = res;
        local.render();
      } catch (ex) {}

      try {
        const res = await apix({
          port: "portal",
          value: "data.data",
          path: "/api/users/me",
          method: "get",
        });
        local.user = {
          ...res,
          verif: res?.verified_user_profile !== "ACTIVE" ? false : true,
        };
      } catch (ex) {}
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (local.ready) {
    if (!local.access) return <ServerErrorPage />;
  }
  return (
    <div className="flex flex-col max-w-screen bg-white">
      <DefaultHeaderNavigation />
      <div
        className={cx(
          "h-64 relative mb-8 flex flex-row items-center justify-center bg-primary px-2 md:px-0"
        )}
      >
        <div className="flex flex-grow max-w-screen-xl justify-center">
          <div className="flex w-full md:w-3/4 bg-gradient-white shadow-md rounded-md md:rounded-full">
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
                    <div
                      className={cx(
                        "flex flex-col gap-y-2 md:gap-y-0 md:flex-row flex-wrap px-4 py-2"
                      )}
                    >
                      <div className="flex-grow grid gap-4 md:gap-6 md:grid-cols-2">
                        <div>
                          <Field
                            style="underline"
                            fm={fm}
                            name={"search"}
                            label={"Recommend by"}
                            type={"text"}
                            hidden_label={true}
                            placeholder="Job, title or keywords"
                            prefix={
                              <div className="text-md flex flex-row items-center font-bold">
                                <IoIosSearch />
                              </div>
                            }
                          />
                        </div>

                        <div>
                          <Field
                            fm={fm}
                            style="underline"
                            name={"location"}
                            label={"Recommend by"}
                            type={"text"}
                            hidden_label={true}
                            placeholder="Location"
                            prefix={
                              <div className="text-md flex flex-row items-center font-bold text-gray-500">
                                <MdOutlineLocationOn />
                              </div>
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-row items-center">
                        <ButtonBetter className="rounded-full px-6">
                          Search My Job
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
      <div className="relative flex flex-col flex-grow">
        <div className="flex flex-col justify-center items-center">
          <div className="flex-grow flex flex-col p-8 w-full max-w-screen-xl">
            <div className="flex flex-row items-center justify-between pb-4  w-full">
              <p className="font-bold text-xl md:text-3xl">Featured Jobs</p>
              <Link
                href="/all-jobs"
                className="flex flex-row items-center gap-x-2 font-bold text-blue-500 text-xs md:text-md"
              >
                <p className="hidden md:flex">Show all jobs</p>
                <p className="flex md:hidden ">Show all</p> <FaArrowRight />
              </Link>
            </div>
            <div className="flex flex-grow">
              <PinterestLayout
                gap={4}
                data={local.jobs}
                child={(item, idx, data, key) => {
                  return <JobCard data={item} user={local?.user} />;
                }}
                col={4}
              />
            </div>
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
