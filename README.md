# Resume Maker

A modular, component-based resume builder built with Nuxt.js and Vue 3. This project allows you to create multiple versions of your resume by simply modifying data files, with full inline editing capabilities and section visibility controls.

## Features

- **Modular Components**: Each section of the resume is a separate, reusable component
- **Multiple Versions**: Support for different resume versions (Web Development, Data Science, Research & Academia, AI & Business). The version selector can be enabled by setting `enableVersions: true` in `data/resume.js` (disabled by default).
- **Data-Driven**: All content is stored in a single data file for easy modification
- **Inline Editing**: Click any text to edit it directly on the page with rich text formatting toolbar
- **Section Controls**: Toggle sections on/off with checkboxes
- **Professional Headshot**: Support for profile pictures
- **Print-Friendly**: Optimized for printing with proper page breaks
- **Responsive Design**: Works well on different screen sizes
- **Import/Export Resume Data**: Easily export your resume as a JSON file or import data from a JSON file using the sidebar controls
- **🤖 AI-Powered Resume Import**: Paste your resume text and let AI automatically convert it to the proper JSON format
- **🎯 AI Job Optimizer**: Tailor your resume to specific job postings by optimizing Summary, Experience achievements, and Skills while preserving all other content

## Project Structure

```
├── app.vue                 # Main application file
├── data/
│   └── resume.js          # All resume data
├── components/
│   ├── ResumeHeader.vue   # Personal information header with headshot
│   ├── ResumeSidebar.vue  # Sidebar controls for sections and data management
│   ├── ResearchInterests.vue # Research interests with version support
│   ├── Education.vue      # Education history
│   ├── Summary.vue        # Professional summary
│   ├── Experience.vue     # Work experience
│   ├── Publications.vue   # Publications and articles
│   ├── Skills.vue         # Skills list
│   ├── Languages.vue      # Language skills
│   ├── Volunteering.vue   # Volunteer experience
│   ├── Signature.vue      # Signature section
│   └── VersionSelector.vue # Version switcher and PDF download
├── server/
│   └── api/
│       ├── import-resume.post.js  # AI-powered resume text to JSON conversion
│       └── tailor-resume.post.js  # AI-powered resume optimization for job posts
├── public/
│   └── favicon.ico        # Site favicon
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
  headshot: "https://example.com/your-headshot.jpg" // URL to your headshot image
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

### Sidebar Controls
- **Collapsible Sidebar**: Toggle the sidebar on the left to access all controls
- **Header Elements**: Checkboxes to show/hide header elements (address, phone, email, LinkedIn, headshot)
- **Resume Sections**: Checkboxes to show/hide sections and arrows to reorder them
- **Data Management**: Import/export resume data as JSON
- **Version Selector**: Switch between different resume versions in the top-right

### Inline Editing with Rich Text Formatting

#### 🎨 Floating Toolbar
When editing is enabled, a Notion-like floating toolbar provides rich text formatting options:

1. **Enable Editing**: Set `editable: true` in `data/resume.js`
2. **Click any editable text** to activate the editing mode
3. **Floating toolbar appears** above the clicked element with formatting options
4. **Apply formatting** using toolbar buttons or keyboard shortcuts
5. **Click outside** to save changes and hide the toolbar

#### ✨ Available Formatting Options

**Text Formatting:**
- **Bold** (Ctrl+B / Cmd+B) - Make text bold
- **Italic** (Ctrl+I / Cmd+I) - Make text italic

**Lists:**
- **Bullet List** - Convert text to bulleted lists
- **Numbered List** - Convert text to numbered lists

**Links:**
- **Insert Link** - Create hyperlinks to external resources
  - Select text and click link button to make it clickable
  - Click without selection to insert URL as both text and link
  - Links open in new tabs for better user experience

**Utilities:**
- **Remove Format** - Clear all formatting from selected text

#### 🎯 How It Works

1. **Smart Detection**: Toolbar only appears for elements with the `.editable` class
2. **Click-Based Activation**: Toolbar shows when you click on editable text (not just selection)
3. **Auto-Positioning**: Toolbar positions itself above the clicked element, staying within viewport
4. **Non-Intrusive**: Toolbar disappears when clicking outside or on non-editable areas
5. **Print-Safe**: Toolbar is automatically hidden when printing

#### 💡 Usage Tips

- **Hover Effects**: Blue highlight on hover shows which elements are editable
- **Focus Indicators**: Blue outline appears when editing an element
- **Persistent Formatting**: All formatting is preserved when you save changes
- **Cross-Component**: Works across all resume sections (Summary, Experience, Education, etc.)

#### 🔧 Technical Details

- Built with Vue 3 composables for optimal performance
- Uses native `document.execCommand` for reliable formatting
- Integrates seamlessly with existing blur handlers for data persistence
- SSR-compatible with proper client-side hydration

### Download PDF
1. **Click the "Download PDF" button** in the top-right
2. The controls will temporarily disappear
3. Use your browser's print dialog to save as PDF
4. Controls will reappear after printing

## Switching Between Versions

> **Note:** Make sure `enableVersions` is set to `true` in `data/resume.js` to display the version selector dropdown. When this flag is `false`, the app defaults to the "web-version" and only the **Download PDF** button is visible.

The resume supports multiple versions that can be switched using the version selector in the top-right corner:

- **Web Development**: Focused on web technologies and front-end development
- **Data Science**: Emphasizes data analysis, machine learning, and big data
- **Research & Academia**: Highlights research interests and academic achievements
- **AI & Business**: Focuses on AI, business intelligence, and digital transformation

## Adding Your Headshot

1. **Enable Headshot**: In the sidebar, expand "Header Elements" and check the "Headshot" checkbox
2. **Paste URL**: In the **Headshot URL** input field, paste the link to your profile image (local uploads are not supported)
3. **Supported URLs**: Any publicly accessible image URL (JPG, PNG, WebP, etc.)
4. **Recommended**: Use a square image (120x120 pixels or larger) for best results
5. **Examples**: LinkedIn profile photo, GitHub avatar, or any hosted image URL

## Importing and Exporting Resume Data

### Exporting
- Open the sidebar (left panel) and expand the **Data Management** section.
- Click **Export as JSON** to download your current resume data as a JSON file.
- The exported file includes all sections, personal info, header elements, section order, and visibility settings.

### Importing
- Open the sidebar and expand the **Data Management** section.
- Click **Import from JSON** to open the import modal.
- Paste your JSON data into the text area provided.
- Click **Import Data**. Your resume will update with the imported data, merging with the current structure.

## Sidebar Controls

- **Header Elements**: Toggle the visibility of header elements (e.g., address, phone, email, LinkedIn, headshot) using checkboxes. Name and Title are always visible.
- **Resume Sections**: Show/hide entire sections (Summary, Research Interests, Education, etc.) and reorder them using the up/down arrows.
- **Data Management**: Import/export your resume data as JSON for easy backup, sharing, or migration.

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

## AI-Powered Features

### 🤖 AI Resume Import

**Convert any resume format to structured JSON automatically!**

1. **Open the sidebar** and expand the **Import & Export** section
2. **Click "Import Resume Text"** to open the AI import modal
3. **Paste your resume text** (from Word, PDF, or any format) into the textarea
4. **Click "Convert with AI"** to automatically parse and structure your resume
5. **Review the results** and click "Apply Changes" to update your resume

**Supported Formats:**
- Microsoft Word documents (copy-pasted text)
- PDF files (copy-pasted text)
- Plain text resumes
- Any unstructured resume format

**What the AI extracts:**
- Personal information (name, contact details, address)
- Education history with institutions, degrees, and periods
- Work experience with companies, positions, and achievements
- Skills and technical competencies
- Publications and research interests
- Languages and certifications
- All other resume sections

### 🎯 AI Job Optimizer

**Tailor your resume to specific job postings with AI!**

1. **Open the sidebar** and expand the **Job Optimizer** section
2. **Click "Tailor for Job Post"** to open the optimization modal
3. **Paste your resume text** in the first textarea
4. **Paste the job posting** in the second textarea
5. **Click "Optimize Resume"** to let AI tailor your resume
6. **Review the before/after comparison** and click "Apply Optimizations"

**What the AI optimizes:**
- **Summary**: Rewrites your professional summary to match job requirements
- **Experience Achievements**: Enhances achievement descriptions with relevant keywords
- **Skills**: Adapts skills list to include job-specific competencies

**What the AI preserves:**
- All personal information and contact details
- Company names, positions, and employment dates
- Education history and credentials
- Publications and research interests
- All other resume sections and structure

**Smart Data Handling:**
- When you paste a new resume, all information (personal details, education, etc.) is updated from the new text
- AI optimizations are applied on top of the updated base resume
- No data loss - everything is preserved and enhanced

### 🔧 AI Configuration

**Setup Required:**
1. **Get a Google AI API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Create a `.env` file** in the project root:
   ```
   GOOGLE_AI_API_KEY=your_api_key_here
   ```
3. **Restart the development server** after adding the API key

**Security:**
- API keys are stored securely in `.env` files (not committed to git)
- All AI processing happens server-side to protect your API key
- No sensitive data is exposed to the client
