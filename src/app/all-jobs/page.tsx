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
import { Popover } from "@/lib/components/Popover/Popover";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import React from "react";
import { DrawerBetter } from "@/lib/components/ui/drawer";
import { FilterOutline } from "@/lib/svg/FilterOutline";
import { SortEp } from "@/lib/svg/SortEp";
import { get_params_url } from "@/lib/utils/getParamsUrl";

function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const take = 15;
  const local = useLocal({
    open: false,
    ready: false,
    access: true,
    data: [] as any[],
    count: 0,
    page: 1,
    maxPage: 100,
    user: null as any,
    filter: {} as any,
    reload: async () => {
      try {
        const params = await events("onload-param", {
          paging: local.page,
          take: take,
          status: "IN PROGRESS",
          ...local.filter,
        });
        const res = await apix({
          port: "recruitment",
          value: "data.data.job_postings",
          path: `/api${
            get_user("id") ? `/` : `/no-auth/`
          }job-postings/show-only${params}`,
          method: "get",
        });

        const count = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api${
            get_user("id") ? `/` : `/no-auth/`
          }job-postings/show-only${params}`,
          method: "get",
        });
        local.data = res;
        local.count = count;
        local.maxPage = Math.ceil(getNumber(count) / take);
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
    },
  });
  useEffect(() => {
    setIsClient(true);

    const run = async () => {
      const page = get_params_url("page");
      local.page = getNumber(page) ? getNumber(page) : 1;
      local.render();
      await local.reload();
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
      local.reload();
    }
  };
  const priorityOptions = [
    { label: "relevant", value: "relevant" },
    { label: "recent", value: "recent" },
  ];
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
          <div className="flex-grow grid md:grid-cols-5 md:p-8 w-full max-w-screen-xl">
            {/* Filter Desktop */}
            <div className="hidden md:flex">
              <Form
                onSubmit={async (fm: any) => {
                  const data = fm.data;
                  console.log(data);
                }}
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
                          <ButtonBetter
                            className="rounded-full w-full px-6 "
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              fm.submit();
                            }}
                          >
                            Apply Filter
                          </ButtonBetter>
                        </div>
                      </div>
                    </>
                  );
                }}
              />
            </div>
            <div className="flex-grow flex flex-col p-4 md:p-8 md:pt-0 md:col-span-4 pt-0">
              <div className="flex flex-row items-center pb-4  w-full">
                <p className="font-bold text-3xl flex-grow">Jobs</p>
                {/* Filter Mobile */}
                <div className="flex flex-row  md:hidden">
                  <Form
                    onSubmit={async (fm: any) => {
                      let filter = {
                        ...local.filter,
                        relevant:
                          fm.data.priority === "relevant" ? "YES" : "NO",
                      };
                      local.filter = filter;
                      setParam({
                        relevant:
                          fm.data.priority === "relevant" ? "YES" : "NO",
                      });
                      local.render();
                      local.reload();
                    }}
                    onLoad={async () => {
                      return {
                        priority:
                          local?.filter?.relevant === "YES"
                            ? "relevant"
                            : "recent",
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
                              "flex flex-row flex-wrap px-4 pr-0 py-2  rounded-md"
                            )}
                          >
                            <div className="flex flex-row flex-grow">
                              <div className="flex flex-row items-center text-sm gap-x-1">
                                <DrawerBetter
                                  contentOpen={
                                    <>
                                      <div className="px-4 pb-4 flex flex-col gap-y-2">
                                        <Field
                                          fm={fm}
                                          name={"priority"}
                                          hidden_label={true}
                                          label={"Option"}
                                          type={"radio"}
                                          className={"text-md"}
                                          placeholder="Choose"
                                          onChange={() => {
                                            fm.data.update = true;
                                            fm.render();
                                          }}
                                          onLoad={() => {
                                            return [
                                              {
                                                label: "Relevant",
                                                value: "relevant",
                                              },
                                              {
                                                label: "Recent",
                                                value: "recent",
                                              },
                                            ];
                                          }}
                                        />
                                        <ButtonBetter
                                          className="rounded-full w-full px-6 "
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            event.preventDefault();
                                            fm.submit();
                                          }}
                                        >
                                          Apply
                                        </ButtonBetter>
                                      </div>
                                    </>
                                  }
                                  title={"Sort Jobs"}
                                  description="Filter job listings by relevance or most recent"
                                >
                                  <ButtonBetter variant={"outline"}>
                                    <SortEp className="w-6 h-6" />
                                  </ButtonBetter>
                                </DrawerBetter>
                                <DrawerBetter
                                  contentOpen={
                                    <>
                                      <div className="px-4 pb-4 flex flex-col gap-y-2">
                                        <div className="grid grid-cols-1">
                                          <div>
                                            <Field
                                              fm={fm}
                                              // hidden_label={true}
                                              name={"job_type"}
                                              label={"Job Type"}
                                              type={"checkbox"}
                                              onLoad={() => {
                                                return [
                                                  {
                                                    label: "Management Trainee",
                                                    value:
                                                      "MT_Management Trainee",
                                                  },
                                                  {
                                                    label: "Personal Hire",
                                                    value:
                                                      "PH_Professional Hire",
                                                  },
                                                  {
                                                    label: "Non Staff",
                                                    value:
                                                      "NS_Non Staff to Staff",
                                                  },
                                                ];
                                              }}
                                            />
                                            <div>
                                              <Field
                                                fm={fm}
                                                // hidden_label={true}
                                                name={"experience"}
                                                label={"Experience"}
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
                                        </div>
                                        <ButtonBetter className="rounded-full w-full px-6 ">
                                          Apply Filter
                                        </ButtonBetter>
                                      </div>
                                    </>
                                  }
                                  title={"Filter Jobs"}
                                  description="Find jobs that match your preferences"
                                >
                                  <ButtonBetter variant={"outline"}>
                                    <FilterOutline className="w-6 h-6" />
                                  </ButtonBetter>
                                </DrawerBetter>
                              </div>
                              <div className="hidden flex flex-row items-center text-sm">
                                Sorted By
                                <Popover
                                  open={open}
                                  arrow={false}
                                  onOpenChange={(event) => {
                                    setOpen(event);
                                  }}
                                  backdrop={false}
                                  classNameTrigger={
                                    "flex flex-row items-center px-1"
                                  }
                                  placement="bottom-start"
                                  className=" overflow-hidden rounded-md"
                                  content={
                                    <div
                                      className={cx(
                                        "flex flex-col border  rounded-md text-sm capitalize",
                                        css`
                                          min-width: 150px;
                                        `,
                                        css`
                                          max-height: 400px;
                                          overflow: auto;
                                        `
                                      )}
                                    >
                                      {priorityOptions.map((option, index) => (
                                        <React.Fragment key={option.value}>
                                          <div
                                            className="flex px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                              fm.data.priority = option.value;
                                              fm.render();
                                              setOpen(false);
                                            }}
                                          >
                                            {option.label}
                                          </div>
                                          {index <
                                            priorityOptions.length - 1 && (
                                            <div className="w-full border-b border-gray-300"></div>
                                          )}
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  }
                                >
                                  <div
                                    className="flex items-center font-bold gap-x-2 cursor-pointer capitalize"
                                    onClick={() => {
                                      setOpen(true);
                                    }}
                                  >
                                    {fm.data.priority}{" "}
                                    {open ? (
                                      <GoChevronUp size={14} />
                                    ) : (
                                      <GoChevronDown size={14} />
                                    )}
                                  </div>
                                </Popover>
                              </div>
                            </div>
                            <div className="flex-grow grid grid-cols-1 hidden">
                              <div className="grid grid-cols-2 gap-4"></div>
                            </div>
                          </div>
                        </>
                      );
                    }}
                  />
                </div>
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
                  take={take}
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
    </div>
  );
}
const setParam = (data: Record<string, any>) => {
  const currentUrl = new URL(window.location.href);
  if (Object.keys(data).length > 0) {
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        currentUrl.searchParams.set(key, data[key]);
      } else {
        currentUrl.searchParams.delete(key);
      }
    });
  } else {
    // delete all params url
    currentUrl.searchParams.forEach((value, key) => {
      currentUrl.searchParams.delete(key);
    });
  }
  window.history.pushState({}, "", currentUrl);
};
export default HomePage;
