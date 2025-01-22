import { GoProject } from "react-icons/go";
import { HiCubeTransparent, HiDocumentText } from "react-icons/hi";
import { RiCalendarScheduleLine, RiTeamFill } from "react-icons/ri";
import { GoVerified } from "react-icons/go";
import { FaClipboardQuestion } from "react-icons/fa6";
import { SiTeamspeak } from "react-icons/si";

export const configMenu = [
  {
    title: "Master Data Document Setup",
    icon: <HiCubeTransparent />,
    children: [
      {
        title: "Activity",
        href: "/d/master-data/activity",
        permision: ["read-activity"],
      },
      {
        title: "Major",
        href: "/d/master-data/major",
        permision: ["read-major"],
      },
      {
        title: "University",
        href: "/d/master-data/university",
        permision: ["read-university"],
      },
      {
        title: "Type Test",
        href: "/d/master-data/type-test",
        permision: ["read-type-test"],
      },
      {
        title: "Document Setup",
        href: "/d/master-data/document-setup",
        permision: ["read-document-setup"],
      },
      {
        title: "Document Checking",
        href: "/d/master-data/document-checking",
        permision: ["read-document-checking"],
      },
      {
        title: "Question",
        href: "/d/master-data/question",
        permision: ["read-template-question"],
      },
      {
        title: "Mail Template",
        href: "/d/master-data/mail-template",
        permision: ["read-mail-template"],
      },
    ],
    permision: [
      "read-template",
      "read-major",
      "read-university",
      "read-type-test",
      "read-question",
      "read-mail-template",
    ],
  },
  {
    title: "Project Recruitment",
    icon: <GoProject />,
    children: [
      {
        title: "Calender",
        href: "/d/project/calender",
        permision: ["read-project-calender"],
      },
      {
        title: "Project",
        href: "/d/project/project-recruitment",
        permision: ["read-project-recruitment"],
      },
    ],
    permision: ["read-project-calender", "read-project-recruitment"],
  },
  {
    title: "MPR Overview",
    icon: <GoProject />,
    href: "/d/mpr",
    permision: ["read-mpr"],
  },
  {
    title: "Job Posting",
    icon: <GoProject />,
    children: [
      {
        title: "Post a Job",
        href: "/d/job/job-posting",
        permision: ["read-job-posting"],
      },
    ],
    permision: ["read-job-posting"],
  },
  {
    title: "Verification Profile",
    icon: <GoVerified />,
    href: "/d/verification-profile",
    permision: ["read-verification-profile"],
  },
  {
    title: "Administrative Selection",
    icon: <HiDocumentText />,
    children: [
      {
        title: "Applicant Overview",
        href: "/d/administrative/applicant-overview",
        permision: ["read-administrative-applicant-overview"],
      },
      {
        title: "Selection Setup",
        href: "/d/administrative/selection-setup",
        permision: ["read-administrative-selection-setup"],
      },
    ],
    permision: [
      "read-administrative-selection-setup",
      "read-administrative-applicant-overview",
    ],
  },
  {
    title: "Test Selection",
    icon: <FaClipboardQuestion />,
    children: [
      {
        title: "Schedule Test",
        href: "/d/test-selection/schedule-test",
        permision: ["read-schedule-test"],
      },
      {
        title: "Result Test",
        href: "/d/test-selection/result-test",
        permision: ["read-result-test"],
      },
      {
        title: "Applicant Overview",
        href: "/d/test-selection/applicant-overview",
        permision: ["read-test-applicant-overview"],
      },
    ],
    permision: ["read-result-test", "read-test-applicant-overview"],
  },
  {
    title: "Interview",
    icon: <SiTeamspeak />,
    children: [
      {
        title: "Schedule Interview",
        href: "/d/interview/schedule-interview",
        permision: ["read-schedule-interview"],
      },
      {
        title: "Result Interview",
        href: "/d/interview/result-interview",
        permision: ["read-result-interview"],
      },
    ],
    permision: ["read-schedule-interview", "read-result-interview"],
  },
  {
    title: "FGD Test",
    icon: <SiTeamspeak />,
    children: [
      {
        title: "FGD Schedule",
        href: "/d/fgd/schedule",
        permision: ["read-fgd-schedule"],
      },
      {
        title: "FGD Result",
        href: "/d/fgd/result",
        permision: ["read-fgd-result"],
      },
    ],
    permision: ["read-fgd-setup", "read-fgd-schedule", "read-fgd-result"],
  },
  {
    title: "Final Interview",
    icon: <SiTeamspeak />,
    children: [
      {
        title: "Calendar",
        href: "/d/final-interview/calender",
        permision: ["read-final-interview-calender"],
      },
      {
        title: "Final Interview",
        href: "/d/final-interview/interview",
        permision: ["read-final-interview-recruitment"],
      },
      {
        title: "Schedule & Result",
        href: "/d/final-interview/result",
        permision: ["read-final-interview-result"],
      },
    ],
    permision: [
      "read-final-interview-calender",
      "read-final-interview-recruitment",
      "read-final-interview-result",
    ],
  },
  {
    title: "Offering Letter",
    icon: <SiTeamspeak />,
    href: "/d/offering-letter",
    permision: ["read-offering-letter"],
  },
  {
    title: "Contract Document",
    icon: <SiTeamspeak />,
    href: "/d/contract-document",
    permision: ["read-contract-document"],
  },
  {
    title: "Applicant Document",
    icon: <SiTeamspeak />,
    href: "/d/applicant-document",
    permision: ["read-applicant-document"],
  },
  {
    title: "Dashboard",
    icon: <SiTeamspeak />,
    href: "/d/dashboard",
    permision: ["read-dashboard"],
  },
  {
    title: "Applicant Result",
    icon: <SiTeamspeak />,
    href: "/d/applicant-result",
    permision: ["read-applicant-result"],
  },
];
