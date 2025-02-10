"use client";
import { useEffect, useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { Form } from "@/lib/components/form/Form";
import { Field } from "@/lib/components/form/Field";
import { apix } from "@/lib/utils/apix";
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
          }job-postings?page=1&page_size=15&status=IN PROGRESS`,
          method: "get",
        });

        const count = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api${
            get_user("id") ? `/` : `/no-auth/`
          }job-postings?page=1&page_size=8&status=IN PROGRESS`,
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
      <div
        className={cx(
          "h-screen relative mb-8 flex flex-row items-center justify-center bg-primary"
        )}
      >
        <div className="flex flex-grow max-w-screen-xl justify-center">
          <div className="flex  w-3/4 bg-gradient-white shadow-md rounded-md ">
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
                            unique={false}
                            name={"recommended_by"}
                            label={"Recommend by"}
                            type={"multi-dropdown"}
                            onLoad={async () => {
                              function generateDummyData(count: number) {
                                return Array.from(
                                  { length: count },
                                  (_, i) => ({
                                    label: `${i + 1}`,
                                    value: i + 1,
                                  })
                                );
                              }
                              return generateDummyData(50);
                            }}
                          />
                        </div>
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
  );
}

export default HomePage;
