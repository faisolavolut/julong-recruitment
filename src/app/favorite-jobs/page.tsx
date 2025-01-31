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
          path: "/api/job-postings/saved?page=1&page_size=15&status=IN PROGRESS",
          method: "get",
        });

        const count = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: "/api/job-postings/saved?page=1&page_size=8&status=IN PROGRESS",
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
    <div className="flex flex-col max-w-screen bg-white">
      <DefaultHeaderNavigation />
      <div className="relative flex flex-col flex-grow">
        <div className="flex flex-col justify-center items-center">
          <div className="flex-grow grid grid-cols-5 p-8 max-w-screen-xl w-full">
            <div className="flex-grow flex flex-col p-8 col-span-5 pt-0">
              <div className="flex flex-row items-center pb-4  w-full">
                <p className="font-bold text-3xl">
                  Favorite Jobs ({getNumber(local?.count)})
                </p>
              </div>
              <div className="flex flex-grow pb-4">
                <PinterestLayout
                  gap={8}
                  data={local.data}
                  child={(item, idx, data, key) => {
                    return <JobCard data={item} />;
                  }}
                  col={4}
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
    </div>
  );
}

export default HomePage;
