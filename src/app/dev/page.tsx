"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
function Portal() {
  const local = useLocal({
    ready: false,
    access: true,
    data: null as any,
    open: false,
  });
  const router = useRouter();
  const [url, setUrl] = useState(null as any);
  return <></>;
}

export default Portal;
