// all possiple languages that are written from right to left
// so that i don't need to modify much if i add a new language in the future
export const rtlLanguages = ["ar", "he", "fa", "ur", "ku", "dv", "az", "arc"];
// supported languages in the app
export const languages = [
  { locale: "ar", title: "العربية", icon: "https://flagcdn.com/w20/sy.png" },
  { locale: "en", title: "English", icon: "https://flagcdn.com/w20/us.png" },
];
// default languages
export const defaultLng = "en";

// regex for normal text
export const textRegex =
  /^[\p{L}\p{S}\p{P}\p{N}]+\s+[\p{L}\p{S}\p{P}\p{N}]+([\p{L}\p{S}\p{P}\p{N}\s]*)*$/u;
// regex for email addresses
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// sections of the app
export const sections = ["home", "about", "skills", "projects", "contact"];

// footer pages for website navigation
export const footerPages = [
  { href: "/", labelKey: "home" },
  { href: "/products", labelKey: "shop" },
  { href: "/about", labelKey: "about_us" },
  { href: "/support", labelKey: "customer_service" },
];

// my contact methods
export const contactMethods = [
  {
    name: "phone",
    title: "+963 938 912 156",
    href: "tel:+963938912156",
    icon: "fa:phone",
  },
  {
    name: "email",
    title: "mohammad.kikhia1997@gmail.com",
    href: "mailto:mohammad.kikhia1997@gmail.com",
    icon: "fa:envelope",
  },
  {
    name: "location",
    title: "Latakia, Syria",
    icon: "fa-solid:map-marked-alt",
  },
];

export const githubLink = "https://github.com/mohammad-kikhia/";
export const linkedinLink = "https://www.linkedin.com/in/mohammad-kikhia/";
export const telegramLink = "https://t.me/M7MD_kh97/";
export const instagramLink = "https://www.instagram.com/mohammad_ki711/";

// my social media links
export const socials = [
  {
    title: "LinkedIn",
    href: linkedinLink,
    icon: "fa:linkedin-square",
  },
  {
    title: "GitHub",
    href: githubLink,
    icon: "fa:github",
  },
  {
    title: "Telegram",
    href: telegramLink,
    icon: "fa:telegram",
  },
  {
    title: "Instagram",
    href: instagramLink,
    icon: "fa:instagram",
  },
];
