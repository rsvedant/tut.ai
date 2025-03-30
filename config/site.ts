export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "tut.ai - AI-Powered Education",
    description:
        "Transform your learning experience with personalized AI tutors across any subject.",
    navItems: [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Features",
            href: "/features",
        },
        {
            label: "Pricing",
            href: "/pricing",
        },
        {
            label: "Subjects",
            href: "/subjects",
        },
        {
            label: "About",
            href: "/about",
        },
    ],
    navMenuItems: [
        {
            label: "Dashboard",
            href: "/app",
        },
        {
            label: "Profile",
            href: "/profile",
        },
        {
            label: "My Tutors",
            href: "/tutors",
        },
        {
            label: "Settings",
            href: "/settings",
        },
        {
            label: "Help & Support",
            href: "/help",
        },
        {
            label: "Feedback",
            href: "/feedback",
        },
        {
            label: "Logout",
            href: "/logout",
        },
    ],
    links: {
        github: "https://github.com/rsvedant/tut.ai",
        twitter: "https://twitter.com/tut_ai",
        docs: "https://docs.tut.ai",
        discord: "https://discord.gg/tut-ai",
        sponsor: "https://tut.ai/sponsor",
    },
};
