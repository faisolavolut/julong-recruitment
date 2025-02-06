"use client";
import { ButtonBetter } from "@/lib/components/ui/button";
import { siteurl } from "@/lib/utils/siteurl";
import { Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";

const Login: FC = function () {
  const router = useRouter();
  return (
    <section className="bg-gray-700 bg-opacity-60 bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/background.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
        <div className="w-full rounded-lg bg-white shadow dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6 lg:space-y-8 text-sm">
            <div className="flex flex-row justify-center items-center">
              <img
                className="mr-2 h-6 rounded"
                src={siteurl("/logo-full.png")}
                alt="logo"
              />
            </div>
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Login
            </h1>
            <form
              className="mt-4 flex flex-col gap-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/portal");
              }}
            >
              <div className="grid gap-6 grid-cols-1">
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
                  className=" font-medium text-primary-600 hover:underline "
                >
                  Forgot password?
                </a>
              </div>
              <ButtonBetter type="submit" className="">
                Sign in
              </ButtonBetter>

              <p className="font-normal text-gray-900 ">
                Don’t have an account yet?&nbsp;
                <a
                  href="/auth/register"
                  className="font-bold text-primary hover:underline "
                >
                  Register for free
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
