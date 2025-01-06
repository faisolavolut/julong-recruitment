import { siteurl } from "@/lib/utils/siteurl";
import { Avatar } from "flowbite-react";
import type { FC } from "react";

const TestimonialsCard: FC<any> = function ({ title, data }) {
  return (
    <figure className="rounded bg-gray-50 p-6 dark:bg-gray-800">
      <blockquote className="text-sm text-gray-500 dark:text-gray-400">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="my-4">{data}</p>
      </blockquote>
      <figcaption className="flex items-center space-x-3">
        <Avatar
          img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
          rounded
          size="sm"
        >
          <div className="space-y-0.5 font-medium dark:text-white">
            <div>Bonnie Green</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              CTO at Open AI
            </div>
          </div>
        </Avatar>
      </figcaption>
    </figure>
  );
};

export default TestimonialsCard;
