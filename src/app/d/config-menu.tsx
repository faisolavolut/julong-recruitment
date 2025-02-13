import { GoCommentDiscussion, GoProject } from "react-icons/go";
import { HiCubeTransparent, HiDocumentText } from "react-icons/hi";
import { GoVerified } from "react-icons/go";
import { FaChartSimple, FaClipboardQuestion } from "react-icons/fa6";
import { SlEnvolopeLetter } from "react-icons/sl";
import { TbContract } from "react-icons/tb";
import { TiDocumentText } from "react-icons/ti";
import { MdGroups } from "react-icons/md";

export const configMenu = [
  {
    title: "Dashboard",
    icon: <FaChartSimple />,
    href: "/d/dashboard",
    permision: ["read-dashboard"],
  },
  {
    title: "Master Data Document Setup",
    icon: <HiCubeTransparent />,
    children: [
      {
        title: "Activity",
        href: "/d/master-data/activity",
        permision: ["read-activity"],
      },
      // {
      //   title: "Major",
      //   href: "/d/master-data/major",
      //   permision: ["read-major"],
      // },
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
        permision: ["hilang-read-test-applicant-overview"],
      },
    ],
    permision: ["read-result-test", "read-test-applicant-overview"],
  },
  {
    title: "Interview",
    icon: <GoCommentDiscussion />,
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
      {
        title: "Final Result Interview",
        href: "/d/interview/final-result-interview",
        permision: ["read-final-result-interview"],
      },
    ],
    permision: [
      "read-schedule-interview",
      "read-result-interview",
      "read-final-result-interview",
    ],
  },
  {
    title: "FGD Test",
    icon: <MdGroups />,
    // children: [
    //   {
    //     title: "FGD Schedule",
    //     href: "/d/fgd/schedule",
    //     permision: ["read-fgd-schedule"],
    //   },
    //   {
    //     title: "FGD Result",
    //     href: "/d/fgd/result",
    //     permision: ["read-fgd-result"],
    //   },
    // ],

    children: [
      {
        title: "Schedule FGD",
        href: "/d/fgd/schedule-fgd",
        permision: ["read-schedule-fgd"],
      },
      {
        title: "Result FGD",
        href: "/d/fgd/result-fgd",
        permision: ["read-result-fgd"],
      },
      // {
      //   title: "Final Result FGD",
      //   href: "/d/fgd/final-result-fgd",
      //   permision: ["hilang-read-final-result-fgd"],
      // },
    ],
    permision: [
      "read-schedule-fgd",
      "read-result-fgd",
      // "read-final-result-fgd",
    ],
  },
  // {
  //   title: "Final Interview",
  //   icon: <GoCommentDiscussion />,
  //   children: [
  //     {
  //       title: "Calendar",
  //       href: "/d/final-interview/schedule-interview",
  //       permision: ["read-final-interview-calender"],
  //     },
  //     {
  //       title: "Final Interview",
  //       href: "/d/final-interview/result-interview",
  //       permision: ["read-final-interview-recruitment"],
  //     },
  //   ],
  //   permision: [
  //     "read-final-interview-calender",
  //     "read-final-interview-recruitment",
  //     "read-final-interview-result",
  //   ],
  // },
  {
    title: "Offering Letter",
    icon: <SlEnvolopeLetter />,
    children: [
      {
        title: "Sending Document",
        href: "/d/offering-letter/offering-letter-document",
        permision: ["read-offering-letter-document"],
      },
      {
        title: "Candidate Agreement",
        href: "/d/offering-letter/offering-letter-agreement",
        permision: ["read-offering-letter-agreement"],
      },
    ],
    permision: [
      "read-offering-letter-document",
      "read-offering-letter-agreement",
    ],
  },
  {
    title: "Contract Document",
    icon: <TbContract />,
    children: [
      {
        title: "Sending Document",
        href: "/d/contract-document/contract-document",
        permision: ["read-contract-document-document"],
      },
      {
        title: "Candidate Agreement",
        href: "/d/contract-document/document-agreement",
        permision: ["read-contract-document-agreement"],
      },
    ],
    permision: [
      "read-contract-document-document",
      "read-contract-document-agreement",
    ],
  },
  {
    title: "Applicant Document",
    icon: <TiDocumentText />,
    children: [
      {
        title: "Document Checking",
        href: "/d/applicant-document/document-checking",
        permision: ["read-applicant-document-checking"],
      },
      {
        title: "Cover Letter",
        href: "/d/applicant-document/cover-letter",
        permision: ["read-applicant-document-cover-letter"],
      },
    ],
    permision: [
      "read-applicant-document-checking",
      "read-applicant-document-cover-letter",
    ],
  },
  // {
  //   title: "Applicant Result",
  //   icon: <MdOutlineViewDay />,
  //   href: "/d/applicant-result",
  //   permision: ["read-applicant-result"],
  // },
];
