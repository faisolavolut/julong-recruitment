"use client";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocal } from "@/lib/utils/use-local";
import ServerErrorPage from "../lib/components/comp/500";
import DefaultHeaderNavigation from "./components/navbarHeader";
import { siteurl } from "@/lib/utils/siteurl";
import { Form } from "@/lib/components/form/Form";
import { Field } from "@/lib/components/form/Field";
import { ButtonBetter } from "@/lib/components/ui/button";
import { IoIosSearch } from "react-icons/io";
import JobCard from "./components/JobCard";
import { PinterestLayout } from "@/lib/components/ui/PinterestLayout";
import FlowbiteFooterSection from "./components/flowbite-footer";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import TestimonialsCard from "./components/testimoni";
import { apix } from "@/lib/utils/apix";

function HomePage() {
  const router = useRouter();
  const local = useLocal({
    ready: false,
    access: true,
    jobs: [] as any[],
  });
  useEffect(() => {
    const run = async () => {
      const res = await apix({
        port: "recruitment",
        value: "data.data",
        path: "/api/job-postings",
        method: "get",
      });
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
          "h-64 relative mb-8",
          css`
            background-image: url("${siteurl("/office.png")}");
          `
        )}
      >
        <div className="absolute bottom-[-25px] w-full flex flex-row justify-center items-center px-32">
          <div className="flex flex-grow bg-white shadow-md rounded-md">
            <div className="flex flex-grow">
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
                              name={"recommended_by"}
                              label={"Recommend by"}
                              type={"text"}
                              hidden_label={true}
                              placeholder="Job, title or keywords"
                            />
                          </div>

                          <div>
                            <Field
                              fm={fm}
                              name={"recommended_by"}
                              label={"Recommend by"}
                              type={"text"}
                              hidden_label={true}
                              placeholder="Location"
                            />
                          </div>
                        </div>
                        <div className="flex flex-row items-center">
                          <ButtonBetter>
                            <IoIosSearch />
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
      </div>
      <div className="relative flex flex-col flex-grow">
        <div className="flex-grow flex flex-col p-8 ">
          <div className="flex flex-row items-center justify-between pb-4">
            <p className="font-bold text-3xl">Featured Jobs</p>
            <Link
              href="/all-jobs"
              className="flex flex-row items-center gap-x-2 font-bold text-blue-500"
            >
              Show all jobs <FaArrowRight />
            </Link>
          </div>
          <div className="flex flex-grow">
            <PinterestLayout
              gap={4}
              data={[1, 2, 3, 4, 1, 2, 3, 4]}
              child={() => {
                return <JobCard />;
              }}
              col={4}
            />
          </div>
        </div>
        <div className="flex-grow flex flex-col p-8 ">
          <div className="flex flex-row items-center justify-center pb-4">
            <p className="font-bold text-3xl">Testimonials</p>
          </div>
          <div className="flex flex-grow">
            <PinterestLayout
              gap={4}
              data={[
                {
                  title: "Bapak",
                  testimoni: `"Website ini tuh kayak wingman terbaik buat cari kerja! Tadinya aku ngira bakal ribet dan harus ngirim lamaran ke sana-sini, tapi ternyata semuanya bisa dilakuin dalam satu platform ini. Fiturnya lengkap banget—mulai dari filter pekerjaan sampai tips buat wawancara. Nggak nyangka, akhirnya aku dapet kerjaan impian berkat website ini. Kayak dapet jodoh, tapi versi karier. Pokoknya, thank you banget, ya!"`,
                },

                {
                  title: "Ibu",
                  testimoni: `"Gara-gara website ini, aku jadi kayak HR pribadi buat diriku sendiri. Tinggal klik sana-sini, udah dapet list pekerjaan yang pas banget sama skill. Thanks banget, sekarang aku jadi bisa bilang, 'Bye, pengangguran!”`,
                },
                {
                  title: "Adik",
                  testimoni: `"Sumpah, ini website penyelamat hidup! Pekerjaan impian sekarang cuma sejauh scroll dan klik. Aku nggak tahu harus bilang apa lagi selain 'mantap betul!'”`,
                },
                {
                  title: "Kakak",
                  testimoni: `"Fix, ini Tinder buat cari kerja. Swipe-swipe, dapet kerja!”`,
                },
                {
                  title: "Agak Laen Sekeluarga",
                  testimoni: `"Website ini bikin nyari kerjaan jadi lebih gampang daripada nyari pasangan. Fix suka!”`,
                },
                {
                  title: "Horor",
                  testimoni: `"Aku dapet kerjaan horor jaga kuburan.”`,
                },
              ]}
              child={(item, idx, data, key) => {
                return (
                  <div key={key}>
                    <TestimonialsCard
                      title={item?.title}
                      data={`${item?.testimoni}`}
                    />
                  </div>
                );
              }}
              col={3}
            />
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
