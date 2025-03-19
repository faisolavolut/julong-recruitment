"use client";
import get from "lodash.get";
import { useEffect, useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { Form } from "@/lib/components/form/Form";
import { Field } from "@/lib/components/form/Field";
import { ButtonBetter } from "@/lib/components/ui/button";
import { IoIosSearch } from "react-icons/io";
import { PinterestLayout } from "@/lib/components/ui/PinterestLayout";
import DefaultHeaderNavigation from "@/app/components/navbarHeader";
import JobCard from "@/app/components/JobCard";
import FlowbiteFooterSection from "@/app/components/flowbite-footer";
import { MdOutlineLocationOn } from "react-icons/md";
import { apix } from "@/lib/utils/apix";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerCustom,
} from "@/lib/components/ui/accordion";
import { PaginationPage } from "@/lib/components/tablelist/TableList";
import { getNumber } from "@/lib/utils/getNumber";
import { get_user } from "@/lib/utils/get_user";

function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const local = useLocal({
    open: false,
    ready: false,
    access: true,
    data: [] as any[],
    count: 0,
    page: 1,
    maxPage: 100,
    user: null as any,
  });
  useEffect(() => {
    setIsClient(true);
    const run = async () => {
      try {
        const res = await apix({
          port: "recruitment",
          value: "data.data.job_postings",
          path: `/api${
            get_user("id") ? `/` : `/no-auth/`
          }job-postings/show-only?page=1&page_size=15&status=IN PROGRESS`,
          method: "get",
        });

        const count = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api${
            get_user("id") ? `/` : `/no-auth/`
          }job-postings/show-only?page=1&page_size=8&status=IN PROGRESS`,
          method: "get",
        });
        local.data = res;
        local.count = count;
        local.maxPage = Math.ceil(getNumber(count) / 15);
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
  const gotoPage = () => {
    if (isClient) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set(
        "page",
        !getNumber(local.page) ? "1" : `${getNumber(local.page)}`
      );
      window.history.pushState({}, "", currentUrl);
    }
  };
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col max-w-screen bg-white">
      <DefaultHeaderNavigation />
      <div
        className={cx(
          "h-64 relative md:mb-8 flex flex-row items-center justify-center bg-primary px-2 md:px-0"
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
                            name={"recommended_by"}
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
                            name={"recommended_by"}
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
          <div className="flex-grow grid md:grid-cols-5 md:p-8 max-w-screen-xl">
            {/* Filter Mobile */}
            <div className="flex flex-row md:hidden">
              <Form
                onSubmit={async (fm: any) => {}}
                onLoad={async () => {
                  return {
                    priority: "recent",
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
                          "flex flex-row flex-wrap px-4 py-2  rounded-md"
                        )}
                      >
                        <div className="flex-grow grid grid-cols-1">
                          <div className="grid grid-cols-2 gap-4">
                            <ButtonBetter
                              className="rounded-full w-full px-6 text-sm"
                              variant={
                                fm?.data?.priority === "relevent"
                                  ? "default"
                                  : "outline"
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                fm.data.priority = "relevent";
                                fm.render();
                              }}
                            >
                              Relevant
                            </ButtonBetter>
                            <ButtonBetter
                              className="rounded-full w-full px-6 "
                              variant={
                                fm?.data?.priority === "recent"
                                  ? "default"
                                  : "outline"
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                fm.data.priority = "recent";
                                fm.render();
                              }}
                            >
                              Recent
                            </ButtonBetter>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }}
              />
            </div>
            {/* Filter Desktop */}
            <div className="hidden md:flex">
              <Form
                onSubmit={async (fm: any) => {}}
                onLoad={async () => {
                  return {
                    priority: "recent",
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
                          "flex flex-row flex-wrap px-4 py-2 bg-gray-100 rounded-md"
                        )}
                      >
                        <div className="flex-grow grid grid-cols-1">
                          <div className="md:col-span-2">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              defaultValue={"Prioritise By"}
                            >
                              <AccordionItem value="Prioritise By">
                                <AccordionTriggerCustom
                                  className="flex flex-row items-center"
                                  onRightLabel={() => {
                                    return (
                                      <div className="mx-2 flex flex-row gap-x-1"></div>
                                    );
                                  }}
                                >
                                  Prioritise By
                                </AccordionTriggerCustom>
                                <AccordionContent>
                                  <div className="grid grid-cols-1">
                                    <div className="grid grid-cols-2 gap-4">
                                      <ButtonBetter
                                        className="rounded-full w-full px-6 text-sm"
                                        variant={
                                          fm?.data?.priority === "relevent"
                                            ? "default"
                                            : "outline"
                                        }
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          fm.data.priority = "relevent";
                                          fm.render();
                                        }}
                                      >
                                        Relevant
                                      </ButtonBetter>
                                      <ButtonBetter
                                        className="rounded-full w-full px-6 "
                                        variant={
                                          fm?.data?.priority === "recent"
                                            ? "default"
                                            : "outline"
                                        }
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          fm.data.priority = "recent";
                                          fm.render();
                                        }}
                                      >
                                        Recent
                                      </ButtonBetter>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                          <div className="md:col-span-2">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              defaultValue={"Job Type"}
                            >
                              <AccordionItem value="Job Type">
                                <AccordionTriggerCustom
                                  className="flex flex-row items-center"
                                  onRightLabel={() => {
                                    return (
                                      <div className="mx-2 flex flex-row gap-x-1"></div>
                                    );
                                  }}
                                >
                                  Job Type
                                </AccordionTriggerCustom>
                                <AccordionContent>
                                  <div className="grid grid-cols-1">
                                    <div>
                                      <Field
                                        fm={fm}
                                        hidden_label={true}
                                        name={"job_type"}
                                        label={"Option"}
                                        type={"checkbox"}
                                        onLoad={() => {
                                          return [
                                            {
                                              label: "Management Trainee",
                                              value: "MT_Management Trainee",
                                            },
                                            {
                                              label: "Personal Hire",
                                              value: "PH_Professional Hire",
                                            },
                                            {
                                              label: "Non Staff",
                                              value: "NS_Non Staff to Staff",
                                            },
                                          ];
                                        }}
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>

                          <div className="md:col-span-2">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              defaultValue={"Experience"}
                            >
                              <AccordionItem value="Experience">
                                <AccordionTriggerCustom
                                  className="flex flex-row items-center"
                                  onRightLabel={() => {
                                    return (
                                      <div className="mx-2 flex flex-row gap-x-1"></div>
                                    );
                                  }}
                                >
                                  Experience
                                </AccordionTriggerCustom>
                                <AccordionContent>
                                  <div className="grid grid-cols-1">
                                    <div>
                                      <Field
                                        fm={fm}
                                        hidden_label={true}
                                        name={"experience"}
                                        label={"Option"}
                                        type={"checkbox"}
                                        onLoad={() => {
                                          return [
                                            {
                                              label: "No Experience",
                                              value: "0",
                                            },
                                            {
                                              label: "< 1 Year",
                                              value: "less_1",
                                            },
                                            {
                                              label: "1-3 Year",
                                              value: "1-3 year",
                                            },
                                            {
                                              label: "3-5 Year",
                                              value: "3-5",
                                            },
                                            {
                                              label: "> 5 Year",
                                              value: "gte_5",
                                            },
                                          ];
                                        }}
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                          <div className="md:col-span-2 hidden">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              defaultValue={"Salary"}
                            >
                              <AccordionItem value="Salary">
                                <AccordionTriggerCustom
                                  className="flex flex-row items-center"
                                  onRightLabel={() => {
                                    return (
                                      <div className="mx-2 flex flex-row gap-x-1"></div>
                                    );
                                  }}
                                >
                                  Salary
                                </AccordionTriggerCustom>
                                <AccordionContent>
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <Field
                                        fm={fm}
                                        name={"min"}
                                        label={"Min"}
                                        type={"money"}
                                        placeholder="Minimum Salary"
                                      />
                                    </div>
                                    <div>
                                      <Field
                                        fm={fm}
                                        name={"max"}
                                        label={"Max"}
                                        type={"money"}
                                        placeholder="Maximum Salary"
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                        <div className="flex flex-row items-center justify-end py-4 w-full">
                          <ButtonBetter className="rounded-full w-full px-6 ">
                            Apply Filter
                          </ButtonBetter>
                        </div>
                      </div>
                    </>
                  );
                }}
              />
            </div>
            <div className="flex-grow flex flex-col p-8 md:pt-0 md:col-span-4 pt-0">
              <div className="flex flex-row items-center pb-4  w-full">
                <p className="font-bold text-3xl">Jobs</p>
              </div>
              <div className="flex flex-grow pb-4">
                <PinterestLayout
                  gap={4}
                  data={local.data}
                  child={(item, idx, data, key) => {
                    return <JobCard data={item} user={local?.user} />;
                  }}
                  col={3}
                />
              </div>
              {local?.maxPage <= 1 ? (
                <></>
              ) : (
                <PaginationPage
                  list={local}
                  count={local.count}
                  onNextPage={() => {
                    local.page = local.page + 1;
                    local.render();
                    gotoPage();
                  }}
                  onPrevPage={() => {
                    local.page = local.page - 1;
                    local.render();
                    gotoPage();
                  }}
                  disabledNextPage={
                    getNumber(get(local, "page")) ===
                      getNumber(get(local, "maxPage")) ||
                    getNumber(get(local, "maxPage")) === 1
                  }
                  disabledPrevPage={getNumber(get(local, "page")) === 1}
                  page={getNumber(get(local, "page"))}
                  setPage={(page: any) => {}}
                  countPage={1}
                  countData={local.count}
                  take={15}
                  onChangePage={(page: number) => {
                    local.page = page;
                    local.render();
                    gotoPage();
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <FlowbiteFooterSection />
        </div>
      </div>
      {/* <div className="relative flex flex-col flex-grow">
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
      </div> */}
    </div>
  );
}

export default HomePage;
