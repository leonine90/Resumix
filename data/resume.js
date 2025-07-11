export const resumeData = {
  // Flag to enable/disable editing mode
  editable: true,
  
  // Flag to enable/disable version functionality (currently disabled)
  enableVersions: false,
  
  // Header visibility controls
  headerElements: {
    headshot: true,
    address: true,
    dateOfBirth: true,
    phone: true,
    email: true,
    linkedin: true
  },
  
  // Section visibility controls
  sections: {
    summary: true,
    researchInterests: true,
    education: true,
    experience: true,
    publications: true,
    skills: true,
    volunteering: true,
    languages: true,
    signature: true
  },
  
  // Section order (summary is always first)
  sectionOrder: ['summary', 'researchInterests', 'education', 'experience', 'publications', 'skills', 'languages', 'volunteering', 'signature'],
  
  personal: {
    name: "Navid Shiry",
    title: "Front-end Engineer",
    address: "Tehran, Iran",
    dateOfBirth: "1990/06/11",
    phone: "+989362067267",
    email: "navid.shiry@gmail.com",
    linkedin: "https://linkedin.com/in/navid-shiry",
    linkedinText: "/navid-shiry",
    headshot: "" // Headshot URL - paste image URL in sidebar
  },

  researchInterests: {
    "data-version": [
      {
        title: "Scalable Software Architectures for Data-Intensive Systems",
        description: "Focus on designing and optimizing large-scale web applications that handle high-volume data, emphasizing reliability and maintainability."
      },
      {
        title: "Big Data Analytics & Machine Learning",
        description: "Interest in leveraging machine learning models and data pipelines to provide predictive insights, improve personalization, and enhance user experience."
      },
      {
        title: "Distributed Computing & Cloud Technologies",
        description: "Exploring containerization, microservices, and distributed databases for efficient data processing and real-time analytics."
      },
      {
        title: "Performance Optimization & Front-End Engineering",
        description: "Investigating advanced caching strategies, code optimization, and micro-frontends to achieve seamless, high-performance user interfaces in data-rich applications."
      },
      {
        title: "User-Centric Design & Human-Computer Interaction",
        description: "Studying user engagement methods, data-driven UI/UX design, and accessibility guidelines to create intuitive systems for diverse user bases."
      }
    ],
    "v-3": [
      {
        title: "High-Performance and Distributed Computing",
        description: "Investigating scalable software systems that utilize distributed architectures, containerization, and real-time data pipelines for efficient computation."
      },
      {
        title: "Machine Learning & Data-Driven Engineering",
        description: "Applying predictive models and data analytics to improve user experiences, automation, and decision-making in complex software systems."
      },
      {
        title: "Quantum and Emerging Computational Models",
        description: "Exploring the potential of quantum computing and non-traditional paradigms for solving computationally intensive problems."
      },
      {
        title: "Scientific Computing & Simulation",
        description: "Developing visualization tools and interactive interfaces to support computational simulations and model-driven problem-solving."
      },
      {
        title: "AI-Enhanced Human-Computer Interaction",
        description: "Studying the integration of AI, UI/UX, and front-end systems to build intelligent, responsive, and accessible user environments."
      },
      {
        title: "Software Engineering for Innovation",
        description: "Designing modular, maintainable software architectures that support interdisciplinary research and agile development in tech-intensive domains."
      }
    ],
    "web-version": [
      {
        title: "Advanced Web Application Architectures",
        description: "Exploring scalable and maintainable designs for web applications, emphasizing the use of both proprietary and open-source back-end technologies to enhance performance and user experience."
      },
      {
        title: "Front-End Development for Diverse Platforms",
        description: "Investigating methodologies for creating responsive and adaptive user interfaces optimized for browsers and mobile devices, utilizing the latest front-end technologies and frameworks."
      },
      {
        title: "Web Application Security",
        description: "Analyzing risk assessment strategies and implementing robust security measures to protect web applications from vulnerabilities and threats.​"
      },
      {
        title: "Agile and Traditional Web Development Methodologies",
        description: "Comparing and contrasting agile and traditional project management approaches in web development to optimize workflow efficiency and product quality."
      },
      {
        title: "Human-Computer Interaction in Web Environments",
        description: "Studying user behavior and interaction patterns to inform the design of intuitive and user-friendly web interfaces."
      },
      {
        title: "Integration of Emerging Technologies in Web Engineering",
        description: "Exploring the incorporation of cutting-edge technologies such as Progressive Web Apps (PWAs), serverless architectures, and microservices into web development practices."
      }
    ],
    "ai-version": [
      {
        title: "Digital Transformation & Innovation Management",
        description: "Exploring strategies for successfully navigating digital transformation in businesses, focusing on leveraging emerging technologies to optimize organizational processes and enhance competitive advantage."
      },
      {
        title: "Business Intelligence & Data-Driven Decision Making",
        description: "Interest in utilizing data analytics, machine learning, and AI-driven models to inform strategic decision-making, improve operational efficiency, and foster innovation across industries."
      },
      {
        title: "Technology & Innovation Strategy",
        description: "Investigating frameworks for managing technological innovation, understanding technology adoption patterns, and analyzing the impact of disruptive innovations on traditional business models."
      },
      {
        title: "IT Governance & Enterprise Systems",
        description: "Studying effective governance frameworks for IT infrastructures, emphasizing enterprise system integration, cybersecurity management, and aligning IT strategy with overall business objectives."
      },
      {
        title: "User-Centric Digital Platforms & Services",
        description: "Developing insights into designing user-focused digital platforms and services, emphasizing enhancing user experience, customer engagement, and accessibility in digital business ecosystems."
      }
    ]
  },

  education: [
    {
      institution: "Shahrood University of Technology",
      location: "Shahrood, Iran",
      degree: "B.Sc. Software Engineering",
      period: "2008 - 2013",
      coursework: [
        "Algorithms & Data Structures",
        "Artificial Intelligence",
        "Database Systems & SQL",
        "Web Programming & Software Architecture",
        "Operating Systems Fundamentals",
        "Computer Networks"
      ],
      finalProject: {
        title: "Introduction to Quantum Computing",
        objective: "Explored the fundamental principles of quantum mechanics and their application to computational models.",
        keyTopics: "Covered qubits, superposition, entanglement, and quantum logic gates, focusing on how these concepts differ from classical computing paradigms.",
        outcome: "Designed a Quantum Multiplexer that leverages quantum-state encoding to efficiently route data, showcasing the potential of quantum computing in advanced information processing."
      }
    },
    {
      institution: "Rah-e Danesh Pre-University Center",
      location: "Semnan, Iran",
      degree: "Pre-University Diploma in Mathematics & Physics",
      period: "2007 – 2008",
      gpa: "18.70/20",
      description: "Emphasis on advanced mathematics, discrete structures, and fundamental physics—providing a robust foundation for computer and data-driven disciplines."
    },
    {
      institution: "Rah-e Danesh Boys High School",
      location: "Semnan, Iran",
      degree: "Diploma in Mathematics & Physics",
      period: "2004 – 2007",
      gpa: "18.82/20",
      description: "Strong background in calculus, geometry, and physical sciences, supporting further studies in computer engineering and data analytics."
    }
  ],

  summary: {
    "default": "Experienced Front-end Engineer with a strong background in React, TypeScript, Next.js, and UI/UX collaboration, specializing in building high-performance, user-friendly web applications. Proven track record of enhancing user engagement, optimizing web performance, and implementing state management solutions across e-commerce, logistics, and digital platforms. Passionate about crafting seamless digital experiences, improving accessibility, and driving innovation through modern front-end technologies."
  },

  experience: [
    {
      company: "Snapp! Market",
      location: "Tehran, Iran",
      position: "Front-end Engineer",
      period: "September 2023 - Now",
      achievements: [
        "Launched a desktop version of the web app, resulting in a 11% increase in user engagement.",
        "Engineered a custom metrics tracking library integrating Google Analytics, leading to a 13% improvement in performance monitoring accuracy.",
        "Improved core web vitals by 10%, significantly reducing load times and enhancing user experience and accessibility.",
        "Spearheaded the development of promotional features, including discounts, coupons, and vouchers, enhancing the back-oﬃce panel by employing React, RTK, Redux Saga, and Sass to build robust solutions."
      ]
    },
    {
      company: "DFreight",
      location: "Dubai, UAE",
      position: "Front-end Engineer",
      period: "August 2022 - June 2023",
      achievements: [
        "Elevated user experience and drove platform innovation by introducing advanced features to the customer and back-oﬃce Panels using React, SWR, Next.js, TypeScript, and Tailwind.",
        "Boosted operational eﬃciency and customer satisfaction, decreasing the time to register a freight request by 9% through panels, and positively impacting the productivity of both freight forwarders and the DFreight Operations team."
      ]
    },
    {
      company: "Digistyle",
      location: "Tehran, Iran",
      position: "Front-end Engineer",
      period: "February 2021 - August 2022",
      achievements: [
        "Implemented redesigned version of the website and mobile app, collaborating with product managers, UI/UX designers, and backend developers.",
        "Enhanced the checkout process with responsive design improvements, leading to an 9% increase in user conversion rates by optimizing the mobile user experience, improving customer journeys, and increasing mobile engagement.",
        "Built a new version of the platform using cutting-edge frontend technologies, significantly enhancing user satisfaction compared to the legacy version."
      ]
    },
    {
      company: "Digikala (Engineering Department)",
      location: "Tehran, Iran",
      position: "Front-end Developer",
      period: "August 2019 - February 2021",
      achievements: [
        "Led the creation of impactful features for the e-commerce and shipping platform, enhancing functionality for over 20 million users and improving engagement rate by 5%.",
        "Directed key projects such as Digiplus (premium membership program) and Digiclub (customer loyalty program), increasing membership sign-ups by 8% and customer retention by 13% through frontend enhancements.",
        "Contributed to the development of a new platform version using React, TypeScript, Storybook, and Tailwind, ensuring a modern user experience."
      ]
    },
    {
      company: "Digikala (Marketing Department)",
      location: "Tehran, Iran",
      position: "Front-end Developer",
      period: "November 2017 - August 2019",
      achievements: [
        "Crafted more than 35 engaging landing pages for marketing promotions and campaigns, significantly increased engagement.",
        "Established a tracking system to measure clicks, views, CTR, and other key metrics, enhanced performance analysis by 18%.",
        "Developed a panel for the partnership marketing team to create interactive landing pages eﬃciently and implemented captivating animations and interactions using JavaScript libraries, boosting engagement rates by 13%."
      ]
    },
    {
      company: "Himart",
      location: "Tehran, Iran",
      position: "Front-end Developer",
      period: "June 2017 - November 2017",
      achievements: [
        "Led the development of the flagship website and web app by utilizing jQuery, Materialize, DevExtreme Components, and the Razor template engine, built adaptive and responsive user interfaces.",
        "Improved customer engagement by creating user-friendly digital experiences resulted in adding 1200 supermarkets to the website, and optimized the web application for better performance.",
        "Collaborated with the development team to implement best practices and innovative solutions."
      ]
    }
  ],

  publications: [
    {
      title: "Design and implementation of a quantum multiplexer",
      url: "https://www.academia.edu/7978723/Design_and_Implementation_of_a_Quantum_Multiplexer",
      description: "Proposes a novel architecture that utilizes quantum entanglement and superposition to efficiently route multiple qubit signals, reducing circuit overhead and paving the way for more scalable quantum computations."
    },
    {
      title: "Managing Software Complexity: A Guide to Simplicity in an Intricate World",
      url: "https://medium.com/@navid.shiry/managing-software-complexity-a-guide-to-simplicity-in-an-intricate-world-081d50c270ca",
      description: "Discusses practical strategies for reducing technical debt in large-scale software systems by embracing modular design, clear communication, and continuous refactoring—ultimately promoting maintainability and scalability."
    }
  ],

  skills: [
    "Data Structures & Algorithms",
    "SQL & NoSQL Databases",
    "Data Visualization (D3.js, Chart.js, Tableau)",
    "Linux, Bash Scripting",
    "Design Patterns & Best Practices",
    "Adobe Photoshop, Illustrator, Figma",
    "Typography & Layout Design",
    "Writing clear documentation (Notion, Confluence)",
    "Leadership & Team Collaboration",
    "JavaScript & TypeScript",
    "React & Next.js",
    "CSS & Sass",
    "UI/UX Collaboration",
    "Git and Version Control Systems",
    "Agile Methodologies",
    "Performance-Focused Responsive Design",
    "State Management (Redux/Context API)",
    "APIs and RESTful Services"
  ],

  languages: [
    "English (Fluent)",
    "Persian (Native)",
    "Arabic (Basic)"
  ],

  signature: {
    name: "", // Will default to personal.name
    date: "" // Will default to current month and year
  },

  volunteering: [
    {
      organization: "Shahrood University of Technology",
      location: "Shahrood, Iran",
      role: "Active Member of the Computer and IT Scientific Association",
      period: "2009 - 2011",
      description: "Participating in organizing tech-related events, workshops, and academic discussions."
    },
    {
      organization: "Shahrood University of Technology",
      location: "Shahrood, Iran",
      role: "Member of the Student Council",
      period: "2010 - 2011",
      description: "Advocating for student rights, academic improvements, and campus welfare initiatives."
    },
    {
      organization: "Shahrood University of Technology",
      location: "Shahrood, Iran",
      role: "Designer for Student Scientific Associations",
      period: "2010 - 2013",
      description: "Created posters, banners, magazines, and publications for various student-led academic and scientific associations, enhancing event visibility and engagement."
    },
    {
      organization: "Shahrood University of Technology",
      location: "Shahrood, Iran",
      role: "Member of the Handicrafts and Visual Arts Club",
      period: "2011 - 2012",
      description: "Engaging in creative arts, cultural events, and fostering interdisciplinary collaboration."
    }
  ]
} 