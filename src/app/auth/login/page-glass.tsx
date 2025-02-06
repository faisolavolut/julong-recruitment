"use client";
import { siteurl } from "@/lib/utils/siteurl";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";

const Login: FC = function () {
  const router = useRouter();
  return (
    <section
      className={cx(
        css`
          background-image: url("${siteurl("/bg-portal.png")}");
        `,
        "bg-primary bg-opacity-60  bg-cover bg-center bg-no-repeat bg-blend-multiply"
      )}
    >
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen text-white">
        <div className="w-full rounded-lg glass shadow dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="flex flex-col gap-y-4 py-8 px-16">
            <div>
              <a
                href="#"
                className="flex items-center font-semibold text-white"
              >
                <img
                  className="mr-2 h-6 rounded"
                  src="/logo-full.png"
                  alt="logo"
                />
              </a>
            </div>
            <h1 className=" text-xl font-bold leading-tight tracking-tight">
              Login
            </h1>
            <form
              className="flex flex-col gap-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/portal");
              }}
            >
              <div className="grid gap-4 grid-cols-1">
                <div>
                  <Label htmlFor="email" className="mb-2 block ">
                    Email
                  </Label>
                  <TextInput
                    id="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="mb-2 block ">
                    Password
                  </Label>
                  <TextInput
                    id="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-md font-medium text-primary-600 hover:underline "
                >
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                className="w-full group flex h-min items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg focus:ring-2 w-full"
              >
                Sign in to your account
              </Button>

              <p className="text-md font-medium text-gray-900 ">
                Don’t have an account yet?&nbsp;
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline "
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
