import { convertToTimeOnly } from "@/lib/components/form/field/TypeInput";
import { apix } from "@/lib/utils/apix";

export const scheduleFase = async ({
  step,
  data,
}: {
  step: string;
  data: any;
}) => {
  let result = null as any;
  let test = null as any;
  switch (step) {
    case "TEST":
      try {
        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/test-schedule-headers/my-schedule?job_posting_id=${data?.id}&project_recruitment_line_id=${data?.id_line}&status=IN PROGRESS
              `,
          validate: "object",
        });
        if (test?.status === "DRAFT") test = null;
      } catch (ex) {}
      if (test) {
        let url = test.link;
        const regex = /form\/[a-f0-9-]+/;
        const isMatch = regex.test(url);
        if (isMatch) {
          url = `${url}/${data?.id_line}/${data.id}/form`;
        }
        let detail = {
          ...test,
          url: url,
          start_time: convertToTimeOnly(test?.start_time),
          end_time: convertToTimeOnly(test?.end_time),
        };
        result = detail;
      }
      break;
    case "INTERVIEW":
      try {
        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/interviews/my-schedule?job_posting_id=${data?.id}&project_recruitment_line_id=${data?.id_line}&status=IN PROGRESS
                `,
          validate: "object",
        });
        if (test?.status === "DRAFT") test = null;
        console.log({ test });
      } catch (ex) {}
      if (test) {
        let url = test.link;
        let detail = {
          ...test,
          url: url,
          start_date: test?.project_recruitment_line?.start_date,
          end_date: test?.project_recruitment_line?.end_date,
          start_time: convertToTimeOnly(test?.start_time),
          end_time: convertToTimeOnly(test?.end_time),
        };
        result = detail;
      }
      break;
  }
  return result;
};
