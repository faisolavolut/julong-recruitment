"use client";
import { TableUI } from "@/lib/components/tablelist/TableUI";
import { ButtonBetterTooltip } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { access } from "@/lib/utils/getAccess";
import { getLabel } from "@/lib/utils/getLabel";
import { getNumber } from "@/lib/utils/getNumber";
import { getValue } from "@/lib/utils/getValue";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { IoEye } from "react-icons/io5";

function Page() {
  const local = useLocal({
    can_add: false,
    can_edit: false,
  });
  useEffect(() => {
    const run = async () => {
      local.can_add = access("create-template-question");
      local.can_edit = access("edit-template-question");
      local.render();
    };
    run();
  }, []);

  return (
    <TableUI
      title="Question Template"
      name="period"
      header={{
        sideLeft: (data: any) => {
          if (!local.can_add) return <></>;
          return (
            <>
              <div className="flex flex-row flex-grow">
                <ButtonLink
                  className="bg-primary"
                  href={"/d/master-data/question/new"}
                >
                  <div className="flex items-center gap-x-0.5">
                    <HiPlus className="text-xl" />
                    <span className="capitalize">Add New</span>
                  </div>
                </ButtonLink>
              </div>
            </>
          );
        },
      }}
      column={[
        {
          name: "name",
          header: "Template",
          renderCell: ({ row, name, cell }: any) => {
            return <>{getValue(row, name)}</>;
          },
        },
        {
          name: "form_type",
          header: "Document Type",
          renderCell: ({ row, name, cell }: any) => {
            return <>{getLabel(getValue(row, name))}</>;
          },
        },
        {
          name: "status",
          header: "Status",
          renderCell: ({ row, name, cell }: any) => {
            switch (getValue(row, name)) {
              case "ACTIVE":
                return "Active";
                break;
              default:
                return "Inactive";
            }
          },
        },
        {
          name: "action",

          header: "Action",
          filter: false,
          sortable: false,
          renderCell: ({ row, name, cell }: any) => {
            const viewForm = true ? (
              <></>
            ) : ["TEST", "INTERVIEW", "FGD", "FINAL_INTERVIEW"].includes(
                row?.form_type
              ) ? (
              <>
                <ButtonBetterTooltip
                  tooltip={"View Form Question"}
                  className="bg-primary"
                  onClick={() => {
                    navigate(`/form/${row.id}/preview`);
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <IoEye className="text-lg" />
                  </div>
                </ButtonBetterTooltip>
              </>
            ) : (
              <></>
            );
            if (local.can_edit) {
              return (
                <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                  <ButtonLink href={`/d/master-data/question/${row.id}/edit`}>
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                  {viewForm}
                </div>
              );
            }

            return (
              <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                <ButtonLink
                  className="bg-primary"
                  href={`/d/master-data/question/${row.id}/view`}
                >
                  <div className="flex items-center gap-x-2">
                    <IoEye className="text-lg" />
                  </div>
                </ButtonLink>
                {viewForm}
              </div>
            );
            if (getValue(row, "status") !== "draft") {
            } else {
              if (!local.can_edit) return <></>;
              return (
                <div className="flex items-center gap-x-0.5 whitespace-nowrap">
                  <ButtonLink href={`/d/master-data/question/${row.id}/edit`}>
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                    </div>
                  </ButtonLink>
                </div>
              );
            }
          },
        },
      ]}
      onLoad={async (param: any) => {
        const params = await events("onload-param", param);
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.template_questions",
          path: `/api/template-questions${params}`,
          validate: "array",
        });
        return result;
      }}
      onCount={async (params: any) => {
        const result: any = await apix({
          port: "recruitment",
          value: "data.data.total",
          path: `/api/template-questions?page=1&page_size=1`,
          validate: "object",
        });
        return getNumber(result);
      }}
      onInit={async (list: any) => {}}
    />
  );
}

export default Page;
