"use client";
import { Field } from "@/lib/components/form/Field";
import { Form } from "@/lib/components/form/Form";
import { ButtonBetter } from "@/lib/components/ui/button";
import { siteurl } from "@/lib/utils/siteurl";
import { useRouter } from "next/navigation";
import type { FC } from "react";

const Login: FC = function () {
  const router = useRouter();
  return (
    <section className="bg-gray-700 bg-opacity-60 bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/background.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
        <div className="w-full rounded-lg bg-white shadow dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="flex flex-col gap-y-4 p-8">
            <div className="flex flex-row justify-center items-center">
              <img
                className="mr-2 h-6 rounded"
                src={siteurl("/logo-full.png")}
                alt="logo"
              />
            </div>
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900">
              Create Account
            </h1>
            <Form
              onSubmit={async (fm: any) => {
                if (fm.data?.password !== fm.data?.confirm_password) {
                  throw new Error("Password does not match");
                }
              }}
              onLoad={async () => {
                return {};
              }}
              showResize={false}
              header={(fm: any) => {
                return <></>;
              }}
              children={(fm: any) => {
                return (
                  <>
                    <div className={cx("flex flex-row flex-wrap py-2")}>
                      <div className="flex-grow grid gap-4 grid-cols-1">
                        <div>
                          <Field
                            fm={fm}
                            name={"email"}
                            label={"Email"}
                            type={"email"}
                            required={true}
                            placeholder="Your email"
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"password"}
                            label={"Password"}
                            type={"password"}
                            placeholder="Your Password"
                            required={true}
                          />
                        </div>

                        <div>
                          <Field
                            fm={fm}
                            name={"confirm_password"}
                            label={"Confirm Password"}
                            onChange={() => {
                              if (
                                fm?.data?.confirm_password !==
                                fm?.data?.password
                              ) {
                                fm.error["confirm_password"] =
                                  "Password does not match";
                              } else {
                                delete fm.error["confirm_password"];
                              }
                              fm.render();
                            }}
                            type={"password"}
                            placeholder="Your Password"
                            required={true}
                          />
                        </div>
                        <div>
                          <Field
                            fm={fm}
                            name={"gender"}
                            label={"Gender"}
                            type={"dropdown"}
                            required={true}
                            placeholder={"Your Gender"}
                            onLoad={() => {
                              return [
                                {
                                  value: "MALE",
                                  label: "Male",
                                },
                                {
                                  value: "FEMALE",
                                  label: "Female",
                                },
                              ];
                            }}
                          />
                        </div>
                        <div className="flex flex-row items-center">
                          <ButtonBetter className=" px-6">
                            Create Account
                          </ButtonBetter>
                        </div>
                      </div>
                    </div>
                  </>
                );
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
