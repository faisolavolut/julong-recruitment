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
import { Dropdown } from "flowbite-react";
import get from "lodash.get";
import Link from "next/link";
import { useEffect, type FC } from "react";
import { configMenu } from "../d/config-menu";
import { apix } from "@/lib/utils/apix";
import ImageBetter from "@/lib/components/ui/Image";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { Up } from "@/lib/svg/Up";
import { CgMenuRightAlt } from "react-icons/cg";

const DefaultHeaderNavigation: FC = function () {
  const local = useLocal({
    user: null as any,
    role: null as any,
    profile: null as any,
    open: false as any,
  });
  useEffect(() => {
    const run = async () => {
      try {
        await userToken();
      } catch (ex) {}
      const w: any = window;
      local.user = w?.user;
      local.render();

      let profile = null as any;
      try {
        profile = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/user-profiles/user",
          method: "get",
        });
      } catch (ex) {}
      local.user = local?.user
        ? {
            ...local?.user,
            avatar: profile?.avatar,
          }
        : null;
      local.profile = profile;
      local.render();
    };
    run();
  }, []);
  const menuNavbar = (
    <>
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
    </>
  );
  // || local.user
  const userMenu = (
    <>
      {local.user ? (
        <>
          <UserDropdown user={local.user} />
        </>
      ) : (
        <>
          <ButtonLink
            href={`${siteurl("/login", "portal")}`}
            variant={"noline"}
            className="md:flex hidden"
          >
            Log in
          </ButtonLink>
          <ButtonLink
            href={`${siteurl("/login", "portal")}`}
            className="md:hidden flex w-full text-primary font-bold"
            variant={"noline"}
          >
            Log in
          </ButtonLink>
          <ButtonBetter
            onClick={() => {
              localStorage.setItem(
                "redirect_apply_job",
                JSON.stringify({
                  path: `/all-jobs`,
                })
              );
              navigate(`${siteurl("/register", "portal")}`);
            }}
            className="md:w-auto w-full"
          >
            Sign up
          </ButtonBetter>
        </>
      )}
    </>
  );
  return (
    <div className="flex flex-row py-2 items-center bg-white shadow-sm px-2 sticky top-0 z-50 justify-center">
      <div className="grid grid-cols-2 md:grid-cols-5 max-w-screen-xl items-center w-full">
        <Link href={siteurl("/")} className="flex flex-row items-center px-4">
          <img
            src={siteurl("/logo-full.png")}
            className="mr-3 h-6"
            alt="Flowbite Logo"
          />
        </Link>
        <div className="md:hidden flex justify-end">
          <Dialog open={local.open}>
            <DialogTrigger
              asChild
              onClick={() => {
                local.open = true;
                local.render();
                console.log("HALO");
              }}
            >
              <div>
                <ButtonContainer
                  onClick={() => {
                    console.log("HALO");
                  }}
                  variant="clean"
                  className="flex flex-row items-center gap-x-2  "
                >
                  <CgMenuRightAlt className="text-2xl" />
                </ButtonContainer>
              </div>
            </DialogTrigger>
            <DialogContent
              className={cx(
                " flex flex-col w-screen h-screen py-0 px-0",
                css`
                  .dialog-close {
                    display: none;
                  }
                `
              )}
              onClick={() => {
                local.open = false;
                local.render();
              }}
            >
              <DialogHeader className="hidden">
                <DialogTitle>Applicant</DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
              </DialogHeader>
              <div className="flex flex-row py-2 items-center bg-white shadow-sm px-2 sticky top-0 z-50 justify-center">
                <div className="grid grid-cols-2 md:grid-cols-5 max-w-screen-xl items-center w-full">
                  <Link
                    href={siteurl("/")}
                    className="flex flex-row items-center px-4"
                  >
                    <img
                      src={siteurl("/logo-full.png")}
                      className="mr-3 h-6"
                      alt="Flowbite Logo"
                    />
                  </Link>
                  <div className="md:hidden flex justify-end">
                    <ButtonBetter
                      onClick={() => {
                        local.open = false;
                        local.render();
                      }}
                      variant="clean"
                      className="flex flex-row items-center gap-x-2"
                    >
                      Menu
                      <Up />
                    </ButtonBetter>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-grow gap-y-2 px-2">
                {menuNavbar}
                {userMenu}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="md:flex hidden flex flex-row flex-grow items-center justify-center col-span-3">
          {menuNavbar}
        </div>

        <div className="md:flex hidden flex items-center gap-3 lg:order-2 justify-end">
          {userMenu}
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
          <ImageBetter
            src={siteurl(
              get_user("profile.avatar")
                ? get_user("profile.avatar")
                : get_user("photo")
            )}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
            defaultSrc={siteurl("/404-img.jpg")}
          />
        </span>
      }
    >
      <Dropdown.Item className="flex flex-col">
        <div className="flex flex-col flex-grow">
          <div className=" text-md w-full text-start">
            {get_user("name") ? get_user("name") : "-"}
          </div>
          <div className=" truncate text-md font-medium  w-full  text-start">
            {get_user("email") ? get_user("email") : "-"}
          </div>
        </div>
      </Dropdown.Item>
      <Dropdown.Divider className="my-0" />
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
          <Dropdown.Divider className="my-0" />
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
          <Dropdown.Divider className="my-0" />
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
      <Dropdown.Divider className="my-0" />
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
