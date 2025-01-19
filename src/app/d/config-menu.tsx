import { GoProject } from "react-icons/go";
import { HiCubeTransparent } from "react-icons/hi";
import { RiCalendarScheduleLine, RiTeamFill } from "react-icons/ri";

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
];
