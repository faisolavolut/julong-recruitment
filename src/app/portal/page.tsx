"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import get from "lodash.get";
import { configMenu } from "../d/config-menu";
import { useLocal } from "@/lib/utils/use-local";
import { get_params_url } from "@/lib/utils/getParamsUrl";
import api from "@/lib/utils/axios";
import { userRoleMe } from "@/lib/utils/getAccess";
import {
  filterMenuByPermission,
  getFirstMenuWithUrl,
} from "@/lib/utils/filterMenuByPermission";
import ServerErrorPage from "@/lib/components/comp/500";

function Portal() {
  const local = useLocal({
    ready: false,
    access: true,
  });
  const router = useRouter();
  useEffect(() => {
    local.ready = false;
    local.render();
    const jwt = get_params_url("token");
    const run = async () => {
      // if (!jwt) return navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
      try {
        await api.post(process.env.NEXT_PUBLIC_BASE_URL + "/api/cookies", {
          token: jwt,
        });
        const user = await api.get(
          `${process.env.NEXT_PUBLIC_API_PORTAL}/api/users/me`
        );
        const us = user.data.data;
        if (us) {
          localStorage.setItem("user", JSON.stringify(user.data.data));
          const roles = await userRoleMe();
          router.push("/");
          local.ready = true;
          local.render();
        } else {
          // navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
        }
      } catch (e: any) {
        console.error(e?.message);
        // navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
      }
    };
    run();
  }, []);
  if (local.ready) {
    if (!local.access) return <ServerErrorPage />;
  }
  return <></>;
}

export default Portal;
