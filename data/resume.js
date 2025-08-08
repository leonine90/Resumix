// MOCK DATA - This file contains fictional data for demonstration purposes
// See "resume example.js" for the real data structure
export const resumeData = {
  // Flag to enable/disable editing mode
  editable: true,
  

  
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
    name: "Robert Plant",
    title: "Software Engineer",
    address: "San Francisco, CA",
    dateOfBirth: "1990/01/15",
    phone: "+1-555-123-4567",
    email: "robert.plant@example.com",
    linkedin: "https://linkedin.com/in/robert-plant",
    linkedinText: "/robert-plant",
    headshot: "" // Headshot URL - paste image URL in sidebar
  },

  researchInterests: [
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

  education: [
    {
      institution: "Stanford University",
      location: "Stanford, CA",
      degree: "B.Sc. Computer Science",
      period: "2012 - 2016",
      coursework: [
        "Algorithms & Data Structures",
        "Artificial Intelligence",
        "Database Systems & SQL",
        "Web Programming & Software Architecture",
        "Operating Systems Fundamentals",
        "Computer Networks"
      ],
      finalProject: {
        title: "Machine Learning for Web Applications",
        objective: "Explored the integration of machine learning algorithms into web-based platforms for enhanced user experience.",
        keyTopics: "Covered neural networks, recommendation systems, and real-time data processing, focusing on scalable web architectures.",
        outcome: "Developed a recommendation engine that improved user engagement by 25% in e-commerce applications."
      }
    },
    {
      institution: "Tech Valley High School",
      location: "Palo Alto, CA",
      degree: "High School Diploma in Science & Technology",
      period: "2008 – 2012",
      gpa: "3.9/4.0",
      description: "Emphasis on advanced mathematics, computer science, and physics—providing a strong foundation for software engineering disciplines."
    }
  ],

  summary: "Innovative Software Engineer with expertise in React, TypeScript, Node.js, and full-stack development, specializing in building scalable, high-performance web applications. Proven track record of delivering robust solutions for fintech, e-commerce, and SaaS platforms. Passionate about clean code, user experience, and leveraging cutting-edge technologies to solve complex business challenges.",

  experience: [
    {
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      position: "Senior Software Engineer",
      period: "March 2023 - Now",
      achievements: [
        "Launched a microservices architecture, resulting in a 15% improvement in system scalability and performance.",
        "Developed a real-time analytics dashboard using React and Node.js, leading to 20% better decision-making speed for stakeholders.",
        "Improved application load times by 25% through code optimization and implementing advanced caching strategies.",
        "Led the development of a payment processing system handling $2M+ in daily transactions using React, TypeScript, and PostgreSQL."
      ]
    },
    {
      company: "CloudTech Inc",
      location: "Seattle, WA",
      position: "Full-Stack Developer",
      period: "June 2021 - February 2023",
      achievements: [
        "Built scalable web applications serving 100K+ users using React, Node.js, TypeScript, and AWS services.",
        "Reduced deployment time by 40% by implementing CI/CD pipelines and containerization with Docker and Kubernetes."
      ]
    },
    {
      company: "StartupXYZ",
      location: "Austin, TX",
      position: "Frontend Developer",
      period: "January 2020 - May 2021",
      achievements: [
        "Developed responsive web applications from scratch, collaborating with designers and product managers.",
        "Implemented A/B testing framework that increased user conversion rates by 12% through data-driven UI optimizations.",
        "Built progressive web application using modern frontend technologies, significantly improving user engagement."
      ]
    },
    {
      company: "Digital Innovations LLC",
      location: "New York, NY",
      position: "Junior Developer",
      period: "August 2018 - December 2019",
      achievements: [
        "Contributed to the development of e-commerce platform features, enhancing functionality for 50K+ active users.",
        "Worked on customer loyalty program implementation, increasing user retention by 18% through frontend enhancements.",
        "Participated in code reviews and agile development processes, ensuring high-quality deliverables."
      ]
    },
    {
      company: "WebDev Agency",
      location: "Los Angeles, CA",
      position: "Frontend Intern",
      period: "June 2017 - July 2018",
      achievements: [
        "Created responsive landing pages for client marketing campaigns, improving engagement metrics.",
        "Implemented tracking and analytics systems for better performance measurement and optimization.",
        "Developed interactive web components using modern JavaScript frameworks and libraries."
      ]
    }
  ],

  publications: [
    {
      title: "Modern Web Development: Performance Optimization Techniques",
      url: "https://medium.com/@johndoe/modern-web-development-performance-optimization",
      description: "Explores advanced techniques for optimizing web application performance, including code splitting, lazy loading, and efficient state management patterns that improve user experience."
    },
    {
      title: "Building Scalable React Applications: Best Practices and Patterns",
      url: "https://dev.to/johndoe/building-scalable-react-applications",
      description: "Comprehensive guide covering architectural patterns, component design strategies, and testing methodologies for large-scale React applications in enterprise environments."
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
      organization: "Code for Good",
      location: "San Francisco, CA",
      role: "Software Development Volunteer",
      period: "2020 - Present",
      description: "Developing web applications for non-profit organizations, helping them digitize their operations and reach more beneficiaries."
    },
    {
      organization: "Stanford University Alumni Association",
      location: "Stanford, CA",
      role: "Technical Mentor",
      period: "2018 - Present",
      description: "Mentoring computer science students in career development, technical skills, and industry best practices."
    },
    {
      organization: "Local Community Center",
      location: "Palo Alto, CA",
      role: "Coding Workshop Instructor",
      period: "2017 - 2019",
      description: "Teaching basic programming and web development skills to underserved youth in the community."
    },
    {
      organization: "Open Source Initiative",
      location: "Remote",
      role: "Contributing Developer",
      period: "2016 - Present",
      description: "Contributing to various open-source projects, focusing on React components and developer tools."
    }
  ]
} 