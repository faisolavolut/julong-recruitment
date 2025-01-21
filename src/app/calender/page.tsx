"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import CalenderFull from "@/lib/components/ui/CalenderFull";
import { shortDate } from "@/lib/utils/date";
import get from "lodash.get";
import { getNumber } from "@/lib/utils/getNumber";
import {
  useEditor,
  EditorContent,
  useCurrentEditor,
  EditorProvider,
} from "@tiptap/react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Popover } from "@/lib/components/Popover/Popover";
import { Input } from "@/lib/components/ui/input";
import { ButtonBetter } from "@/lib/components/ui/button";
function Portal() {
  const local = useLocal({
    ready: false,
    access: true,
    data: null as any,
    open: false,
  });
  useEffect(() => {}, []);
  return (
    <>
      <div className="relative flex flex-col h-screen w-screen">
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
            <CalenderFull
              disabled={false}
              onMark={(day, date, data) => {
                // console.log({ day, date, data });
                if (get(local, "data.length")) {
                  const yourDay = local.data.find(
                    (e: any) => shortDate(get(e, "date")) === shortDate(date)
                  );
                  if (get(yourDay, "event.length")) {
                    const events = get(yourDay, "eventWeeks");
                    const allEvent = get(yourDay, "event");
                    let showEvent = [];
                    let isMore = false;
                    const showMoreCount = allEvent.filter((e: any) => !e.show);
                    if (showMoreCount.length) {
                      showEvent = events.find((e: any) => e.idx === 0)
                        ? [events.find((e: any) => e.idx === 0)]
                        : [];
                      isMore = true;
                    } else {
                      showEvent = events;
                    }
                    if (!showEvent?.length && isMore) {
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
                                    width: ${data.width * get(e, "count") +
                                    (get(e, "count") === 7 ? 8 : 0)}px;
                                    top: ${(e?.idx - 1) * 27}px;
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
                ];
                const mapEventsByDate = (data: any) => {
                  const events = data.data;
                  const calendarTimes = [
                    ...get(data, "value.calender.time.previous"),
                    ...get(data, "value.calender.time.current"),
                    ...get(data, "value.calender.time.next"),
                  ];
                  const result = [] as any[];
                  calendarTimes.reduce((acc: any, dateStr: any, index) => {
                    const date = new Date(dateStr);
                    const weekStart = new Date(date);
                    const day = weekStart.getDay();
                    const formattedDate = shortDate(date);
                    weekStart.setDate(weekStart.getDate() - day); // Go back to Sunday
                    const formattedWeekStart = shortDate(weekStart);
                    result.push({
                      date: date,
                      eventLabel: [],
                      eventWeeksLabel: [],
                      event: [],
                      eventWeeks: [],
                      data: {
                        date: formattedDate,
                        week: formattedWeekStart,
                      },
                    });

                    events.map((event: any) => {
                      const startDate = new Date(event.startDate);
                      const endDate = event.endDate
                        ? new Date(event.endDate)
                        : startDate;

                      if (date >= startDate && date <= endDate) {
                        result[index].event.push({
                          ...event,
                          count: 1,
                          show: true,
                        });
                        result[index].eventLabel.push(event.name);
                        if (event) {
                          const weeksDays = result.filter(
                            (e) => get(e, "data.week") === formattedWeekStart
                          );
                          const yourDay = result.find(
                            (e: any) => get(e, "data.date") === formattedDate
                          );
                          if (!get(weeksDays, "length")) {
                            result[index].eventWeeksLabel.push(event.name);
                            result[index].eventWeeks.push({
                              ...event,
                              count: 1,
                              show: true,
                              idx: getNumber(get(yourDay, "event.length")),
                            });
                          } else {
                            const findFirstEvent = weeksDays.find((e) =>
                              e?.eventWeeks?.find(
                                (ex: any) => ex?.id === event?.id
                              )
                            );
                            if (formattedDate === "31/12/2024") {
                              console.log({ weeksDays, yourDay });
                            }
                            if (!findFirstEvent) {
                              result[index].eventWeeksLabel.push(event.name);
                              result[index].eventWeeks.push({
                                ...event,
                                count: 1,
                                idx: getNumber(get(yourDay, "event.length")),
                                show: true,
                              });
                            } else {
                              const yourEvent = findFirstEvent.eventWeeks.find(
                                (e: any) => e?.id === event?.id
                              );
                              if (yourEvent) {
                                yourEvent.count =
                                  getNumber(get(yourEvent, "count")) + 1;
                              }
                            }
                          }
                        }
                      }
                    });

                    return acc;
                  }, {});

                  const dayEvent = result.filter((e) =>
                    get(e, "eventWeeks.length")
                  );
                  dayEvent.map((e) => {
                    const eventDay = e.event;
                    eventDay.map((event: any) => {
                      const weeksDays = result.filter(
                        (ex) =>
                          get(ex, "data.week") === get(e, "data.week") &&
                          ex.event.find(
                            (el: any) => get(el, "id") === get(event, "id")
                          )
                      );
                      const firstDay = result.find(
                        (ex) =>
                          get(ex, "data.week") === get(e, "data.week") &&
                          ex.eventWeeks.find(
                            (el: any) => get(el, "id") === get(event, "id")
                          )
                      );
                      if (weeksDays && get(firstDay, "event.length") > 2) {
                      }
                      event.count = weeksDays.length;
                    });

                    const sortEvent = eventDay.sort(
                      (a: any, b: any) => b.count - a.count
                    );
                    const eventWeeks = e.eventWeeks;
                    eventWeeks.map((e: any) => {
                      const findEvent = sortEvent.find(
                        (ex: any) => get(ex, "id") === get(e, "id")
                      );
                      if (findEvent) {
                        const index = sortEvent.findIndex(
                          (ex: any) => get(ex, "id") === get(e, "id")
                        );
                        e.idx = index + 1;
                      }
                    });
                  });
                  result.map((e) => {
                    const eventDay = e.event;
                    eventDay.map((event: any) => {
                      const firstDay = result.find(
                        (ex) =>
                          get(ex, "data.week") === get(e, "data.week") &&
                          ex.eventWeeks.find(
                            (el: any) => get(el, "id") === get(event, "id")
                          )
                      );
                      if (get(firstDay, "event.length") > 2) {
                        const eventWeeks = firstDay.eventWeeks.find(
                          (e: any) => get(e, "id") === event?.id
                        );
                        if (e.data.date === "01/01/2025") {
                          console.log({ eventWeeks });
                        }
                        event.show = eventWeeks.idx === 0;
                      }
                    });
                  });
                  return result;
                };
                console.log(
                  mapEventsByDate({
                    data: data,
                    value,
                  })
                );
                local.data = mapEventsByDate({
                  data: data,
                  value,
                });
                local.render();
              }}
              onChange={async (value: any) => {}}
              value={null}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Portal;
