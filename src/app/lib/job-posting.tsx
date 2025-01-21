import { actionToast } from "@/lib/utils/action";
import { apix } from "@/lib/utils/apix";

export const generateLineActivity = async (id: string, id_template: string) => {
  await actionToast({
    task: async () => {
      console.log("HALO");
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
      console.log({ line });
      if (Array.isArray(line) && line.length) {
        const result = line.map((e) => {
          return {
            template_activity_line_id: e?.id,
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
