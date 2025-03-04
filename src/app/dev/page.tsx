"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { EditorProvider } from "@tiptap/react";
function Portal() {
  const local = useLocal({
    ready: false,
    access: true,
    data: null as any,
    open: false,
  });
  const router = useRouter();
  const [url, setUrl] = useState(null as any);

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
}

export default Portal;
