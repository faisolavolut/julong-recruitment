"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { get_params_url } from "@/lib/utils/getParamsUrl";
import { apix } from "@/lib/utils/apix";

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
      try {
        const check = await apix({
          port: "portal",
          value: "data.data",
          path: "/api/check-jwt-token",
          method: "get",
        });
        if (check) local.access = true;
        local.render();
      } catch (e) {}

      local.ready = true;
      local.render();
    };
    run();
  }, []);
  if (!local.ready) {
    return <></>;
  }
  if (!local.access) return <>GK ada akses</>;
  return <>akses</>;
}

export default Portal;
