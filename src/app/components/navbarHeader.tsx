import { ButtonLink } from "@/lib/components/ui/button-link";
import { userToken } from "@/lib/helpers/user";
import api from "@/lib/utils/axios";
import {
  filterMenuByPermission,
  getFirstMenuWithUrl,
} from "@/lib/utils/filterMenuByPermission";
import { get_user } from "@/lib/utils/get_user";
import { userRoleMe } from "@/lib/utils/getAccess";
import { siteurl } from "@/lib/utils/siteurl";
import { useLocal } from "@/lib/utils/use-local";
import { Avatar, Dropdown } from "flowbite-react";
import get from "lodash.get";
import Link from "next/link";
import { useEffect, type FC } from "react";
import { configMenu } from "../d/config-menu";

const DefaultHeaderNavigation: FC = function () {
  const local = useLocal({
    user: null as any,
    role: null as any,
  });
  useEffect(() => {
    const run = async () => {
      userToken();
      const w: any = window;
      local.user = w?.user;
      local.render();
    };
    run();
  }, []);
  return (
    <div className="flex flex-row py-2 items-center bg-white shadow-sm px-2 sticky top-0 z-50 justify-center">
      <div className="grid grid-cols-5 max-w-screen-xl items-center w-full">
        <Link href={siteurl("/")} className="flex flex-row items-center px-4">
          <img
            src={siteurl("/logo-full.png")}
            className="mr-3 h-6"
            alt="Flowbite Logo"
          />
        </Link>
        <div className="flex flex-row flex-grow items-center justify-center col-span-3">
          {local.user ? (
            <>
              <ButtonLink href="/guest/user-setting" variant={"noline"}>
                My Profile
              </ButtonLink>
              <ButtonLink href="/all-jobs" variant={"noline"}>
                Find Jobs
              </ButtonLink>
              <ButtonLink href="/favorite-jobs" variant={"noline"}>
                Favorite Jobs
              </ButtonLink>
              <ButtonLink href="/applied-jobs" variant={"noline"}>
                Applied Jobs
              </ButtonLink>
              {/* <ButtonLink href="/about" variant={"noline"}>
                About Us
              </ButtonLink> */}
            </>
          ) : (
            <>
              <ButtonLink href="/" variant={"noline"}>
                Home
              </ButtonLink>
              <ButtonLink href="/all-jobs" variant={"noline"}>
                Find Jobs
              </ButtonLink>
              <ButtonLink href="/" variant={"noline"}>
                About Us
              </ButtonLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:order-2 justify-end">
          {local.user ? (
            <>
              <UserDropdown user={local.user} />
            </>
          ) : (
            <>
              <ButtonLink
                href={`${siteurl("/login", "portal")}`}
                variant={"noline"}
              >
                Log in
              </ButtonLink>
              <ButtonLink href={`${siteurl("/register", "portal")}`}>
                Sign up
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const UserDropdown: FC<{ user: any }> = function ({ user }) {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <Avatar alt="" img={siteurl("/dog.jpg")} rounded size="sm" />
        </span>
      }
    >
      <Dropdown.Header>
        <span className="block text-md">
          {get_user("name") ? get_user("name") : "-"}
        </span>
        <span className="block truncate text-md font-medium">
          {get_user("email") ? get_user("email") : "-"}
        </span>
      </Dropdown.Header>
      {get(user, "roles[0].permissions.length") ? (
        <>
          <Dropdown.Item
            onClick={async () => {
              try {
                const user = await api.get(
                  `${process.env.NEXT_PUBLIC_API_PORTAL}/api/users/me`
                );
                const us = user.data.data;
                if (us) {
                  localStorage.setItem("user", JSON.stringify(user.data.data));
                  const roles = await userRoleMe();
                  const permision = get(roles, "[0].permissions");
                  const menuMe = filterMenuByPermission(configMenu, permision);
                  router.push(getFirstMenuWithUrl(menuMe));
                } else {
                  navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
                }
              } catch (e) {
                navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
              }
            }}
          >
            Dashboard
          </Dropdown.Item>
          <Dropdown.Divider />
        </>
      ) : (
        <></>
      )}
      {get(user, "roles[0].permissions.length") ? (
        <>
          <Dropdown.Item
            className="flex flex-row items-center gap-x-1"
            onClick={() => {
              if (typeof window === "object")
                navigate(
                  `${process.env.NEXT_PUBLIC_API_PORTAL}/choose-roles?state=recruitment`
                );
            }}
          >
            Switch Role
          </Dropdown.Item>
          <Dropdown.Divider />
        </>
      ) : (
        <></>
      )}
      <Dropdown.Item
        className="flex flex-row items-center gap-x-1"
        onClick={() => {
          if (typeof window === "object")
            navigate(`${siteurl(`/guest/user-setting`)}`);
        }}
      >
        Setting
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        className="flex flex-row items-center gap-x-1"
        onClick={async () => {
          await api.delete(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/destroy-cookies"
          );
          localStorage.removeItem("user");
          if (typeof window === "object")
            navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/logout`);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 3.25a.75.75 0 0 1 0 1.5a7.25 7.25 0 0 0 0 14.5a.75.75 0 0 1 0 1.5a8.75 8.75 0 1 1 0-17.5"
          ></path>
          <path
            fill="currentColor"
            d="M16.47 9.53a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H10a.75.75 0 0 1 0-1.5h8.19z"
          ></path>
        </svg>
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
};
export default DefaultHeaderNavigation;
