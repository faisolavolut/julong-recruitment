"use client";
import "@/app/globals.css";
import { configMenu } from "./config-menu";
import { useEffect, useState } from "react";
import get from "lodash.get";
import { useLocal } from "@/lib/utils/use-local";
import api from "@/lib/utils/axios";
import { userRoleMe } from "@/lib/utils/getAccess";
import { filterMenuByPermission } from "@/lib/utils/filterMenuByPermission";
import NavFlow from "@/lib/components/partials/NavbarFlow";
import { Skeleton } from "@/lib/components/ui/Skeleton";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import SidebarTree from "@/lib/components/partials/Sidebar";
import { Navbar } from "flowbite-react";
import { HiMenuAlt1 } from "react-icons/hi";
import { siteurl } from "@/lib/utils/siteurl";
interface RootLayoutProps {
  children: React.ReactNode;
}
const AdminLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [mini, setMini] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const local = useLocal({
    user: null as any,
    data: configMenu,
    ready: false,
  });
  useEffect(() => {
    setIsClient(true);
    const localMini = localStorage.getItem("mini");
    if (!localMini) {
      localStorage.setItem("mini", mini ? "true" : "false");
    } else {
      setMini(localMini === "true" ? true : false);
    }
    const run = async () => {
      try {
        const user = await api.get(
          `${process.env.NEXT_PUBLIC_API_PORTAL}/api/users/me`
        );
        local.user = user?.data?.data;
        if (typeof window === "object") {
          const w = window as any;
          w.user = user?.data?.data;
        }
        const roles = await userRoleMe();
        const permision = get(roles, "[0].permissions");
        const menuMe = filterMenuByPermission(configMenu, permision);
        local.data = menuMe;
        local.ready = true;
        local.render();
        if (!user?.data.data) {
          navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
        }
      } catch (e) {
        navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
      }
    };
    run();
  }, []);

  return (
    <div className="flex h-screen flex-row">
      <div className="flex flex-col p-3 bg-layer ">
        <div className="flex flex-col flex-grow rounded-2xl overflow-hidden">
          <Navbar fluid className="pb-0 bg-primary">
            <div className="w-full p-1 pb-0">
              <div
                className={`flex items-center ${
                  mini ? "justify-center" : "justify-between"
                }`}
              >
                <div
                  className={`flex items-center ${mini && "justify-center"}`}
                >
                  {true && (
                    <button
                      onClick={() => {
                        setMini(!mini);
                      }}
                      className={` ${
                        !mini && "mr-3"
                      } cursor-pointer rounded p-2 text-white  lg:inline`}
                    >
                      <span className="sr-only">Toggle sidebar</span>
                      <HiMenuAlt1 className="h-6 w-6" />
                    </button>
                  )}
                  {!mini && (
                    <Navbar.Brand href="/">
                      <img
                        alt=""
                        src={siteurl("/hiree-2.png")}
                        className="w-32"
                      />
                      <span className="self-center whitespace-nowrap text-2xl font-semibold text-black"></span>
                    </Navbar.Brand>
                  )}
                </div>
              </div>
            </div>
          </Navbar>
          {!local.ready ? (
            <div className="relative bg-primary w-64">
              <div
                className={cx(
                  "absolute",
                  css`
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                  `
                )}
              >
                <div className="flex flex-grow flex-row items-center justify-center">
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-row gap-x-2">
                      <Skeleton className="h-24 flex-grow" />
                      <Skeleton className="h-24 flex-grow" />
                    </div>
                    <Skeleton className="h-24 w-[230px]" />
                    <div className="flex flex-row gap-x-2">
                      <Skeleton className="h-24 flex-grow" />
                      <Skeleton className="h-24 flex-grow" />
                    </div>
                    <Skeleton className="h-24 w-[230px]" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <SidebarProvider>
              <SidebarTree
                data={local.data}
                minimaze={() => {
                  setMini(!mini);
                }}
                mini={mini}
              />
            </SidebarProvider>
          )}
        </div>
      </div>
      <div className="flex  bg-layer flex-grow flex-col py-3">
        <NavFlow
          minimaze={() => {
            setMini(!mini);
            localStorage.setItem("mini", !mini ? "true" : "false");
          }}
        />
        <div className="flex flex-row flex-grow  flex-grow">
          <div
            id="main-content"
            className="flex-grow  relative overflow-y-auto flex flex-row"
          >
            <div className="w-full h-full absolute top-0 lef-0 flex flex-row  p-4 pb-0 pt-4 pr-6 pl-3">
              {isClient ? (
                <main className="flex-grow flex flex-col">{children}</main>
              ) : (
                <>Loading</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
