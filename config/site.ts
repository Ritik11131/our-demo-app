export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Tracking",
  description: "Need help with your school work? We got you covered!",
  welcomeMsg: "Welcome back",
  navItems: [
    {
      label: "Dashboard",
      href: "/main/dashboard",
    },
    {
      label: "Tracking",
      href: "/main/tracking",
    },
    {
      label: "User",
      href: "/main/user",
    },
    {
      label: "Devices",
      href: "/main/devices",
    },
    {
      label: "Reports",
      href: "/main/reports",
    },
  ],
  profileItems: [
    {
      key: "profile",
      content: "Signed in as",
      email: "zoey@example.com",
      isProfile: true,
    },
    { key: "logout", 
      content: "Log Out", 
      color: "danger"
    },
  ]
};
