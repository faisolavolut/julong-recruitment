"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import CalenderFull from "@/lib/components/ui/CalenderFull";
import { shortDate } from "@/lib/utils/date";
import get from "lodash.get";
import { getNumber } from "@/lib/utils/getNumber";
import {
  useEditor,
  EditorContent,
  useCurrentEditor,
  EditorProvider,
} from "@tiptap/react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Popover } from "@/lib/components/Popover/Popover";
import { Input } from "@/lib/components/ui/input";
import { ButtonBetter } from "@/lib/components/ui/button";
function Portal() {
  const local = useLocal({
    ready: false,
    access: true,
    data: null as any,
    open: false,
  });
  const router = useRouter();
  const [url, setUrl] = useState(null as any);
  useEffect(() => {}, []);
  const MenuBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
      return null;
    }

    return (
      <div
        className={cx(
          "control-group sticky top-0  bg-white shadow",
          css`
            z-index: 99;
          `
        )}
      >
        <div className="button-group flex flex-row gap-x-2 p-2 ">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={cx(
              editor.isActive("bold") ? "is-active bg-gray-200" : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M4 2h4.5a3.501 3.501 0 0 1 2.852 5.53A3.499 3.499 0 0 1 9.5 14H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m1 7v3h4.5a1.5 1.5 0 0 0 0-3Zm3.5-2a1.5 1.5 0 0 0 0-3H5v3Z"
              />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={cx(
              editor.isActive("italic") ? "is-active bg-gray-200" : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6h4m4 0h-4m0 0l-4 12m0 0h4m-4 0H6"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={cx(
              editor.isActive("strike") ? "is-active bg-gray-200" : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M17.154 14q.346.774.346 1.72q0 2.014-1.571 3.147Q14.357 20 11.586 20q-2.46 0-4.87-1.145v-2.254q2.28 1.316 4.666 1.316q3.826 0 3.839-2.197a2.2 2.2 0 0 0-.648-1.603l-.12-.117H3v-2h18v2zm-4.078-3H7.629a4 4 0 0 1-.481-.522Q6.5 9.643 6.5 8.452q0-1.854 1.397-3.153T12.222 4q2.207 0 4.222.984v2.152q-1.8-1.03-3.946-1.03q-3.72 0-3.719 2.346q0 .63.654 1.099q.654.47 1.613.75q.93.27 2.03.699"
              ></path>
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cx(
              editor.isActive("bulletList") ? "is-active bg-gray-200" : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 15 15"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M1.5 5.25a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5M4 4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M4.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM2.25 7.5a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0m-.75 3.75a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cx(
              editor.isActive("orderedList") ? "is-active bg-gray-200" : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                <path
                  fill="currentColor"
                  d="M5.436 16.72a1.466 1.466 0 0 1 1.22 2.275a1.466 1.466 0 0 1-1.22 2.275c-.65 0-1.163-.278-1.427-.901a.65.65 0 1 1 1.196-.508a.18.18 0 0 0 .165.109c.109 0 .23-.03.23-.167c0-.1-.073-.143-.156-.154l-.051-.004a.65.65 0 0 1-.096-1.293l.096-.007c.102 0 .207-.037.207-.158c0-.137-.12-.167-.23-.167a.18.18 0 0 0-.164.11a.65.65 0 1 1-1.197-.509c.264-.622.777-.9 1.427-.9ZM20 18a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zM6.08 9.945a1.552 1.552 0 0 1 .43 2.442l-.554.593h.47a.65.65 0 1 1 0 1.3H4.573a.655.655 0 0 1-.655-.654c0-.207.029-.399.177-.557L5.559 11.5c.11-.117.082-.321-.06-.392c-.136-.068-.249.01-.275.142l-.006.059a.65.65 0 0 1-.65.65c-.39 0-.65-.327-.65-.697a1.482 1.482 0 0 1 2.163-1.317ZM20 11a1 1 0 0 1 .117 1.993L20 13H9a1 1 0 0 1-.117-1.993L9 11zM6.15 3.39v3.24a.65.65 0 1 1-1.3 0V4.522a.65.65 0 0 1-.46-1.183l.742-.495a.655.655 0 0 1 1.018.545ZM20 4a1 1 0 0 1 .117 1.993L20 6H9a1 1 0 0 1-.117-1.993L9 4z"
                ></path>
              </g>
            </svg>
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cx(
              editor.isActive("heading", { level: 1 })
                ? "is-active bg-gray-200"
                : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M14 4.25a.75.75 0 0 0-1.248-.56l-2.25 2a.75.75 0 0 0 .996 1.12l1.002-.89v5.83a.75.75 0 0 0 1.5 0zm-11.5 0a.75.75 0 0 0-1.5 0v7.496a.75.75 0 0 0 1.5 0V8.75h4v2.996a.75.75 0 0 0 1.5 0V4.25a.75.75 0 0 0-1.5 0v3h-4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cx(
              editor.isActive("heading", { level: 2 })
                ? "is-active bg-gray-200"
                : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M2.5 4.25a.75.75 0 0 0-1.5 0v7.496a.75.75 0 0 0 1.5 0V8.75h4v2.996a.75.75 0 0 0 1.5 0V4.25a.75.75 0 0 0-1.5 0v3h-4zm8.403 1.783A1.364 1.364 0 0 1 12.226 5h.226a1.071 1.071 0 0 1 .672 1.906l-3.61 2.906a1.51 1.51 0 0 0 .947 2.688h3.789a.75.75 0 0 0 0-1.5h-3.793l-.003-.003l-.003-.004v-.004a.01.01 0 0 1 .004-.008l3.61-2.907A2.571 2.571 0 0 0 12.452 3.5h-.226c-1.314 0-2.46.894-2.778 2.17l-.038.148a.75.75 0 1 0 1.456.364z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={cx(
              editor.isActive("heading", { level: 3 })
                ? "is-active bg-gray-200"
                : "",
              "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M2.5 4.25a.75.75 0 0 0-1.5 0v7.496a.75.75 0 0 0 1.5 0V8.75h4v2.996a.75.75 0 0 0 1.5 0V4.25a.75.75 0 0 0-1.5 0v3h-4zm8.114 1.496c.202-.504.69-.834 1.232-.834h.28a.94.94 0 0 1 .929.796l.027.18a1.15 1.15 0 0 1-.911 1.303l-.8.16a.662.662 0 0 0 .129 1.31h1.21a.89.89 0 0 1 .882 1.017a1.67 1.67 0 0 1-1.414 1.414l-.103.015a1.81 1.81 0 0 1-1.828-.9l-.018-.033a.662.662 0 0 0-1.152.652l.018.032a3.13 3.13 0 0 0 3.167 1.559l.103-.015a2.99 2.99 0 0 0 2.537-2.537a2.21 2.21 0 0 0-1.058-2.216a2.47 2.47 0 0 0 .547-1.963l-.028-.179a2.26 2.26 0 0 0-2.237-1.919h-.28a2.65 2.65 0 0 0-2.46 1.666a.662.662 0 1 0 1.228.492"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <Popover
            classNameTrigger={""}
            arrow={false}
            className="rounded-md"
            onOpenChange={(open: any) => {
              if (!editor.isActive("link")) {
                local.open = open;
                local.render();
              }
            }}
            open={local.open}
            content={
              <div className="flex flex-row px-2 py-4 gap-y-2 items-center">
                <Input
                  id="maxWidth"
                  value={url || ""}
                  className="col-span-2 h-9"
                  onChange={(e) => {
                    setUrl(get(e, "currentTarget.value"));
                  }}
                />
                <div className="flex flex-row justify-end">
                  <ButtonBetter
                    onClick={() => {
                      if (url) {
                        try {
                          editor
                            .chain()
                            .focus()
                            .extendMarkRange("link")
                            .setLink({ href: url })
                            .run();
                          local.open = false;
                          local.render();
                          setUrl("");
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }
                    }}
                  >
                    Add
                  </ButtonBetter>
                </div>
              </div>
            }
          >
            <button
              onClick={() => {
                editor.chain().focus().unsetLink().run();
              }}
              className={cx(
                editor.isActive("link") ? "is-active bg-gray-200" : "",
                "text-black text-sm p-1 hover:bg-gray-200 rounded-md"
              )}
            >
              {editor.isActive("link") ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m15.221 12.41l-.91-.91h.65q.214 0 .357.143t.144.357q0 .135-.062.239q-.061.103-.179.17m5.625 9.145q-.16.16-.354.16t-.353-.16L2.445 3.862q-.14-.14-.15-.345t.15-.363t.354-.16t.354.16l17.692 17.692q.14.14.15.345q.01.203-.15.363M7.077 16.077q-1.69 0-2.884-1.193T3 12q0-1.61 1.098-2.777t2.69-1.265h.462l.966.965H7.077q-1.27 0-2.173.904Q4 10.731 4 12t.904 2.173t2.173.904h3.077q.213 0 .357.143t.143.357t-.143.357t-.357.143zM9.039 12.5q-.214 0-.357-.143T8.539 12t.143-.357t.357-.143h1.759l.975 1zm9.134 2.916q-.11-.178-.057-.385t.25-.298q.748-.387 1.19-1.118Q20 12.885 20 12q0-1.27-.894-2.173q-.895-.904-2.145-.904h-3.115q-.213 0-.356-.143t-.144-.357t.144-.357t.356-.143h3.116q1.67 0 2.854 1.193T21 12q0 1.148-.591 2.095q-.592.947-1.553 1.493q-.177.11-.375.057t-.308-.23"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7.077 16.077q-1.692 0-2.884-1.192T3 12t1.193-2.885t2.884-1.193h3.039q.212 0 .356.144t.144.357t-.144.356t-.356.143H7.075q-1.267 0-2.171.904T4 12t.904 2.173t2.17.904h3.042q.212 0 .356.144t.144.357t-.144.356t-.356.143zM9 12.5q-.213 0-.356-.144t-.144-.357t.144-.356T9 11.5h6q.213 0 .356.144t.144.357t-.144.356T15 12.5zm4.885 3.577q-.213 0-.357-.144t-.144-.357t.144-.356t.356-.143h3.041q1.267 0 2.171-.904T20 12t-.904-2.173t-2.17-.904h-3.041q-.213 0-.357-.144q-.143-.144-.143-.357t.143-.356t.357-.143h3.038q1.692 0 2.885 1.192T21 12t-1.193 2.885t-2.884 1.193z"
                  ></path>
                </svg>
              )}
            </button>
          </Popover>
        </div>
      </div>
    );
  };
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
      isAllowedUri: (url: any, ctx: any) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`);

          // use default validation
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false;
          }

          // disallowed protocols
          const disallowedProtocols = ["ftp", "file", "mailto"];
          const protocol = parsedUrl.protocol.replace(":", "");

          if (disallowedProtocols.includes(protocol)) {
            return false;
          }

          // only allow protocols specified in ctx.protocols
          const allowedProtocols = ctx.protocols.map((p: any) =>
            typeof p === "string" ? p : p.scheme
          );

          if (!allowedProtocols.includes(protocol)) {
            return false;
          }

          // disallowed domains
          const disallowedDomains = [
            "example-phishing.com",
            "malicious-site.net",
          ];
          const domain = parsedUrl.hostname;

          if (disallowedDomains.includes(domain)) {
            return false;
          }

          // all checks have passed
          return true;
        } catch {
          return false;
        }
      },
      shouldAutoLink: (url: any) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`https://${url}`);

          // only auto-link if the domain is not in the disallowed list
          const disallowedDomains = [
            "example-no-autolink.com",
            "another-no-autolink.com",
          ];
          const domain = parsedUrl.hostname;

          return !disallowedDomains.includes(domain);
        } catch {
          return false;
        }
      },
    }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
  ];
  const editor = useEditor({
    extensions: [StarterKit, Color, TextStyle, ListItem],
    content: "<p>Hello World! 🌎️</p>",
  });
  const value = "<p>Hello World! 🌎️</p>";
  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <div
      className={cx(
        "flex flex-col relative bg-white",
        css`
          .tiptap h1 {
            font-size: 1.4rem !important;
          }

          .tiptap h2 {
            font-size: 1.2rem !important;
          }

          .tiptap h3 {
            font-size: 1.1rem !important;
          }
          .ProseMirror {
            outline: none !important;
            padding: 10px 2rem 10px 2rem;
          }
          .tiptap a {
            font-weight: bold;
            color: #313678;
            text-decoration: underline;
          }
          .ProseMirror ul,
          ol {
            padding: 0 1rem;
            margin: 1.25rem 1rem 1.25rem 0.4rem;
          }
          .ProseMirror ol {
            list-style-type: decimal;
          }
          .ProseMirror ul {
            list-style-type: disc;
          }
        `
      )}
    >
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        onUpdate={({ editor }) => {
          console.log();
        }}
        content={`<p><strong>Job Description</strong></p><p>We are looking for Contact Center Agents that will be the liaison between Transparent BPO's clients and their current and potential customers. The successful candidates will be able to accept ownership for effectively solving customer issues, completing sales, handling complaints and inquiries; keeping customer satisfaction at the core of every decision and behavior.<br>A successful Agent will manage large amounts of inbound and outbound calls in a timely manner, follow call center "scripts" when handling different topics, and identifying customers' needs, clarify information, research every issue and provide solutions.</p><p></p><p><strong>Responsibilities</strong></p><ul><li><p>Manage large amounts of inbound and outbound calls in a timely manner</p></li><li><p>Follow communication “scripts” when handling different topics</p></li><li><p>Identify customers’ needs, clarify information, research every issue and provide solutions and/or alternatives</p></li><li><p>Seize opportunities to upsell products when they arise</p></li><li><p>Build sustainable relationships and engage customers by taking the extra mile</p></li><li><p>Frequently attend educational seminars to improve knowledge and performance level</p></li><li><p>Sell products and place customer orders in the computer system</p></li><li><p>Provide product and service information to customers</p></li><li><p>Document all call information according to standard operating procedures</p></li><li><p>Recognize, document, and alert the management team of trends in customer calls</p></li><li><p>Identify and escalate issues to supervisors</p></li><li><p>Meet personal/team qualitative and quantitative targets</p></li><li><p>Other duties as assigned</p></li></ul><p>Transparent BPO, the leading contact center in Belize, is seeking qualified applicants to join our team! When applying for this job, you could be eligible for the following positions:</p><ul><li><p>Sales</p></li><li><p>Customer Service</p></li><li><p>Technical Support</p></li><li><p>Data Entry</p></li></ul><p>The fit for these positions will be evaluated during the application process.</p><p></p><p><strong>Requirements</strong></p><p>Th`}
      ></EditorProvider>
    </div>
  );

  // return <EditorContent editor={editor} />;
  return (
    <>
      <div className="relative flex flex-col h-screen w-screen">
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className={cx(
              "flex-grow flex flex-col h-full w-full",
              css`
                .calender {
                  width: 100% !important;
                  display: flex;
                  flex-direction: column;
                }
                .calender-body {
                  flex-grow: 1;
                  display: flex;
                  flex-direction: column;
                }
                .calender-days {
                  flex-grow: 1;
                  row-gap: 0;
                }
                .calender-grid {
                  width: 100%;
                  height: 100%;
                  border-style: solid;
                  border-top-width: 1px;
                  border-bottom-width: 1px;
                  border-right-width: 1px;
                }
                .calender-day-wrap {
                  padding: 0.25rem;
                }
                .calender-grid:nth-child(7n + 1) {
                  border-left-width: 1px;
                  border-right-width: 0;
                }
                .calender-grid:nth-child(7n + 2) {
                  border-left-width: 1px;
                }
                .calender-grid:nth-child(7n) {
                  border-right-width: 1px;
                  border-left-width: 0;
                }
                .calender-grid:nth-child(n + 8):nth-child(-n + 42) {
                  border-top: 0; /* Atau bisa juga gunakan 'none' */
                }
              `
            )}
          >
            <CalenderFull
              disabled={false}
              onMark={(day, date, data) => {
                // console.log({ day, date, data });
                if (get(local, "data.length")) {
                  const yourDay = local.data.find(
                    (e: any) => shortDate(get(e, "date")) === shortDate(date)
                  );
                  if (get(yourDay, "event.length")) {
                    const events = get(yourDay, "eventWeeks");
                    const allEvent = get(yourDay, "event");
                    let showEvent = [];
                    let isMore = false;
                    const showMoreCount = allEvent.filter((e: any) => !e.show);
                    console.log(yourDay.data.date, { showMoreCount });
                    if (showMoreCount.length) {
                      showEvent = events.find((e: any) => e.idx === 0)
                        ? [events.find((e: any) => e.idx === 0)]
                        : [];
                      isMore = true;
                    } else {
                      showEvent = events;
                    }
                    if (!showEvent?.length && isMore) {
                      return (
                        <>
                          <div
                            className={cx(
                              "hover:bg-gray-200 font-bold text-sm text-black px-2 absolute top-[27px] left-0 rounded-md",
                              css`
                                width: ${data.width - 10}px;
                                top: 27px;
                                z-index: 1;
                              `
                            )}
                          >
                            {showMoreCount?.length} more
                          </div>
                        </>
                      );
                    } else if (showEvent?.length) {
                      return (
                        <>
                          {showEvent.map((e: any, idx: any) => {
                            return (
                              <div
                                key={
                                  "day-event_" +
                                  get(yourDay, "data.date") +
                                  "_" +
                                  idx
                                }
                                className={cx(
                                  `hover:bg-blue-600 font-bold text-sm text-white px-2 absolute left-0 bg-blue-500 rounded-md`,
                                  css`
                                    width: ${data.width * get(e, "count") +
                                    (get(e, "count") === 7 ? 8 : 0)}px;
                                    top: ${(e?.idx - 1) * 27}px;
                                    z-index: 1;
                                  `
                                )}
                              >
                                {e?.name}
                              </div>
                            );
                          })}
                          {isMore && (
                            <div
                              className={cx(
                                "hover:bg-gray-200 font-bold text-sm text-black px-2 absolute top-[27px] left-0 w-[196px] rounded-md",
                                css`
                                  width: ${data.width}px;
                                  top: 27px;
                                  z-index: 1;
                                `
                              )}
                            >
                              {showMoreCount?.length} more
                            </div>
                          )}
                        </>
                      );
                    }
                  }
                }
                return <></>;
              }}
              style="custom"
              displayFormat="DD MMM YYYY"
              mode={"daily"}
              maxDate={null}
              minDate={null}
              asSingle={true}
              useRange={false}
              onLoad={async (value: any) => {
                const data = [
                  {
                    id: 1,
                    name: "Checkup",
                    startDate: new Date(2024, 11, 31),
                  },
                  {
                    id: 2,
                    name: "Persiapan SBMPTN",
                    startDate: new Date(2024, 11, 29),
                    endDate: new Date(2025, 0, 7),
                  },
                  {
                    id: 3,
                    name: "Wawancara",
                    startDate: new Date(2024, 11, 31),
                    endDate: new Date(2025, 0, 9),
                  },
                ];
                const mapEventsByDate = (data: any) => {
                  const events = data.data;
                  const calendarTimes = [
                    ...get(data, "value.calender.time.previous"),
                    ...get(data, "value.calender.time.current"),
                    ...get(data, "value.calender.time.next"),
                  ];
                  const result = [] as any[];
                  calendarTimes.reduce((acc: any, dateStr: any, index) => {
                    const date = new Date(dateStr);
                    const weekStart = new Date(date);
                    const day = weekStart.getDay();
                    const formattedDate = shortDate(date);
                    weekStart.setDate(weekStart.getDate() - day); // Go back to Sunday
                    const formattedWeekStart = shortDate(weekStart);
                    result.push({
                      date: date,
                      eventLabel: [],
                      eventWeeksLabel: [],
                      event: [],
                      eventWeeks: [],
                      data: {
                        date: formattedDate,
                        week: formattedWeekStart,
                      },
                    });

                    events.map((event: any) => {
                      const startDate = new Date(event.startDate);
                      const endDate = event.endDate
                        ? new Date(event.endDate)
                        : startDate;

                      if (date >= startDate && date <= endDate) {
                        result[index].event.push({
                          ...event,
                          count: 1,
                          show: true,
                        });
                        result[index].eventLabel.push(event.name);
                        if (event) {
                          const weeksDays = result.filter(
                            (e) => get(e, "data.week") === formattedWeekStart
                          );
                          const yourDay = result.find(
                            (e: any) => get(e, "data.date") === formattedDate
                          );
                          if (!get(weeksDays, "length")) {
                            result[index].eventWeeksLabel.push(event.name);
                            result[index].eventWeeks.push({
                              ...event,
                              count: 1,
                              show: true,
                              idx: getNumber(get(yourDay, "event.length")),
                            });
                          } else {
                            const findFirstEvent = weeksDays.find((e) =>
                              e?.eventWeeks?.find(
                                (ex: any) => ex?.id === event?.id
                              )
                            );
                            if (formattedDate === "31/12/2024") {
                              console.log({ weeksDays, yourDay });
                            }
                            if (!findFirstEvent) {
                              result[index].eventWeeksLabel.push(event.name);
                              result[index].eventWeeks.push({
                                ...event,
                                count: 1,
                                idx: getNumber(get(yourDay, "event.length")),
                                show: true,
                              });
                            } else {
                              const yourEvent = findFirstEvent.eventWeeks.find(
                                (e: any) => e?.id === event?.id
                              );
                              if (yourEvent) {
                                yourEvent.count =
                                  getNumber(get(yourEvent, "count")) + 1;
                              }
                            }
                          }
                        }
                      }
                    });

                    return acc;
                  }, {});

                  const dayEvent = result.filter((e) =>
                    get(e, "eventWeeks.length")
                  );
                  dayEvent.map((e) => {
                    const eventDay = e.event;
                    eventDay.map((event: any) => {
                      const weeksDays = result.filter(
                        (ex) =>
                          get(ex, "data.week") === get(e, "data.week") &&
                          ex.event.find(
                            (el: any) => get(el, "id") === get(event, "id")
                          )
                      );
                      const firstDay = result.find(
                        (ex) =>
                          get(ex, "data.week") === get(e, "data.week") &&
                          ex.eventWeeks.find(
                            (el: any) => get(el, "id") === get(event, "id")
                          )
                      );
                      if (weeksDays && get(firstDay, "event.length") > 2) {
                      }
                      event.count = weeksDays.length;
                    });

                    const sortEvent = eventDay.sort(
                      (a: any, b: any) => b.count - a.count
                    );
                    const eventWeeks = e.eventWeeks;
                    eventWeeks.map((e: any) => {
                      const findEvent = sortEvent.find(
                        (ex: any) => get(ex, "id") === get(e, "id")
                      );
                      if (findEvent) {
                        const index = sortEvent.findIndex(
                          (ex: any) => get(ex, "id") === get(e, "id")
                        );
                        e.idx = index + 1;
                      }
                    });
                  });
                  result.map((e) => {
                    const eventDay = e.event;
                    eventDay.map((event: any) => {
                      const firstDay = result.find(
                        (ex) =>
                          get(ex, "data.week") === get(e, "data.week") &&
                          ex.eventWeeks.find(
                            (el: any) => get(el, "id") === get(event, "id")
                          )
                      );
                      if (get(firstDay, "event.length") > 2) {
                        const eventWeeks = firstDay.eventWeeks.find(
                          (e: any) => get(e, "id") === event?.id
                        );
                        if (e.data.date === "01/01/2025") {
                          console.log({ eventWeeks });
                        }
                        event.show = eventWeeks.idx === 0;
                      }
                    });
                  });
                  return result;
                };
                console.log(
                  mapEventsByDate({
                    data: data,
                    value,
                  })
                );
                local.data = mapEventsByDate({
                  data: data,
                  value,
                });
                local.render();
              }}
              onChange={async (value: any) => {}}
              value={null}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Portal;
