"use client";
import { getParams } from "@/lib/utils/get-params";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { notFound } from "next/navigation";
import { useEffect } from "react";

function Home() {
  const id = getParams("id");
  const labelPage = "Contract Document";
  const urlPage = "/d/contract-document/contract-document";
  const local = useLocal({
    can_edit: false,
    ready: false as boolean,
    data: null as any,
    detail: null as any,
  });

  useEffect(() => {
    const run = async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/document-sending/${id}`,
        validate: "object",
      });

      const detail = `<html>
  <body>
    halooo
  </body>
</html>
`;
      const res = await apix({
        port: "public",
        method: "post",
        value: "data",
        options: {
          responseType: "blob",
          headers: {
            Accept: "application/pdf", // Memastikan format yang benar
          },
        },
        data: {
          htmlContent: detail,
        },
        path: `/api/pdf`,
      });
      const url = URL.createObjectURL(res);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export-applicant.pdf");
      document.body.appendChild(link);
      link.click();
      console.log({ url });
      local.data = data;
      local.can_edit = true;
      local.ready = true;
      local.render();
      console.log(local.detail);
    };
    run();
  }, []);
  const fixHtmlTags = (html: any) => {
    return html
      .replace(/<TEXT/g, "<Text")
      .replace(/<\/TEXT>/g, "</Text")
      .replace(/<VIEW/g, "<View")
      .replace(/<\/VIEW>/g, "</View")
      .replace(/<DOCUMENT/g, "<Document")
      .replace(/<\/DOCUMENT>/g, "</Document>")
      .replace(/<PAGE/g, "<Page")
      .replace(/<\/PAGE>/g, "</Page>");
  };
  if (local.ready && !local.can_edit) return notFound();

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 pt-0">
        <h2 className="text-xl font-semibold text-gray-900 ">
          <span className="">Manpower Planning Request</span>
        </h2>
        <BreadcrumbBetterLink
          data={[
            {
              title: "List Manpower Request",
              url: "/d/mpr-ceo",
            },
            {
              title: "Detail",
            },
          ]}
        />
      </div>
      <div className="w-full flex flex-row flex-grow bg-white rounded-lg  overflow-hidden border border-gray-300">
        <div className="flex flex-grow flex-col">
          <div
            className={cx(
              true ? "bg-[#525659]" : "bg-[#b8b8b8]",
              "flex relative flex-grow  overflow-y-scroll flex-col items-center relative"
            )}
          >
            {local.detail ? <></> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
