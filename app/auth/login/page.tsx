"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useRouter } from "next/navigation"; // If you're using Next.js for routing
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Import the login function from useAuth hook
  const [action, setAction] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-[400px] p-4 md:p-6 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex flex-col text-center md:text-left">
            <p className="text-lg font-semibold">Login</p>
            <p className="text-sm text-default-500">
              Access your account to continue
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Form
            className="w-full flex flex-col mt-4 gap-4"
            validationBehavior="native"
            onReset={() => setAction("reset")}
            onSubmit={async (e) => {
              e.preventDefault();
              const { username, password} : any = Object.fromEntries(new FormData(e.currentTarget));
              setIsLoading(true);
              setError(null);

              try {
                const response = await login(username, password);
                console.log(response);
                // If login is successful, redirect to the main home page
                router.push("/main");
              } catch (err) {
                // If an error occurs during login, display an error message
                setError("Failed to login. Please check your credentials and try again.");
              } finally {
                setIsLoading(false);
                
              }
            }}
          >
            <Input
              isRequired
              defaultValue="appdemo"
              errorMessage="Please enter a valid username"
              label="Username"
              labelPlacement="outside"
              name="username"
              placeholder="Enter your username"
              type="text"
              className="w-full"
            />

            <Input
              isRequired
              defaultValue="12345678"
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              className="w-full"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <Button
                isLoading={isLoading}
                color="primary"
                type="submit"
                className="w-full"
              >
                Login
              </Button>
              {/* <Button type="reset" variant="flat" className="w-full md:w-auto">
              Reset
            </Button> */}
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
