"use client";
import { Field } from "@/lib/components/form/Field";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { Form } from "@/lib/components/form/Form";
import { Popover } from "@/lib/components/Popover/Popover";
import BarChart from "@/lib/components/ui/bar";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { CardBetter } from "@/lib/components/ui/card";
import ProgressChart from "@/lib/components/ui/progress-chart";
import { Filter } from "@/lib/svg/Filter";
import { Refresh } from "@/lib/svg/Refresh";
import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { getNumber } from "@/lib/utils/getNumber";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect, useState } from "react";

function Page() {
  const [show, setShow] = useState(false as boolean);
  const local = useLocal({
    can_approve: false,
    recruitment_target: {
      count: 5000,
      percent: 70,
    },

    recruitment_realization: {
      count: 789,
      percent: 40,
    },
    billing: 90000,
    duration: [60, 80, 100, 50, 70, 60, 40],
    job_level: [
      {
        name: 1,
        value: 50,
      },
      {
        name: 3,
        value: 70,
      },
      {
        name: 4,
        value: 40,
      },
    ],
    job_level_max: 70,
    department: [
      {
        name: "HR",
        value: 50,
      },
      {
        name: "Finance",
        value: 70,
      },
      {
        name: "Estate",
        value: 40,
      },
    ],
    time_hire: 1531,
    filter: {},
    dashboard: {} as any,
    refresh: false,
    reload: async () => {
      await actionToast({
        task: async () => {
          local.dashboard = {};
          local.refresh = true;
          local.render();
          const result = await apix({
            port: "recruitment",
            value: "data.data",
            path: `/api/dashboard`,
            validate: "object",
          });
          local.dashboard = result;
          local.refresh = false;
          local.render();
        },
        failed: () => {
          local.refresh = false;
          local.render();
        },
        msg_error: "Failed to retrieve dashboard data",
        msg_load: "Loading dashboard data",
        msg_succes: "Dashboard data loaded successfully",
      });
    },
  });

  useEffect(() => {
    local.reload();
  }, []);

  return (
    <div className="flex p-4 flex-col flex-grow gap-y-2">
      <div className="flex flex-row py-4 pb-0 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Dashboard</span>
        </h2>
        <div className="flex-grow flex flex-row items-center justify-end gap-x-2">
          <Popover
            classNameTrigger={""}
            arrow={show}
            className="rounded-md"
            onOpenChange={(open: any) => {
              setShow(open);
            }}
            open={show}
            content={
              <div className="flex flex-col p-4 w-80 gap-y-1">
                {/* <div className="text-md font-semibold">Filter</div> */}

                <Form
                  toastMessage="Filter"
                  onSubmit={async (fm: any) => {
                    local.render();
                    setShow(false);
                  }}
                  onLoad={async () => {
                    return { ...local.filter };
                  }}
                  showResize={false}
                  header={(fm: any) => {
                    return <></>;
                  }}
                  children={(fm: any) => {
                    return (
                      <>
                        <div
                          className={cx("flex flex-col flex-wrap  rounded-sm")}
                        >
                          <div className="flex-grow grid gap-y-2">
                            <div>
                              <Field
                                fm={fm}
                                name={"recruitment_type"}
                                label={"Recruitment Type"}
                                required={true}
                                type={"dropdown-async"}
                                onLoad={async (param: any) => {
                                  const params = await events(
                                    "onload-param",
                                    param
                                  );
                                  const res: any = await apix({
                                    port: "recruitment",
                                    value: "data.data",
                                    path: `/api/recruitment-types${params}`,
                                    validate: "array",
                                  });
                                  return res;
                                }}
                                onLabel={"value"}
                                onValue={"value"}
                              />
                            </div>
                            <div className=" grid grid-cols-2 gap-2">
                              <Field
                                fm={fm}
                                name={"start_date"}
                                label={"Periode"}
                                type={"date"}
                                placeholder={`From`}
                              />
                              <Field
                                fm={fm}
                                name={"end_date"}
                                label={"Periode"}
                                type={"date"}
                                placeholder={`To`}
                                visibleLabel={true}
                              />
                            </div>{" "}
                            <div>
                              <Field
                                fm={fm}
                                target={"project_pic_id"}
                                name={"project_pic"}
                                label={"PIC"}
                                type={"dropdown-async"}
                                onLoad={async (param) => {
                                  const params = await events(
                                    "onload-param",
                                    param
                                  );
                                  const res: any = await apix({
                                    port: "portal",
                                    value: "data.data.employees",
                                    path: "/api/employees" + params,
                                    validate: "array",
                                  });
                                  return res;
                                }}
                                onLabel={"name"}
                                required={true}
                              />
                            </div>
                            <div>
                              <Field
                                fm={fm}
                                required={true}
                                name={"bilingual"}
                                label={"Skill Bilingual"}
                                type={"dropdown-async"}
                                pagination={false}
                                search="local"
                                onLoad={async () => {
                                  return [
                                    {
                                      value: "yes",
                                      label: "Bilingual",
                                    },
                                    {
                                      value: "no",
                                      label: "Non Bilingual",
                                    },
                                  ];
                                }}
                                onLabel={"label"}
                                onValue={"value"}
                              />
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-end py-2 w-full gap-x-2">
                            <ButtonBetter
                              className="rounded-full w-full px-6 "
                              variant={"outline"}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                fm.data = {};
                                fm.render();
                                fm.submit();
                              }}
                            >
                              Clear
                            </ButtonBetter>
                            <ButtonBetter className="rounded-full w-full px-6 ">
                              Apply
                            </ButtonBetter>
                          </div>
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            }
          >
            <ButtonContainer
              onClick={() => {
                setShow(true);
              }}
            >
              <Filter />
            </ButtonContainer>
          </Popover>
          <ButtonBetter
            onClick={async () => {
              local.reload();
            }}
          >
            <Refresh className={cx(local.refresh ? "animate-spin" : "")} />
          </ButtonBetter>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <CardBetter className="p-4 flex flex-col">
            <div className="flex flex-col flex-grow gap-y-2">
              <p className="text-linear-primary font-bold text-sm">
                Total Recruitment Target
              </p>
              <div className="flex-grow grid grid-cols-3">
                <div className="flex flex-row items-center text-2xl font-bold">
                  {formatMoney(
                    getNumber(
                      local?.dashboard?.total_recruitment_target
                        ?.total_recruitment_target
                    )
                  )}
                </div>
                <div className="col-span-2 flex flex-row items-center justify-end">
                  <ProgressChart
                    percentage={getNumber(
                      local?.dashboard?.total_recruitment_target?.percentage
                    )}
                    options={{
                      cutout: "70%",
                      plugins: {
                        tooltip: { enabled: false },
                        legend: { display: false },
                      },
                    }}
                    color="#313678"
                  />
                </div>
              </div>
            </div>
          </CardBetter>
          <CardBetter className="p-4 flex flex-col">
            <div className="flex flex-col flex-grow gap-y-2">
              <p className="text-linear-primary font-bold text-sm">
                Total Recruitment Realization
              </p>
              <div className="flex-grow grid grid-cols-3">
                <div className="flex flex-row items-center text-2xl font-bold">
                  {formatMoney(
                    getNumber(
                      local?.dashboard?.total_recruitment_realization
                        ?.total_recruitment_realization
                    )
                  )}
                </div>
                <div className="col-span-2 flex flex-row items-center justify-end">
                  <ProgressChart
                    percentage={getNumber(
                      local?.dashboard?.total_recruitment_realization
                        ?.percentage
                    )}
                    color="#313678"
                    options={{
                      cutout: "70%",
                      plugins: {
                        tooltip: { enabled: false },
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </CardBetter>
          <CardBetter className="p-4 flex flex-col">
            <div className="flex flex-col flex-grow gap-y-2">
              <p className="text-linear-primary font-bold text-sm">
                Bilingual / Non Bilingual
              </p>
              <div className="flex flex-grow text-2xl items-center font-bold">
                {formatMoney(
                  getNumber(local?.dashboard?.total_bilingual?.total_bilingual)
                )}{" "}
                /{" "}
                {formatMoney(
                  getNumber(
                    local?.dashboard?.total_bilingual?.total_non_bilingual
                  )
                )}
              </div>
            </div>
          </CardBetter>
        </div>

        <div className="bg-blue col-span-3 flex-grow  grid md:grid-cols-3 gap-4">
          <div className="flex flex-col flex-grow col-span-2 h-[250px] md:h-auto">
            <CardBetter className="col-span-2  p-4 flex flex-col h-full w-full">
              <div className="flex flex-col flex-grow gap-y-2">
                <p className="text-linear-primary font-bold text-sm">
                  Duration Recruitment
                </p>
                <div className="flex flex-grow relative">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <BarChart
                      data={{
                        labels:
                          local?.dashboard?.chart_duration_recruitment
                            ?.labels || [],
                        datasets: [
                          {
                            label: "Duration",
                            data:
                              local?.dashboard?.chart_duration_recruitment
                                ?.datasets || [],
                            backgroundColor: "#313678",
                            borderColor: "#313678",
                            borderRadius: Number.MAX_VALUE,
                            maxBarThickness: 20,
                          },
                        ],
                      }}
                      option={{
                        maintainAspectRatio: false,
                        responsive: true,
                        indexAxis: "y", // Membuat bar chart menjadi horizontal
                        plugins: {
                          legend: {
                            display: false,
                            position: "right",
                          },
                          title: {
                            display: false,
                            text: "Chart.js Horizontal Bar Chart",
                          },
                        },
                        scales: {
                          x: {
                            min: 0,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardBetter>
          </div>
          <div className="flex flex-col flex-grow col-span-2 md:col-span-1 h-[250px] md:h-auto">
            <CardBetter className="  p-4 flex flex-col  flex-grow">
              <div className="flex flex-col flex-grow gap-y-2">
                <p className="text-linear-primary font-bold text-sm">
                  Job Level
                </p>

                <div className="flex flex-grow relative">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <BarChart
                      data={{
                        labels: local?.dashboard?.chart_job_level?.labels || [],
                        datasets: [
                          {
                            label: "Job Level",
                            data:
                              local?.dashboard?.chart_job_level?.datasets || [],
                            backgroundColor: "#313678",
                            borderColor: "#313678",
                            borderRadius: Number.MAX_VALUE,
                            maxBarThickness: 20,
                          },
                        ],
                      }}
                      option={{
                        maintainAspectRatio: false,
                        responsive: true,
                        indexAxis: "x", // Membuat bar chart menjadi horizontal
                        plugins: {
                          legend: {
                            display: false,
                            position: "right",
                          },
                          title: {
                            display: false,
                            text: "Chart.js Horizontal Bar Chart",
                          },
                        },
                        scales: {
                          x: {
                            min: 0,
                            max: Math.max(
                              local?.dashboard?.chart_job_level?.datasets || []
                            ),
                          },
                          y: {
                            display: false, // Menghilangkan sumbu Y
                            grid: { display: false }, // Menghilangkan garis latar
                          },
                        },
                        elements: {
                          bar: {
                            borderRadius: 20, // Membuat bar lebih membulat
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardBetter>
          </div>
          <div className="flex flex-col flex-grow col-span-2 h-[250px] md:h-auto">
            <CardBetter className="  p-4 flex flex-col  flex-grow">
              <div className="flex flex-col flex-grow gap-y-2">
                <p className="text-linear-primary font-bold text-sm">
                  Department
                </p>

                <div className="flex flex-grow relative">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <BarChart
                      data={{
                        labels:
                          local?.dashboard?.chart_department?.labels || [],
                        datasets: [
                          {
                            label: "Department",
                            data:
                              local?.dashboard?.chart_department?.datasets ||
                              [],
                            backgroundColor: "#313678",
                            borderColor: "#313678",
                            borderRadius: Number.MAX_VALUE,
                            maxBarThickness: 20,
                          },
                        ],
                      }}
                      option={{
                        maintainAspectRatio: false,
                        responsive: true,
                        indexAxis: "x", // Membuat bar chart menjadi horizontal
                        plugins: {
                          legend: {
                            display: false,
                            position: "right",
                          },
                          title: {
                            display: false,
                            text: "Chart.js Horizontal Bar Chart",
                          },
                        },
                        scales: {
                          y: {
                            min: 0,
                            max: Math.max(
                              local?.dashboard?.chart_department?.datasets
                            ),
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardBetter>
          </div>
          <div className="flex flex-col flex-grow col-span-2 md:col-span-1 h-[250px] md:h-auto">
            <CardBetter className="  p-4 flex flex-col  flex-grow">
              <div className="flex flex-col flex-grow gap-y-2">
                <p className="text-linear-primary font-bold text-sm">
                  Avg. Time to Hire
                </p>

                <div className="flex flex-grow relative">
                  <div className="absolute top-0 left-0 w-full h-full flex flex-grow text-2xl justify-center items-center font-bold">
                    {formatMoney(
                      getNumber(
                        local?.dashboard?.avg_time_to_hire?.avg_time_to_hire
                      )
                    )}{" "}
                    Days
                  </div>
                </div>
              </div>
            </CardBetter>
          </div>

          {/* 
          <CardBetter className="p-4 flex flex-col  flex-grow">
            <div className="flex flex-col flex-grow gap-y-2">
              <p className="text-linear-primary font-bold text-sm">
                Avg. Time to Hire
              </p>
            </div>
          </CardBetter> */}
        </div>
      </div>
    </div>
  );
}
export default Page;
