"use client";
import { CalenderGoogle } from "@/lib/components/ui/CalenderGoogle";
import { getAccess, userRoleMe } from "@/lib/utils/getAccess";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
    access: true,
    open: false,
    limitEvent: 1,
    data: [] as any[],
  });

  useEffect(() => {
    const run = async () => {
      const roles = await userRoleMe();
      local.can_add = getAccess("create-document-checking", roles);
      local.can_edit = getAccess("edit-document-checking", roles);
      local.data = [
        {
          title: "Jalan-Jalan Ke Jakarta",
          start: "2025-02-25T09:00:00",
          end: "2025-03-18T10:30:00",
          allDay: true,
          color: "#2E4057",
          extendedProps: { id: 1 },
        },
        {
          title: "Testing Dulu Biar Lancar",
          start: "2025-02-25T09:00:00",
          end: "2025-02-27T09:30:00",
          allDay: true,
          color: "#DA4167",
          extendedProps: { id: 1 },
        },
        {
          title: "Project Kickoff",
          start: "2025-02-25T09:00:00",
          end: "2025-02-25T10:30:00",
          allDay: true,
          color: "#4caf50",
          extendedProps: { id: 1 },
        },
        {
          title: "Lunch Break",
          start: "2025-02-26T12:00:00",
          allDay: true,
          color: "#ff5722",
          extendedProps: { id: 2 },
        },
        {
          title: "Client Meeting",
          start: "2025-02-24T14:00:00",
          end: "2025-02-24T15:30:00",
          allDay: true,
          color: "#3f51b5",
          extendedProps: { id: 3 },
        },
        {
          title: "Marketing Strategy",
          start: "2025-02-27T10:00:00",
          end: "2025-02-27T11:30:00",
          allDay: true,
          color: "#009688",
          extendedProps: { id: 4 },
        },
        {
          title: "Workshop: Leadership Skills",
          start: "2025-02-28T09:00:00",
          end: "2025-02-28T12:00:00",
          allDay: true,
          color: "#ff9800",
          extendedProps: { id: 5 },
        },
        {
          title: "Team Building Event",
          start: "2025-03-01T13:00:00",
          end: "2025-03-01T17:00:00",
          allDay: true,
          color: "#e91e63",
          extendedProps: { id: 6 },
        },
        {
          title: "Quarterly Review",
          start: "2025-03-02T10:00:00",
          end: "2025-03-02T12:00:00",
          allDay: true,
          color: "#795548",
          extendedProps: { id: 7 },
        },
        {
          title: "Tech Training Session",
          start: "2025-03-03T14:00:00",
          end: "2025-03-03T16:00:00",
          allDay: true,
          color: "#673ab7",
          extendedProps: { id: 8 },
        },
        {
          title: "Product Launch Meeting",
          start: "2025-03-04T09:30:00",
          end: "2025-03-04T11:00:00",
          allDay: true,
          color: "#ffeb3b",
          extendedProps: { id: 9 },
        },
        {
          title: "Networking Event",
          start: "2025-03-05T18:00:00",
          end: "2025-03-05T21:00:00",
          allDay: true,
          color: "#9c27b0",
          extendedProps: { id: 10 },
        },
        {
          title: "HR Policy Review",
          start: "2025-03-06T15:00:00",
          end: "2025-03-06T16:30:00",
          allDay: true,
          color: "#607d8b",
          extendedProps: { id: 11 },
        },
        {
          title: "Budget Planning Session",
          start: "2025-03-07T10:00:00",
          end: "2025-03-07T12:00:00",
          allDay: true,
          color: "#f44336",
          extendedProps: { id: 12 },
        },
        {
          title: "Weekly Sync-Up",
          start: "2025-03-08T09:00:00",
          end: "2025-03-08T10:00:00",
          allDay: true,
          color: "#8bc34a",
          extendedProps: { id: 13 },
        },
        {
          title: "Customer Feedback Analysis",
          start: "2025-03-09T14:30:00",
          end: "2025-03-09T16:30:00",
          allDay: true,
          color: "#03a9f4",
          extendedProps: { id: 14 },
        },
        {
          title: "Board Meeting",
          start: "2025-03-10T10:00:00",
          end: "2025-03-10T12:00:00",
          allDay: true,
          color: "#cddc39",
          extendedProps: { id: 15 },
        },
      ];

      local.render();
    };
    run();
  }, []);
  return (
    <div className="flex flex-col flex-grow bg-white rounded-lg border border-gray-300 shadow-md shadow-gray-300">
      <div className="flex flex-col py-4 px-4 pb-0">
        <h2 className="text-lg font-semibold text-gray-900 ">
          <span className="">Calender Project</span>
        </h2>
      </div>
      <div className="w-full flex flex-row flex-grow bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className={cx(
              "flex-grow flex flex-col h-full w-full",
              css`
                .calender {
                  width: 100% !important;
                  display: flex;
                  flex-direction: column;
                }
                .calender-body {
                  flex-grow: 1;
                  display: flex;
                  flex-direction: column;
                }
                .calender-days {
                  flex-grow: 1;
                  row-gap: 0;
                }
                .calender-grid {
                  width: 100%;
                  height: 100%;
                  border-style: solid;
                  border-top-width: 1px;
                  border-bottom-width: 1px;
                  border-right-width: 1px;
                }
                .calender-day-wrap {
                  padding: 0.25rem;
                }
                .calender-grid:nth-child(7n + 1) {
                  border-left-width: 1px;
                  border-right-width: 0;
                }
                .calender-grid:nth-child(7n + 2) {
                  border-left-width: 1px;
                }
                .calender-grid:nth-child(7n) {
                  border-right-width: 1px;
                  border-left-width: 0;
                }
                .calender-grid:nth-child(n + 8):nth-child(-n + 42) {
                  border-top: 0; /* Atau bisa juga gunakan 'none' */
                }
              `
            )}
          >
            <CalenderGoogle events={local.data} />
            {/* <CalenderFull
              disabled={false}
              onMark={(day, date, data) => {
                // console.log({ data });
                if (get(local, "data.length")) {
                  const yourDay = local.data.find(
                    (e: any) => shortDate(get(e, "date")) === shortDate(date)
                  );
                  if (get(yourDay, "event.length")) {
                    const events = get(yourDay, "eventWeeks");
                    const allEvent = get(yourDay, "event");
                    let showEvent = [];
                    let isMore = false;
                    let showMoreCount = allEvent.filter((e: any) => !e.show);
                    // console.log(getNumber(data?.maxItem) <= 0);
                    if (getNumber(data?.maxItem) <= 0) {
                      isMore = true;
                      showMoreCount = allEvent;
                    } else if (showMoreCount.length) {
                      const firstEvent: any = events
                        .filter((e: any) => e.show)
                        .reduce(
                          (min: any, e: any) => (e.idx < min.idx ? e : min),
                          events[0]
                        );
                      if (firstEvent && firstEvent?.show) {
                        showEvent.push(firstEvent);
                      }
                      isMore = true;
                    } else {
                      showEvent = events;
                    }
                    if (getNumber(data?.maxItem) <= 0) {
                      return (
                        <>
                          <div
                            className={cx(
                              "hover:bg-gray-200 font-bold text-sm text-black px-2 absolute top-[27px] left-0 rounded-md",
                              css`
                                width: ${data.width - 10}px;
                                top: 0px;
                                z-index: 1;
                              `
                            )}
                          >
                            {showMoreCount?.length} more
                          </div>
                        </>
                      );
                    } else if (!showEvent?.length && isMore) {
                      return (
                        <>
                          <div
                            className={cx(
                              "hover:bg-gray-200 font-bold text-sm text-black px-2 absolute top-[27px] left-0 rounded-md",
                              css`
                                width: ${data.width - 10}px;
                                top: 27px;
                                z-index: 1;
                              `
                            )}
                          >
                            {showMoreCount?.length} more
                          </div>
                        </>
                      );
                    } else if (showEvent?.length) {
                      return (
                        <>
                          {showEvent.map((e: any, idx: any) => {
                            return (
                              <div
                                key={
                                  "day-event_" +
                                  get(yourDay, "data.date") +
                                  "_" +
                                  idx
                                }
                                className={cx(
                                  `hover:bg-blue-600 font-bold text-sm text-white px-2 absolute left-0 bg-blue-500 rounded-md`,
                                  css`
                                    width: ${data.width * get(e, "count") -
                                    10}px;
                                    top: 0px;
                                    z-index: 1;
                                  `
                                )}
                              >
                                {e?.name}
                              </div>
                            );
                          })}
                          {isMore && (
                            <div
                              className={cx(
                                "hover:bg-gray-200 font-bold text-sm text-black px-2 absolute top-[27px] left-0 w-[196px] rounded-md",
                                css`
                                  width: ${data.width}px;
                                  top: 27px;
                                  z-index: 1;
                                `
                              )}
                            >
                              {showMoreCount?.length} more
                            </div>
                          )}
                        </>
                      );
                    }
                  }
                }
                return <></>;
              }}
              style="custom"
              displayFormat="DD MMM YYYY"
              mode={"daily"}
              maxDate={null}
              minDate={null}
              asSingle={true}
              useRange={false}
              onLoad={async (value: any) => {
                const data = [
                  {
                    id: 1,
                    name: "Checkup",
                    startDate: new Date(2024, 11, 31),
                  },
                  {
                    id: 2,
                    name: "Persiapan SBMPTN",
                    startDate: new Date(2024, 11, 29),
                    endDate: new Date(2025, 0, 7),
                  },
                  {
                    id: 3,
                    name: "Wawancara",
                    startDate: new Date(2024, 11, 31),
                    endDate: new Date(2025, 0, 9),
                  },
                  {
                    id: 4,
                    name: "Wawancara 2",
                    startDate: new Date(2025, 0, 10),
                    endDate: new Date(2025, 0, 10),
                  },
                  {
                    id: 5,
                    name: "Tour ke bali",
                    startDate: new Date(2025, 0, 10),
                    endDate: new Date(2025, 0, 11),
                  },
                  {
                    id: 6,
                    name: "Meet Online",
                    startDate: new Date(2025, 0, 11),
                    endDate: new Date(2025, 0, 11),
                  },
                ];
                local.data = mapEventsByDate({
                  data: data,
                  value,
                });
                local.render();
              }}
              onChange={async (value: any) => {}}
              value={null}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
