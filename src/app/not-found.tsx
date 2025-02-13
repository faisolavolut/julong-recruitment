import { siteurl } from "@/lib/utils/siteurl";

export default function NotFound() {
  return (
    <section className="h-screen flex flex-grow flex-row w-full h-full">
      <div className="flex flex-row flex-grow items-center justify-center">
        <div className="max-w-screen-sm text-center flex flex-col flex-grow items-center justify-center">
          <img
            alt=""
            src={siteurl("/404-computer.svg")}
            className="mx-auto mb-4"
          />
          <h1 className="mb-4 text-2xl font-extrabold text-primary-600 ">
            404 Not Found
          </h1>
          <p className="mb-10 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Whoops! That page doesn’t exist.
          </p>
        </div>
      </div>
    </section>
  );
}

NotFound.layout = "blank";
