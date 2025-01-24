"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";

const Login: FC = function () {
  const router = useRouter();
  return (
    <section className="bg-gray-700 bg-opacity-60 bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/background.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
        <a
          href="#"
          className="mb-6 flex items-center text-2xl font-semibold text-white"
        >
          <img className="mr-2 h-12 rounded" src="/jobsuit.png" alt="logo" />
          Portal
        </a>
        <div className="w-full rounded-lg bg-white shadow dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6 lg:space-y-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form
              className="mt-4 space-y-6 sm:mt-6"
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
              <div className="flex items-center">
                <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="px-5 text-center text-gray-500 ">or</div>
                <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="space-y-3">
                <Button
                  href="#"
                  color="gray"
                  className="w-full hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg
                    aria-hidden
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_13183_10121)">
                      <path
                        d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                        fill="#3F83F8"
                      />
                      <path
                        d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_13183_10121">
                        <rect
                          width="20"
                          height="20"
                          fill="white"
                          transform="translate(0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  Sign in with Google
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <Checkbox id="remember-illustration" />
                  </div>
                  <div className="ml-3 text-md">
                    <Label
                      htmlFor="remember-illustration"
                      className="text-gray-500 "
                    >
                      Remember me
                    </Label>
                  </div>
                </div>
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
