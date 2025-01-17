"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import CalenderFull from "@/lib/components/ui/CalenderFull";
import { shortDate } from "@/lib/utils/date";
import get from "lodash.get";
import { getNumber } from "@/lib/utils/getNumber";
import { useEditor, useCurrentEditor, EditorProvider } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Popover } from "@/lib/components/Popover/Popover";
import { Input } from "@/lib/components/ui/input";
import { ButtonBetter } from "@/lib/components/ui/button";
import { CheckIcon } from "lucide-react";
function Portal() {
  const local = useLocal({
    ready: false,
    access: true,
    data: null as any,
    open: false,
  });
  const steps = [
    { name: "Administrative", href: "#", status: "complete" },
    { name: "Test", href: "#", status: "complete" },
    { name: "Interview", href: "#", status: "current" },
    { name: "Contract", href: "#", status: "upcoming" },
    { name: "Offering Letter", href: "#", status: "upcoming" },
    { name: "Final Result", href: "#", status: "upcoming" },
  ];
  return (
    <>
      <div className="relative flex flex-col h-screen w-screen bg-gray-200">
        <div className="w-1/2 bg-white h-screen items-center flex flex-col justify-center">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={cx(
                    stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                    "relative"
                  )}
                >
                  {step.status === "complete" ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-indigo-600" />
                      </div>
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                        <CheckIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />

                        <div
                          className={cx(
                            "absolute text-center",
                            css`
                              transform: translate(-50%, -5%);
                              top: 40px;
                              left: 50%;
                              width: 100px;
                            `
                          )}
                        >
                          <span>{step.name}</span>
                        </div>
                      </div>
                    </>
                  ) : step.status === "current" ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div
                        className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white"
                        aria-current="step"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-indigo-600"
                          aria-hidden="true"
                        />
                        <div
                          className={cx(
                            "absolute text-center",
                            css`
                              transform: translate(-50%, -5%);
                              top: 40px;
                              left: 50%;
                              width: 100px;
                            `
                          )}
                        >
                          <span>{step.name}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white ">
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-transparent "
                          aria-hidden="true"
                        />
                        <div
                          className={cx(
                            "absolute text-center",
                            css`
                              transform: translate(-50%, -5%);
                              top: 40px;
                              left: 50%;
                              width: 100px;
                            `
                          )}
                        >
                          <span>{step.name}</span>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Portal;
