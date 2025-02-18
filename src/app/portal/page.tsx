"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { get_params_url } from "@/lib/utils/getParamsUrl";
import api from "@/lib/utils/axios";
import { userRoleMe } from "@/lib/utils/getAccess";
import ServerErrorPage from "@/lib/components/comp/500";
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
      if (!jwt) return navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
      try {
        await api.post(process.env.NEXT_PUBLIC_BASE_URL + "/api/cookies", {
          token: jwt,
        });
        let user = await apix({
          port: "portal",
          value: "data.data",
          path: "/api/users/me",
        });
        if (user) {
          let profile = null;
          try {
            const data = await apix({
              port: "recruitment",
              value: "data.data",
              path: "/api/user-profiles/user",
            });
            profile = data;
            delete profile["user"];
            user = {
              ...user,
              profile,
            };
          } catch (ex) {}
          localStorage.setItem("user", JSON.stringify(user));
          const roles = await userRoleMe();
          router.push("/");
          local.ready = true;
          local.render();
        } else {
          navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
        }
      } catch (e) {
        navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
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
