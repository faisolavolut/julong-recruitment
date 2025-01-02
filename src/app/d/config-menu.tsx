import { HiCubeTransparent } from "react-icons/hi";
import { RiCalendarScheduleLine, RiTeamFill } from "react-icons/ri";

export const configMenu = [
  {
    title: "Master Data",
    icon: <HiCubeTransparent />,
    children: [
      {
        title: "Master Organization",
        href: "/d/master-data/organization",
        permision: ["read-organization"],
      },
      {
        title: "Master Data Organization Structure",
        href: "/d/master-data/organization-structure",
        permision: ["read-organization-structure"],
      },
      {
        title: "Master Data Jobs",
        href: "/d/master-data/jobs",
        permision: ["read-job"],
      },
      {
        title: "Master Data Plafon",
        href: "/d/master-data/plafon",
        permision: ["read-plafon"],
      },
    ],
    permision: [
      "read-organization",
      "read-organization-structure",
      "read-job",
      "read-plafon",
    ],
  },
  {
    title: "Manpower Planning Period",
    icon: <RiCalendarScheduleLine />,
    children: [
      { title: "Period", href: "/d/period", permision: ["read-period"] },
      {
        title: "Manpower Planning Overview",
        href: "/d/location",
        permision: ["read-mpp", "read-mpp-hrd-location", "read-mpp-hrd-unit", "read-mpp-dir-unit", "read-mpp-rekruitmen"],
      },
      { title: "Batch", href: "/d/batch", permision: ["read-batch"] },
      { title: "Batch CEO", href: "/d/batch-ceo", permision: ["batch-ceo"] },
    ],
    permision: ["read-period", "read-mpp", "read-batch", "batch-ceo", "read-mpp-hrd-location", "read-mpp-hrd-unit", "read-mpp-dir-unit", "read-mpp-rekruitmen"],
  },
  {
    title: "Manpower Request",
    icon: <RiTeamFill />,
    children: [
      {
        title: "Manpower Request",
        href: "/d/mpr",
        permision: ["read-mpr", "read-mpr-dept-head", "read-mpr-vp", "read-mpr-ho"],
      },
      {
        title: "Manpower Request CEO",
        href: "/d/mpr-ceo",
        permision: ["read-mpr-ceo"],
      },
    ],
    permision: ["read-mpr", "read-mpr-ceo", "read-mpr-dept-head", "read-mpr-vp", "read-mpr-ho"],
  },
];
