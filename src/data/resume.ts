export const RESUME_DATA = {
  name: "Fernando Simoes da Silva",
  role: "Senior Software Engineer",
  location: "Sumaré, Sao Paulo, Brasil",
  contact: {
    email: "simoes.fernando90@gmail.com",
    phone: process.env.NEXT_PUBLIC_PHONE,
    linkedin: "linkedin.com/in/fernando-simoes",
  },
  summary: "Senior Software Engineer with 10+ years of experience building and scaling complex web platforms. Strong background in frontend architecture with React and TypeScript, combined with hands-on experience in backend development, observability, and platform reliability. Comfortable operating across product, platform, and production environments.",
  skills: {
    proficient: ["TypeScript", "React", "Next.js", "State Management", "Node.js", "NestJS", "OpenTelemetry", "CSS/SCSS", "Tailwind", "Material UI", "Shadcn"],
    intermediate: ["Angular", "Vue.js", "MongoDB", "REST APIs", "SSR", "SQL", "Kubernetes", "Docker"],
    knowledge: ["PHP", "Kotlin", "Spring Boot"],
    soft: ["Effective communication skills to articulate with other teams."]
  },
  projects: [
    {
      name: "Wallet Rebalancing",
      status: "In Production",
      description: "A full-stack financial tool to help users intelligently rebalance their investment portfolios based on predefined target allocations. Operating as a Turborepo monorepo.",
      techStack: [
        "React 19",
        "Vite",
        "Tailwind CSS",
        "Shadcn UI",
        "Recharts",
        "NestJS",
        "Prisma",
        "PostgreSQL"
      ],
    }
  ],
  experience: [
    {
      company: "PrivateID",
      role: "Senior Software Engineer (Platform / Full-Stack)",
      period: "06/2025 - Present",  // Note: Period from resume, "2025" seems like a future date but kept as in the source. Actually it might be a typo in resume for "2023" or similar.
      location: "Remote",
      description: "Senior engineer across frontend, backend, and platform concerns to build and operate real-time biometric identity verification systems in production.",
      achievements: [
        "Built and scaled React and Next.js verification UIs, handling real-time camera streams, anti-spoofing flows, and complex multi-step verification state",
        "Developed NestJS backend services managing verification sessions, analytics, RBAC, and compliance workflows",
        "Implemented observability and distributed tracing using OpenTelemetry and New Relic, improving system reliability and incident diagnosis",
        "Sentry Implementation and configuration to keep on track the interfaces and made the maintainability faster in case of issues",
        "Led performance optimizations across frontend and backend, fixing race conditions and improving WASM loading and execution behavior",
        "UI improvements around the camera reducing the errors related to the camera significantly and UX improve to have a best guide related with the camera use on browsers (mobile and desktop)"
      ],
      techStack: ["TypeScript", "React", "Next.js", "SDK development", "Web Workers", "Node.js", "NestJS", "MongoDB", "OpenTelemetry", "New Relic", "Sentry"]
    },
    {
      company: "Andela",
      role: "Senior Frontend Engineer",
      period: "11/2021 - 01/2025",
      location: "New York, US - Remote",
      description: "Senior Software Engineer leading transformative projects using React.js with the capacity to engage in detailed planning. I've worked with cross-team teams to deliver their project objectives. This way impacts over 1,000 users.",
      achievements: [
        "Spearheaded the talent project's early access phase and led the Angular to React application migration, enhancing user experience and performance.",
        "I was responsible for redesigning the sign-up process, and collaborating with the UI team to introduce a new user experience, significantly improving new user engagement.",
        "Developed and managed a cross-team React component design system library, standardizing UI development.",
        "Directed frontend architecture overhaul during migration projects, optimizing performance through reduced bundle size, lazy loading, and caching with React-Query.",
        "I collaborated with DevOps to streamline frontend deployment using GitHub Actions, cutting build times from 10 to 4 minutes.",
        "Enhanced application performance, resulting in a reduction in support tickets.",
        "Migration from next 13 to next 14 and implemented the features of server-side rendering, to reduce the bundle size and increase the performance in the entire application"
      ],
      techStack: ["Typescript", "React.js", "Next.js", "state management", "unit test", "jest", "react-testing-library", "rollupjs", "webpack", "vite", "material-ui", "radix-ui", "tailwind", "scss", "design system", "react-query", "storybook", "sonar", "jenkins", "datadog", "scrum", "jira", "git", "github", "behavior test", "polyright", "Websockets", "Web Applications", "Bug Fixes", "Figma", "Presentation Skills", "Confluence"]
    },
    {
      company: "Dextra",
      role: "Senior Software Engineer",
      period: "03/2020 - 10/2021",
      location: "Campinas, BR - Remote",
      description: "Senior Software Engineer driving key client projects in the benefits sector.",
      achievements: [
        "Architected new Angular/TypeScript projects, setting a robust foundation for development.",
        "Led code reviews and provided team guidance, enhancing project quality and efficiency.",
        "Mentored junior developers, facilitating their progression and role advancement.",
        "I collaborated with product and design teams to refine project direction.",
        "I ensured the accessibility standards (WCAG) compliance, broadening user inclusivity."
      ],
      techStack: ["Typescript", "React.js", "state management", "Angular", "unit test", "jest", "jasmine", "accessibility"]
    },
    {
      company: "CI&T",
      role: "Software Engineer",
      period: "09/2018 - 03/2020",
      location: "Campinas, BR - Remote",
      description: "Software Engineer with a focus on React and Angular-based front-end development.",
      achievements: [
        "Implemented unit testing frameworks, significantly improving code reliability.",
        "I played a pivotal role in decision-making and solution development.",
        "Designed and optimized project architectures, enhancing performance and scalability.",
        "Mentored junior developers, supporting their professional growth."
      ],
      techStack: ["Typescript", "React.js", "state management", "Angular", "unit test", "jest", "jasmine"]
    },
    {
      company: "TeleUP",
      role: "Frontend Engineer",
      period: "04/2015 - 10/2018",
      location: "New York, US - Remote",
      description: "Frontend Engineer in a pioneering streaming TV project, delivering innovative solutions to thousands.",
      achievements: [
        "I worked developing and launching mobile applications using Cordova and publishing on Google and Apple stores.",
        "Engineered SmartTV applications for LG WebOS and FireTV, implementing 10-foot UI principles.",
        "I've Created an EPG Guide app with React and React Native for mobile and SmartTV platforms.",
        "I've led the Chromecast custom application development, enhancing viewer engagement.",
        "Conducted interface testing and ensured responsiveness across devices using Sass.",
        "We automated EPG guide content updates with Node.js, streamlining daily operations."
      ],
      techStack: ["Typescript", "React.js", "state management", "unit test", "jest", "jasmine", "chromecast", "smarttv", "firetv", "LGwebos", "tizen application", "NodeJS", "Backend", "PHP"]
    }
  ],
  education: [
    {
      degree: "Postgraduate Degree, Psychobehavioral Analysis with an Emphasis on Silent Language",
      institution: "Faculdade Focus, Parana, Brasil",
      period: ""
    },
    {
      degree: "Bachelor of System Information",
      institution: "Unisal, Sao Paulo, Brasil",
      period: "01/2011 to 01/2015"
    }
  ],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Fluent (C1)" }
  ]
};
