"use client";
import { useEffect, useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { siteurl } from "@/lib/utils/siteurl";
import DefaultHeaderNavigation from "@/app/components/navbarHeader";
import { MdOutlineLocationOn } from "react-icons/md";
import { apix } from "@/lib/utils/apix";
import { getNumber } from "@/lib/utils/getNumber";
import { events } from "@/lib/utils/event";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { getValue } from "@/lib/utils/getValue";
import { dayDate } from "@/lib/utils/date";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import ProfileCard from "../components/ProfileCard";
import { TableListBetter } from "@/lib/components/tablelist/TableListBetter";
import { ButtonBetter } from "@/lib/components/ui/button";
import { Field } from "@/lib/components/form/Field";
import { IoIosSearch } from "react-icons/io";
import { Form } from "@/lib/components/form/Form";

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
  });
  useEffect(() => {
    setIsClient(true);
    const run = async () => {
      try {
        const res = await apix({
          port: "recruitment",
          value: "data.data.job_postings",
          path: "/api/no-auth/job-postings?page=1&page_size=15&status=IN PROGRESS",
          method: "get",
        });

        const count = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: "/api/no-auth/job-postings?page=1&page_size=8&status=IN PROGRESS",
          method: "get",
        });
        local.data = res;
        local.count = count;
        local.maxPage = Math.ceil(getNumber(count) / 15);
        local.render();
      } catch (ex) {}
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
    <div className="flex flex-col max-w-screen min-h-screen bg-white">
      <DefaultHeaderNavigation />
      <div
        className={cx(
          "h-64 max-h-64 py-8 relative flex flex-row items-center justify-center bg-primary"
        )}
      >
        <div className="flex flex-grow max-w-screen-xl justify-center">
          <div className="flex  w-3/4 bg-gradient-white shadow-md rounded-full">
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
      <div
        className={cx(
          "flex-grow relative flex flex-row  justify-center w-full"
        )}
      >
        <div className="flex flex-row flex-grow max-w-screen-xl justify-center">
          <div className="p-6">
            <ProfileCard />
          </div>
          <div className="flex p-4 flex-col flex-grow  rounded-lg ">
            <div
              className={cx(
                "w-full flex flex-row flex-grow   overflow-hidden",
                css`
                  .tbl-search {
                    display: none;
                  }
                  .table-head-list {
                    background: #f1f2f4 !important;
                  }
                  thead {
                    color: #474c54;
                  }

                  tbody tr {
                    background: transparent !important;
                  }
                  .table-bg {
                    background: transparent !important;
                  }
                  .container-table {
                    height: 400px;
                  }
                `
              )}
            >
              <TableListBetter
                name="period"
                header={{
                  sideLeft: (data: any) => {
                    return (
                      <>
                        <div className="flex flex-row flex-grow">
                          <h2 className="text-xl font-semibold text-gray-900 ">
                            <span className="">
                              Applied Jobs ({formatMoney(data?.count)})
                            </span>
                          </h2>
                        </div>
                      </>
                    );
                  },
                }}
                column={[
                  {
                    name: "name",
                    sortable: false,
                    resize: false,
                    header: () => <span>Jobs</span>,
                    renderCell: ({ row, name, cell }: any) => {
                      return (
                        <div className="flex items-center py-4 space-x-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div
                              className={cx(
                                "w-10 h-10 bg-green-500 flex items-center justify-center rounded bg-no-repeat bg-cover	bg-center",
                                css`
                                  background-image: url("${siteurl(
                                    "/dog.jpg"
                                  )}");
                                `
                              )}
                            ></div>
                          </div>

                          {/* Job Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {getValue(row, "job_name")}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <div className="flex flex-row gap-x-1 items-center">
                                <MdOutlineLocationOn />
                                {getValue(row, "for_organization_location")}
                              </div>
                              <div className="flex flex-row gap-x-0.5 items-center">
                                <div className="text-sm">Rp</div>
                                {formatMoney(
                                  getNumber(getValue(row, "salary_min"))
                                )}
                                -
                                {formatMoney(
                                  getNumber(getValue(row, "salary_max"))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    name: "form_type",
                    sortable: false,
                    resize: false,
                    header: () => <span>Date Applied</span>,
                    renderCell: ({ row, name, cell }: any) => {
                      return dayDate(new Date());
                    },
                  },
                  {
                    name: "status",
                    sortable: false,
                    resize: false,
                    header: () => <span>Status</span>,
                    renderCell: ({ row, name, cell }: any) => {
                      if (row?.[name] === "IN PROGRESS") {
                        return (
                          <div className="text-green-500">In Progress</div>
                        );
                      }
                      return <div className="text-red-500">Close</div>;
                    },
                  },
                  {
                    name: "action",
                    header: () => <span>Action</span>,
                    sortable: false,
                    renderCell: ({ row, name, cell }: any) => {
                      return (
                        <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                          <ButtonLink
                            href={`/applied-jobs/${row.id}`}
                            className={
                              "bg-gray-100 shadow-none font-bold text-primary hover:bg-primary hover:text-white"
                            }
                          >
                            <div className="flex items-center gap-x-2">
                              View Detail
                            </div>
                          </ButtonLink>
                        </div>
                      );
                    },
                  },
                ]}
                onLoad={async (param: any) => {
                  const params = await events("onload-param", param);
                  const result: any = await apix({
                    port: "recruitment",
                    value: "data.data",
                    path: `/api/job-postings/applied${params}`,
                    validate: "array",
                  });
                  return result;
                }}
                onCount={async () => {
                  const result: any = await apix({
                    port: "recruitment",
                    value: "data.data.total",
                    path: `/api/job-postings/applied?page=1&page_size=1`,
                    validate: "object",
                  });
                  return getNumber(result);
                }}
                onInit={async (list: any) => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
