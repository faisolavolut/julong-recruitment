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
  console.log(step);
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
    case "FINAL_INTERVIEW":
      try {
        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/interviews/my-schedule?job_posting_id=${data?.id}&project_recruitment_line_id=${data?.id_line}&status=IN PROGRESS
                  `,
          validate: "object",
        });
        console.log({ test });
        if (test?.status === "DRAFT") test = null;
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
      console.log({ result });
      break;

    case "FGD":
      try {
        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/fgd-schedules/my-schedule?job_posting_id=${data?.id}&project_recruitment_line_id=${data?.id_line}&status=IN PROGRESS
                    `,
          validate: "object",
        });
        if (test?.status === "DRAFT") test = null;
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

    case "OFFERING_LETTER":
      let answerOfferingLetter = null;
      try {
        const res: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-types",
          validate: "array",
        });
        const findDocument = res.find(
          (item: any) => item.name === "OFFERING_LETTER"
        );
        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-sending/applicant?applicant_id=${data?.applicant?.id}&document_type_id=${findDocument?.id}`,
          validate: "object",
        });
        if (test) {
          answerOfferingLetter = await apix({
            port: "recruitment",
            value: "data.data",
            path: `/api/document-agreement/find?applicant_id=${data?.applicant?.id}&document_sending_id=${test?.id}`,
            validate: "object",
          });
          if (answerOfferingLetter && test?.status !== "DRAFT") {
            test = {
              ...test,
              file: answerOfferingLetter?.path,
              status_aggrement: answerOfferingLetter?.status,
            };
          }
        }
        if (test?.status === "DRAFT") test = null;
      } catch (ex) {}
      if (test) {
        let detail = {
          ...test,
          applicant: data?.applicant,
        };
        result = detail;
      }
      console.log({ result });
      break;
    case "CONTRACT_DOCUMENT":
      try {
        let answerContractDocument = null;
        const res: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-types",
          validate: "array",
        });
        const findDocument = res.find(
          (item: any) => item.name === "CONTRACT_DOCUMENT"
        );
        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-sending/applicant?applicant_id=${data?.applicant?.id}&document_type_id=${findDocument?.id}`,
          validate: "object",
        });
        if (test) {
          answerContractDocument = await apix({
            port: "recruitment",
            value: "data.data",
            path: `/api/document-agreement/find?applicant_id=${data?.applicant?.id}&document_sending_id=${test?.id}`,
            validate: "object",
          });
          if (answerContractDocument && test?.status !== "DRAFT") {
            test = {
              ...test,
              file: answerContractDocument?.path,
              status_aggrement: answerContractDocument?.status,
            };
          }
        }
        if (test?.status === "DRAFT") test = null;
      } catch (ex) {}
      if (test) {
        let detail = {
          ...test,
          applicant: data?.applicant,
        };
        result = detail;
      }
      break;
    case "DOCUMENT_CHECKING":
      try {
        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-verification-headers/find?applicant_id=${data?.applicant?.id}&job_posting_id=${data?.id}`,
          validate: "object",
        });
        if (test?.status === "DRAFT") test = null;
      } catch (ex) {}
      if (test) {
        let detail = {
          ...test,
          document_verification_lines: test?.document_verification_lines?.length
            ? test.document_verification_lines.map((e: any) => {
                return {
                  ...e,
                  name: e?.document_verification?.name
                    ? e?.document_verification?.name
                    : "",
                };
              })
            : [],
          applicant: data?.applicant,
        };
        result = detail;
      }
      break;
    case "FINAL_RESULT":
      try {
        let answerContractDocument = null;
        const res: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/document-types",
          validate: "array",
        });
        const findDocument = res.find(
          (item: any) => item?.name === "FINAL_RESULT"
        );

        test = await apix({
          port: "recruitment",
          value: "data.data",
          path: `/api/document-sending/applicant?applicant_id=${data?.applicant?.id}&document_type_id=${findDocument?.id}`,
          validate: "object",
        });
        if (test && test?.status !== "DRAFT") {
          test = {
            ...test,
          };
        }
        if (test?.status === "DRAFT") test = null;
      } catch (ex) {}
      if (test) {
        let detail = {
          ...test,
          applicant: data?.applicant,
        };
        result = detail;
      }
      break;
  }
  return result;
};
