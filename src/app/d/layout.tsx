"use client";
import "@/app/globals.css";
import NavFlow from "@/lib/components/partials/NavbarFlow";
import Footer from "@/lib/components/partials/Footer";

import { SidebarProvider } from "@/context/SidebarContext";
import SidebarTree from "@/lib/components/partials/Sidebar";
import { HiChartPie, HiCubeTransparent } from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { configMenu } from "./config-menu";
import { useLocal } from "@/lib/utils/use-local";
import { useEffect, useState } from "react";
import api from "@/lib/utils/axios";
import get from "lodash.get";
import { Skeleton } from "../../lib/components/ui/Skeleton";
import { userRoleMe } from "@/lib/utils/getAccess";
import { filterMenuByPermission } from "@/lib/utils/filterMenuByPermission";
interface RootLayoutProps {
  children: React.ReactNode;
}
const AdminLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [mini, setMini] = useState(false);
  const local = useLocal({
    user: null as any,
    data: configMenu,
    ready: false,
  });
  useEffect(() => {
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
    <div className="flex h-screen flex-col">
      <NavFlow
        minimaze={() => {
          setMini(!mini);
          localStorage.setItem("mini", !mini ? "true" : "false");
        }}
      />
      <div className="flex  bg-white flex-grow flex-row">
        {!local.ready ? (
          <div className="relative bg-white w-64">
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
        <div className="flex flex-row flex-grow  bg-[#F1F1F1] flex-grow">
          <div
            id="main-content"
            className="flex-grow  relative overflow-y-auto flex flex-row"
          >
            <div className="w-full h-full absolute top-0 lef-0 flex flex-row  p-10">
              {typeof window === "object" ? (
                get(window, "user") ? (
                  <main className="flex-grow flex flex-col">{children}</main>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
