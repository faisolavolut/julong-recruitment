import { ButtonBetter } from "@/lib/components/ui/button";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { siteurl } from "@/lib/utils/siteurl";
import Link from "next/link";
import type { FC } from "react";

const DefaultHeaderNavigation: FC = function () {
  return (
    <div className="flex flex-row py-2 items-center bg-white shadow-sm px-2 sticky top-0 z-50">
      <Link
        href="https://flowbite.com"
        className="flex flex-row items-center"
      >
        <img
          src={siteurl("/julong.png")}
          className="mr-3 h-6 sm:h-9 rounded"
          alt="Flowbite Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Julong
        </span>
      </Link>
      <div className="flex flex-row flex-grow items-center justify-center">
        <ButtonLink href="/" variant={"noline"}>
          Home
        </ButtonLink>
        <ButtonLink href="/" variant={"noline"}>
          Find Jobs
        </ButtonLink>
        <ButtonLink href="/" variant={"noline"}>
          About Company
        </ButtonLink>
      </div>

      <div className="flex items-center gap-3 lg:order-2">
        <ButtonLink href="/" variant={"noline"}>
          Log in
        </ButtonLink>
        <ButtonLink href="/">Sign up</ButtonLink>
      </div>
    </div>
  );
};

export default DefaultHeaderNavigation;
