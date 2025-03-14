"use client";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { apix } from "@/lib/utils/apix";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect, useState } from "react";
import { getParams } from "@/lib/utils/get-params";
import { access } from "@/lib/utils/getAccess";
import notFound from "@/app/not-found";
import { DocumentBiodata } from "@/lib/components/ui/DocumentBiodata";
import { Loader2 } from "lucide-react";

function Page() {
  const id = getParams("id_user");
  const id_parent = getParams("id");
  const labelPage = "Candidate";
  const urlPage = `/d/test-selection/schedule-test/${id_parent}/view`;
  const local = useLocal({
    can_approve: false,
    view: true,
    ready: false as boolean,
  });

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const run = async () => {
      local.can_approve = access("approval-applicant-document-selection");
      local.view = access("view-profile-applicant");
      local.ready = true;
      local.render();
    };
    run();
  }, []);

  if (!local.view) return notFound();

  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full">
            <div className="flex flex-col py-4 pt-0 pb-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="">{labelPage}</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: `List Schedule Test`,
                    url: "/d/administrative/selection-setup",
                  },
                  {
                    title: `List ${labelPage}`,
                    url: urlPage,
                  },
                  {
                    title: "view",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center"></div>
          </div>
        );
      }}
      disabledScroll={true}
      onSubmit={async (fm: any) => {}}
      onLoad={async () => {
        // sekedar testing data, nanti dihapus jika sudah ada
        const data: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/user-profiles/${id}`,
          validate: "object",
        });
        return {
          ...data,
          email: data?.user?.email,
          address: data?.user?.address,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      mode="view"
      children={(fm: any) => {
        return (
          <>
            <div className={"flex flex-col flex-grow h-full flex-wrap"}>
              <div className="flex flex-grow flex-col">
                <div
                  className={cx(
                    isReady ? "bg-[#525659]" : "bg-[#b8b8b8]",
                    "flex relative flex-grow  overflow-y-scroll flex-col items-center relative"
                  )}
                >
                  {!isReady && (
                    <div
                      className={cx(
                        "absolute flex flex-col items-center justify-center",
                        css`
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                        `
                      )}
                    >
                      <div className="flex flex-col items-center justify-center bg-white p-4 w-48 rounded-md shadow-md">
                        <p className="text-center text-sm mb-2">
                          Please wait while the document is loading.
                        </p>
                        <Loader2 className={cx("h-8 w-8 animate-spin")} />
                      </div>
                    </div>
                  )}

                  {fm?.data && (
                    <DocumentBiodata
                      data={fm?.data}
                      onRender={() => {
                        setIsReady(true);
                      }}
                    />
                  )}
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
