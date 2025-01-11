"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "@nextui-org/spinner"; // Assuming you are using next-ui

const ProtectedRoute: React.FC<any> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthentication = async () => {
      // Get the access token from localStorage or cookies
      const accessToken = localStorage.getItem("access_token");

      // Placeholder for token validation logic
      const isValidToken = accessToken ? true : false; // Replace with actual validation logic

      if (!isValidToken) {
        setIsAuthenticated(false);
        if (!pathname.startsWith("/auth")) {
          router.replace("/auth/login"); // Redirect to login page if not authenticated
        }
      } else {
        setIsAuthenticated(true);
        if (pathname.startsWith("/auth") || pathname === "/auth") {
          router.replace("/main/dashboard"); // Redirect to main page if authenticated
        }


        if (pathname === "/main/dashboard" || pathname === '/main/route-management') {
          if (!localStorage.getItem("hasVisited")) {
            localStorage.setItem("hasVisited", "true");
          }
        }

        if (pathname === "/main" || pathname === "/") {
          if (localStorage.getItem("hasVisited")) {
            router.replace("/main/dashboard");
          } else {
            router.replace("/main");
          }
        }
      }
      setIsLoading(false); // Set loading to false after authentication check
    };

    checkAuthentication();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Prevent rendering the main pages if not visited and Prevent rendering the auth pages if authenticated
  if (
    (localStorage.getItem('hasVisited') && pathname === "/main") ||
    (isAuthenticated && pathname.startsWith("/auth"))
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    ); 
  }

  return (
    <>{isAuthenticated || pathname.startsWith("/auth") ? children : null}</>
  );
};

export default ProtectedRoute;
