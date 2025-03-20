"use client";

import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { getParams } from "@/lib/utils/get-params";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const id_parent = getParams("id");
  const id = getParams("id_setup");
  const labelPage = "Document Setup";
  const urlPage = `/d/master-data/question/${id_parent}/view`;
  const local = useLocal({
    can_add: false,
    can_edit: false,
    roles: null as any,
    ready: false as boolean,
    data: null as any,
  });
  useEffect(() => {
    const run = async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: "/api/template-questions/" + id_parent,
        validate: "object",
      });
      local.data = data;
      local.can_add = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);
  if (local.ready && !local.can_add) return notFound();
  return (
    <FormBetter
      mode="view"
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full flex-wrap">
            <div className="flex flex-col py-4 pt-0 pb-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="">{labelPage}</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: `List Template`,
                    url: `/d/master-data/question`,
                  },
                  {
                    title: `${local?.data?.name}`,
                    url: urlPage,
                  },
                  {
                    title: "Detail",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center"></div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-setup/update",
          method: "put",
          data: {
            ...fm.data,
          },
        });
      }}
      onLoad={async () => {
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-setup/" + id,
          validate: "object",
        });
        return {
          ...data,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"title"}
                    label={"Title Document"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"document_type_id"}
                    label={"Document Type"}
                    type={"dropdown"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/document-types",
                        validate: "dropdown",
                        keys: {
                          label: (item: any) => {
                            switch (get(item, "name")) {
                              case "ADMINISTRATIVE_SELECTION":
                                return "Administrative";
                                break;
                              case "TEST":
                                return "Test";
                                break;
                              case "INTERVIEW":
                                return "Interview";
                                break;
                              case "FGD":
                                return "FGD";
                                break;
                              case "SURAT_PENGANTAR_MASUK":
                                return "Surat Pengantar Masuk";
                                break;
                              case "SURAT_IZIN_ORANG_TUA":
                                return "Surat Izin Orang Tua";
                                break;
                              case "FINAL_INTERVIEW":
                                return "Final Interview";
                                break;

                              case "KARYAWAN_TETAP":
                                return "Karyawan Tetap";
                              case "OFFERING_LETTER":
                                return "Offering Letter";
                                break;

                              case "CONTRACT_DOCUMENT":
                                return "Contract Document";
                                break;

                              case "DOCUMENT_CHECKING":
                                return "Document Checking";
                                break;

                              default:
                                return get(item, "name");
                            }
                          },
                        },
                      });
                      return res;
                    }}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"recruitment_type"}
                    label={"Recruitment Type"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onLoad={async () => {
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: "/api/recruitment-types",
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={"value"}
                    onValue={"value"}
                  />
                </div>

                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"header"}
                    label={"Header"}
                    type={"richtext"}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"body"}
                    label={"Body"}
                    type={"richtext"}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    fm={fm}
                    name={"footer"}
                    label={"Footer"}
                    type={"richtext"}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

export default Page;
