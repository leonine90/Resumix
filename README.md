# Resume Maker

A modular, component-based resume builder built with Nuxt.js and Vue 3. This project allows you to create multiple versions of your resume by simply modifying data files, with full inline editing capabilities and section visibility controls.

## Features

- **Modular Components**: Each section of the resume is a separate, reusable component
- **Multiple Versions**: Support for different resume versions (Web Development, Data Science, Research & Academia, AI & Business)
- **Data-Driven**: All content is stored in a single data file for easy modification
- **Inline Editing**: Click any text to edit it directly on the page
- **Section Controls**: Toggle sections on/off with checkboxes
- **Professional Headshot**: Support for profile pictures
- **Print-Friendly**: Optimized for printing with proper page breaks
- **Responsive Design**: Works well on different screen sizes

## Project Structure

```
├── app.vue                 # Main application file
├── data/
│   └── resume.js          # All resume data
├── components/
│   ├── ResumeHeader.vue   # Personal information header with headshot
│   ├── ResearchInterests.vue # Research interests with version support
│   ├── Education.vue      # Education history
│   ├── Summary.vue        # Professional summary
│   ├── Experience.vue     # Work experience
│   ├── Publications.vue   # Publications and articles
│   ├── Skills.vue         # Skills list
│   ├── Languages.vue      # Language skills
│   ├── Volunteering.vue   # Volunteer experience
│   ├── Signature.vue      # Signature section
│   ├── VersionSelector.vue # Version switcher and PDF download
│   └── SectionControls.vue # Section visibility controls
├── public/
│   └── headshot.jpg       # Professional headshot image
```

## How to Modify Your Resume

### 1. Personal Information
Edit the `personal` object in `data/resume.js`:

```javascript
personal: {
  name: "Your Name",
  title: "Your Title",
  address: "Your Address",
  dateOfBirth: "YYYY/MM/DD",
  phone: "Your Phone",
  email: "your.email@example.com",
  linkedin: "https://linkedin.com/in/your-profile",
  linkedinText: "/your-profile",
  headshot: "/headshot.jpg" // Path to your headshot image
}
```

### 2. Section Visibility
Control which sections appear on your resume:

```javascript
sections: {
  summary: false,
  researchInterests: true,
  education: true,
  experience: true,
  publications: true,
  skills: true,
  volunteering: true,
  languages: true,
  signature: true
}
```

### 3. Research Interests
The research interests section supports multiple versions. Each version is an array of objects with `title` and `description`:

```javascript
researchInterests: {
  "web-version": [
    {
      title: "Your Research Interest",
      description: "Description of your research interest..."
    }
  ],
  "data-version": [
    // Data science focused interests
  ],
  "v-3": [
    // Research & academia focused interests
  ],
  "ai-version": [
    // AI & business focused interests
  ]
}
```

### 4. Education
Add or modify education entries in the `education` array:

```javascript
education: [
  {
    institution: "University Name",
    location: "City, Country",
    degree: "Degree Name",
    period: "Year - Year",
    coursework: ["Course 1", "Course 2"], // Optional
    finalProject: {                        // Optional
      title: "Project Title",
      objective: "Project objective...",
      keyTopics: "Key topics covered...",
      outcome: "Project outcome..."
    },
    gpa: "GPA/Scale",                      // Optional
    description: "Description..."          // Optional
  }
]
```

### 5. Experience
Modify work experience in the `experience` array:

```javascript
experience: [
  {
    company: "Company Name",
    location: "City, Country",
    position: "Job Title",
    period: "Month Year - Month Year",
    achievements: [
      "Achievement 1",
      "Achievement 2"
    ]
  }
]
```

### 6. Publications
Update publications in the `publications` array:

```javascript
publications: [
  {
    title: "Publication Title",
    url: "https://link-to-publication.com",
    description: "Brief description of the publication..."
  }
]
```

### 7. Skills
Modify the skills list:

```javascript
skills: [
  "Skill 1",
  "Skill 2",
  "Skill 3"
]
```

### 8. Languages
Add language skills:

```javascript
languages: [
  "English (Fluent)",
  "Spanish (Intermediate)",
  "French (Basic)"
]
```

### 9. Volunteering
Update volunteer experience:

```javascript
volunteering: [
  {
    organization: "Organization Name",
    location: "City, Country",
    role: "Your Role",
    period: "Year - Year",
    description: "Description of your involvement..."
  }
]
```

### 10. Signature
Customize the signature section:

```javascript
signature: {
  name: "Your Name",
  date: "Current Date"
}
```

## Using the Interface

### Section Controls
- **Left Panel**: Checkboxes to show/hide sections
- **Right Panel**: Version selector and PDF download button

### Inline Editing
1. **Enable Editing**: Set `editable: true` in `data/resume.js`
2. **Click any text** to edit it directly
3. **Press Enter or click away** to save changes
4. **Visual feedback**: Hover effects show editable areas

### Download PDF
1. **Click the "Download PDF" button** in the top-right
2. The controls will temporarily disappear
3. Use your browser's print dialog to save as PDF
4. Controls will reappear after printing

## Switching Between Versions

The resume supports multiple versions that can be switched using the version selector in the top-right corner:

- **Web Development**: Focused on web technologies and front-end development
- **Data Science**: Emphasizes data analysis, machine learning, and big data
- **Research & Academia**: Highlights research interests and academic achievements
- **AI & Business**: Focuses on AI, business intelligence, and digital transformation

## Adding Your Headshot

1. Place your headshot image in the `public/` directory
2. Update the `headshot` path in `data/resume.js`
3. Recommended size: 120x120 pixels
4. Supported formats: JPG, PNG, WebP

## Development

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Customization

### Adding New Versions
1. Add new version data to the `researchInterests` object in `data/resume.js`
2. Update the `VersionSelector.vue` component to include the new version option
3. The component will automatically handle showing/hiding content based on the selected version

### Adding New Sections
1. Create a new component in the `components/` directory
2. Add the component to `app.vue`
3. Add corresponding data to `data/resume.js`
4. Add section visibility control to the `sections` object
5. Pass the data as props to the component

### Styling
- Global styles are in `app.vue`
- Component-specific styles are in each component file
- The layout is optimized for A4 printing

## Print Optimization

The resume is designed to print well on A4 paper with:
- Proper page breaks
- Consistent margins
- Optimized typography
- Hidden controls when printing
- Clean, professional appearance

## License

This project is open source and available under the [MIT License](LICENSE).
