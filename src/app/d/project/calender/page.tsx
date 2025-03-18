"use client";
import { CalenderGoogle } from "@/lib/components/ui/CalenderGoogle";
import { apix } from "@/lib/utils/apix";
import { getRandomHexColor } from "@/lib/utils/colorHelper";
import { formatDay } from "@/lib/utils/date";
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
          <div className={cx("flex-grow flex flex-col h-full w-full")}>
            <CalenderGoogle
              events={local.data}
              onLoad={async (date) => {
                const params = await events("onload-param", {
                  month: formatDay(date, "M"),
                  year: formatDay(date, "YYYY"),
                });
                let result = await apix({
                  port: "recruitment",
                  path: "/api/project-recruitment-lines/calendar" + params,
                  value: "data.data",
                  validate: "array",
                });
                result = result?.length
                  ? result.map((e: any) => {
                      return {
                        title: e?.template_activity_line?.name,
                        start: e?.start_date,
                        end: e?.end_date,
                        allDay: true,
                        color:
                          e?.template_activity_line?.color_hex_code ||
                          getRandomHexColor(),
                        extendedProps: e,
                      };
                    })
                  : [];
                return result;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
