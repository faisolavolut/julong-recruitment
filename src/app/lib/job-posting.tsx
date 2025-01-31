import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";
import { normalDate } from "@/lib/utils/date";

export const generateLineActivity = async (id: string, id_template: string) => {
  await actionToast({
    task: async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/project-recruitment-headers/${id}`,
        validate: "object",
      });
      const lineData = data?.project_recruitment_lines || [];
      const ids = lineData.map((e: any) => e?.id);
      const line: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/template-activity-lines/template-activity/${id_template}`,
        validate: "array",
      });
      if (Array.isArray(line) && line.length) {
        const result = line.map((e, idx) => {
          return {
            template_activity_line_id: e?.id,
            order:
              e?.template_question?.form_type === "ADMINISTRATIVE_SELECTION"
                ? 1
                : idx + 1,
          };
        });
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/project-recruitment-lines",
          method: "post",
          data: {
            project_recruitment_header_id: id,
            project_recruitment_lines: result,
            deleted_project_recruitment_line_ids: ids,
          },
        });
      }
    },
    after: () => {},
    msg_load: "Delete ",
    msg_error: "Delete failed ",
    msg_succes: "Delete success ",
  });
};

export const getLine = async (id_template: string, fm: any, name: any) => {
  const line: any = await apix({
    port: "recruitment",
    value: "data.data",
    path: `/api/template-activity-lines/template-activity/${id_template}`,
    validate: "array",
  });
  let lines = [] as any[];
  let del_ids = [];
  if (Array.isArray(line) && line.length) {
    const result = line.map((e, idx) => {
      return {
        template_activity_line_id: e?.id,
        name: e?.name,
        order:
          e?.template_question?.form_type === "ADMINISTRATIVE_SELECTION"
            ? 1
            : idx + 1,
      };
    });
    if (fm?.data?.[name]?.length) {
      const ids = fm.data[name].filter((e: any) => e?.id);
      const del_ids = fm.data.del_ids || [];
      fm.data.del_ids = del_ids.concat(ids);
    }
    fm.data[name] = result;
    return;
    if (result) {
      del_ids = lines.map((e: any) => e?.id) || [];
      lines = result;
    } else {
      lines = lines.map((e: any, idx: number) => {
        return {
          ...e,
          name: e?.template_activity_line?.name,
          end_date: normalDate(e?.end_date),
          start_date: normalDate(e?.start_date),
          pic: e?.project_pics?.length
            ? e.project_pics.map((e: any) => e?.employee_id)
            : [],
          order:
            e?.template_question?.form_type === "ADMINISTRATIVE_SELECTION"
              ? 1
              : idx + 1,
        };
      });
    }
  }
  console.log(lines);
  await actionToast({
    task: async () => {
      const data: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/project-recruitment-headers/${id}`,
        validate: "object",
      });
      const lineData = data?.project_recruitment_lines || [];
      const ids = lineData.map((e: any) => e?.id);
      const line: any = await apix({
        port: "recruitment",
        value: "data.data",
        path: `/api/template-activity-lines/template-activity/${id_template}`,
        validate: "array",
      });
      if (Array.isArray(line) && line.length) {
        const result = line.map((e, idx) => {
          return {
            template_activity_line_id: e?.id,
            order:
              e?.template_question?.form_type === "ADMINISTRATIVE_SELECTION"
                ? 1
                : idx + 1,
          };
        });
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/project-recruitment-lines",
          method: "post",
          data: {
            project_recruitment_header_id: id,
            project_recruitment_lines: result,
            deleted_project_recruitment_line_ids: ids,
          },
        });
      }
    },
    after: () => {},
    msg_load: "Delete ",
    msg_error: "Delete failed ",
    msg_succes: "Delete success ",
  });
};
