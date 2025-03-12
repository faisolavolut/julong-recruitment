"use client";
import { getParams } from "@/lib/utils/get-params";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { PDFViewer } from "@/lib/components/export";

function Home() {
  const id = getParams("id");
  const labelPage = "Letterhead";
  const urlPage = "/d/master-data/letterhead";
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    data: null as any,
    detail: null as any,
    url: null as any,
  });

  useEffect(() => {
    const run = async () => {
      const content = `
      <div style="display: flex; flex-direction: column;background: red">
      <div style="text-align: center;">
        <img src="https://julong-recruitment.avolut.com/kop-surat.png" alt="Kop Surat" style="width: 1000px; height: 200px;">
      </div>
      <div style="width: 100%; border-bottom: 3px solid black; "></div>
      </div>
      `;
      const res = await apix({
        port: "recruitment",
        method: "post",
        value: "data",
        options: {
          responseType: "blob",
          headers: {
            Accept: "application/pdf", // Memastikan format yang benar
          },
        },
        data: {
          html: content,
        },
        path: `/api/document-sending/generate-pdf`,
      });
      const url = URL.createObjectURL(res);
      local.url = url;
      local.can_edit = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Letterhead</span>
        </h2>
        <BreadcrumbBetterLink
          data={[
            {
              title: "List Letterhead",
              url: "/d/master-data/letterhead",
            },
            {
              title: "Detail",
              url: "/d/master-data/letterhead/" + id + "/edit",
            },
            {
              title: "PDF",
            },
          ]}
        />
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden border border-gray-300">
        <div className="flex flex-grow flex-col">
          <div
            className={cx(
              true ? "bg-[#525659]" : "bg-[#b8b8b8]",
              "flex relative flex-grow  overflow-hidden flex-col items-center relative"
            )}
          >
            <div className="absolute top-0 left-0 w-full h-full">
              {local.url ? <PDFViewer url={local.url} /> : <></>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
