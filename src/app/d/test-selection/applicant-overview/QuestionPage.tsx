import { Field } from "@/lib/components/form/Field";
import get from "lodash.get";
import { FC } from "react";

export const QuestionPage: FC<{
  fm: any;
  tab: string;
  value: string;
  children: any;
  className?: string;
}> = ({ fm, tab, value, children, className }) => {
  if (get(fm, `data.${tab}`) === value) {
    return (
      <>
        <div
          className={cx(
            "grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8",
            className
          )}
        >
          {children}
        </div>
      </>
    );
  }
  return <></>;
};
