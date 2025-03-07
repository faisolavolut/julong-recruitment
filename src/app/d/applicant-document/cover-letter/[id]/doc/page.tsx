"use client";
import { getParams } from "@/lib/utils/get-params";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { PDFViewer } from "@/lib/components/export";

function Home() {
  const id = getParams("id");
  const labelPage = "Cover Letter";
  const urlPage = "/d/applicant-document/cover-letter";
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    data: null as any,
    detail: null as any,
    url: null as any,
  });

  useEffect(() => {
    const run = async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/document-sending/${id}`,
        validate: "object",
      });

      const detail = `
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
          html: data.detail_content,
        },
        path: `/api/document-sending/generate-pdf`,
      });
      const url = URL.createObjectURL(res);
      local.url = url;
      local.data = data;
      local.can_edit = true;
      local.ready = true;
      local.render();
      console.log(local.url);
    };
    run();
  }, []);
  if (local.ready && !local.can_edit) return notFound();

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">{labelPage}</span>
        </h2>
        <BreadcrumbBetterLink
          data={[
            {
              title: "List " + labelPage,
              url: urlPage,
            },
            {
              title: "Detail",
              url: `${urlPage}/${id}/edit`,
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
