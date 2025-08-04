# Resumix

A modular, component-based resume builder built with Nuxt.js and Vue 3. Resumix allows you to create multiple versions of your resume by simply modifying data files, with full inline editing capabilities and section visibility controls.

## Features

- **Modular Components**: Each section of the resume is a separate, reusable component
- **Multiple Versions**: Support for different resume versions (Web Development, Data Science, Research & Academia, AI & Business). The version selector can be enabled by setting `enableVersions: true` in `data/resume.js` (disabled by default).
- **Data-Driven**: All content is stored in a single data file for easy modification
- **Inline Editing**: Click any text to edit it directly on the page with rich text formatting toolbar
- **Section Controls**: Toggle sections on/off with checkboxes
- **Professional Headshot**: Support for profile pictures
- **Print-Friendly**: Optimized for printing with proper page breaks
- **Responsive Design**: Works well on different screen sizes
- **Import/Export Resume Data**: Easily export your resume as a JSON file using Resumix's sidebar controls
- **📄 Smart Resume Import**: Paste resume text or JSON data and let the system automatically convert it to the proper format with intelligent section visibility management
- **📁 File Upload Support**: Drag and drop or browse to upload resume files (.txt, .rtf, .doc, .docx, .pdf) with automatic text extraction and AI processing
- **🎯 AI Job Optimizer**: Tailor your resume to specific job postings by completely rewriting Summary and Experience achievements to match job requirements, with intelligent keyword bolding and structure preservation
- **🔔 Toast Notification System**: Modern, non-intrusive notifications with auto-close for short messages and manual close for longer ones
- **🎨 Enhanced User Experience**: Improved error handling, better AI response parsing, and smart section management
- **🔄 Drag & Drop Section Reordering**: Intuitive drag handles to reorder resume sections with visual feedback and smooth animations
- **📝 AI Cover Letter Generator**: Create professional, tailored cover letters using AI that connect your experience to specific job requirements

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
│   ├── Summary.vue        # Professional summary with HTML rendering
│   ├── Experience.vue     # Work experience with HTML rendering
│   ├── Publications.vue   # Publications and articles
│   ├── Skills.vue         # Skills list with 3-column grid layout
│   ├── Languages.vue      # Language skills
│   ├── Volunteering.vue   # Volunteer experience
│   ├── Signature.vue      # Signature section
│   ├── VersionSelector.vue # Version switcher and PDF download
│   ├── ToastContainer.vue # Toast notification system
│   └── FloatingToolbar.vue # Rich text editing toolbar
├── composables/
│   ├── useTextCommands.js # Rich text editing commands for floating toolbar
│   ├── useTextSelection.js # Text selection utilities for editing
│   └── useToast.js        # Toast notification composable
      ├── server/
│   └── api/
│       ├── import-resume.post.js  # Enhanced AI-powered resume text to JSON conversion
│       ├── tailor-resume.post.js  # Enhanced AI-powered resume optimization for job posts
│       └── generate-cover-letter.post.js  # AI-powered cover letter generation
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
- **Resume Sections**: Checkboxes to show/hide sections and drag handles to reorder them
- **Data Management**: Import/export resume data as JSON
- **Job Optimizer**: Tailor your resume for specific job postings using AI
- **Cover Letter Generator**: Create professional cover letters tailored to job descriptions
- **Version Selector**: Switch between different resume versions in the top-right

#### 🔄 Drag & Drop Section Reordering

**Intuitive section reordering with visual feedback!**

**How to Use:**
1. **Open the sidebar** and expand the **Resume Sections** section
2. **Look for drag handles** (⋮⋮) on the left side of each section name
3. **Click and hold** the drag handle to start dragging
4. **Drag the section** to your desired position
5. **Drop the section** to reorder it in your resume
6. **Note**: Summary and Signature sections cannot be moved (they stay at top and bottom respectively)

**Features:**
- **Visual Feedback**: Sections highlight with blue border when dragging over them
- **Smooth Animations**: Smooth transitions and scaling effects during drag operations
- **Smart Constraints**: Summary section cannot be moved (always stays at top), Signature section cannot be moved (always stays at bottom)
- **Non-Intrusive**: Drag handles only appear on hover for clean interface
- **Responsive Design**: Works seamlessly on desktop and tablet devices

**Benefits:**
- **Faster Reordering**: No need to click multiple arrow buttons
- **Intuitive Interface**: Natural drag and drop interaction
- **Visual Clarity**: Clear indication of where sections will be placed
- **Professional Appearance**: Clean, modern interface design

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

> **Note:** Make sure `enableVersions` is set to `true` in `data/resume.js` to display the version selector dropdown. When this flag is `false`, Resumix defaults to the "web-version" and only the **Download PDF** button is visible.

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
- Click **Import Data**. Your resume will update with the imported data, merging with Resumix's current structure.

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
5. Pass the data as props to the component in Resumix

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

### 📄 Smart Resume Import

**Intelligently import resume text, JSON data, or upload files automatically!**

1. **Open the sidebar** and expand the **Data Management** section
2. **Click "Import Resume"** to open the smart import modal
3. **Choose your import method:**
   - **File Upload**: Drag and drop or browse to upload resume files
   - **Text Input**: Paste your content (resume text OR JSON data) into the textarea
4. **Click "Import Resume"** to automatically process your data
5. **Review the results** - your resume will be updated instantly

**Smart Detection:**
- **JSON Input**: Automatically detects and imports valid JSON resume data instantly
- **Text Input**: Uses AI to convert unstructured text to proper JSON format
- **File Upload**: Extracts text from uploaded files and processes with AI
- **Seamless Experience**: One interface handles all formats intelligently

**Supported File Formats:**
- **Text Files (.txt)**: Plain text resumes with automatic processing
- **Rich Text (.rtf)**: Rich text format files with text extraction
- **Word Documents (.doc, .docx)**: Microsoft Word files (text extraction recommended)
- **PDF Files (.pdf)**: PDF documents (text extraction recommended)
- **JSON Data**: Valid JSON resume data (exported from Resumix or AI-generated)
- **Any Text Format**: Copy-pasted text from any source

**File Upload Features:**
- **Drag & Drop**: Simply drag files onto the upload area
- **Click to Browse**: Traditional file picker for easy selection
- **Visual Feedback**: Different states for hover, drag-over, and file selected
- **File Validation**: Automatic format checking and error handling
- **Progress Indicators**: Loading states during file processing
- **Easy Removal**: Remove uploaded files with a single click

**What gets imported:**
- Personal information (name, contact details, address)
- Education history with institutions, degrees, and periods
- Work experience with companies, positions, and achievements
- Skills and technical competencies
- Publications and research interests
- Volunteering experience
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
- **Summary**: Completely rewrites your professional summary to match job requirements with **bold technical keywords**
- **Experience Achievements**: Completely rewrites achievement descriptions to demonstrate job-relevant skills and technologies with **selective technical keyword bolding**
- **Skills**: Adapts and reorders skills list to prioritize job-specific competencies (displayed as clean text)

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

### 📝 AI Cover Letter Generator

**Create professional, tailored cover letters with AI!**

1. **Open the sidebar** and expand the **Cover Letter Generator** section
2. **Click "Generate Cover Letter"** to open the cover letter modal
3. **Paste your resume text** in the first textarea (or use current resume data)
4. **Paste the job description** in the second textarea
5. **Click "Generate Cover Letter"** to let AI create a tailored cover letter
6. **Review the generated cover letter** and click "Download as PDF"

**What the AI creates:**
- **Professional Structure**: 3-4 paragraph business letter format
- **Tailored Content**: Connects your experience to specific job requirements
- **Proper Formatting**: Includes date, salutation, and professional closing
- **Compelling Narrative**: Highlights relevant achievements and skills
- **Enthusiasm**: Shows genuine interest in the role and company

**Cover Letter Best Practices:**
- **Opening Paragraph**: Expresses interest in the specific position and company
- **Body Paragraph(s)**: Connects relevant experience to job requirements with specific examples
- **Closing Paragraph**: Reiterates interest and includes clear call-to-action
- **Professional Tone**: Confident but not arrogant, specific and detailed
- **Proper Formatting**: Business letter format with proper spacing and typography

**Features:**
- **Smart Resume Integration**: Use current resume data or paste new text in Resumix
- **Job-Specific Tailoring**: AI analyzes job requirements and matches your experience
- **Professional Formatting**: Business letter format ready for submission
- **PDF Download**: Download cover letter as a properly formatted PDF
- **Editable Results**: Review and edit the generated cover letter before downloading

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

## Recent Enhancements (2024)

### 🔔 Toast Notification System

**Modern, non-intrusive notifications that enhance the user experience!**

**Features:**
- **Smart Auto-Close**: Short messages (≤60 characters) auto-close in 4 seconds
- **Manual Close**: Long messages stay visible with a close button for user control
- **Multiple Types**: Success (green), Error (red), Warning (orange), Info (blue) with appropriate icons
- **Non-Blocking**: Notifications appear in bottom-right corner without interrupting workflow
- **Smooth Animations**: Slide-in from right with opacity transitions
- **Responsive Design**: Adapts to mobile screens with full-width display
- **Accessibility**: Proper ARIA labels and keyboard navigation support

**Design:**
- **Minimal Black Theme**: Dark gray background (#1f2937) with light text
- **Color-Coded Icons**: Material Design icons for each notification type
- **Professional Appearance**: Subtle shadows and clean typography
- **Print-Safe**: Hidden during printing for clean output

**Replaced Alert System:**
- All browser `alert()` dialogs have been replaced with elegant toast notifications
- Better user experience with non-blocking notifications
- Consistent design throughout the application

### 🎯 Enhanced AI Job Optimizer

**Significantly improved content optimization capabilities!**

**New Content Focus:**
- **Complete Rewriting**: AI now completely rewrites summary and experience achievements instead of just adding keywords
- **Job Alignment**: Content is transformed to specifically match job posting requirements
- **Technical Keyword Bolding**: Strategic use of `<strong>` tags for technical terms only (3-5 per paragraph max)
- **Factual Accuracy**: Preserves all factual information while enhancing how it's presented

**Rewriting Strategy:**
1. **Analyze job posting** for key requirements, technologies, and responsibilities
2. **Rewrite summary** to position candidate as ideal fit for specific requirements
3. **Transform achievements** to highlight relevant skills and quantifiable impact
4. **Prioritize skills** based on job posting requirements
5. **Apply selective bolding** to technical keywords using HTML `<strong>` tags

**Example Transformation:**
- **Before**: "Developed web applications for internal teams"
- **After**: "Architected and delivered enterprise-scale web applications using **React** and **TypeScript**, serving 10,000+ users and reducing operational overhead by 40%"

### 📄 Enhanced Smart Resume Import

**Improved AI parsing with robust error handling and data preservation!**

**Enhanced Parsing:**
- **Robust JSON Extraction**: Multiple fallback methods for extracting valid JSON from AI responses
- **Markdown Cleanup**: Automatic removal of code blocks and formatting artifacts
- **Text Preprocessing**: Normalization of whitespace, line endings, and formatting
- **Length Validation**: 10,000 character limit to prevent token overflow
- **Better Error Messages**: Detailed logging and user-friendly error descriptions

**Smart Section Management:**
- **Auto-Hide Empty Sections**: Sections with no content are automatically unchecked
- **Core Sections Always Visible**: Summary, Education, Experience, Skills always remain enabled
- **Manual Override**: Users can still enable any hidden section to add content later
- **Intelligent Detection**: Comprehensive checks for empty arrays, objects, and strings

**Data Preservation Logic:**
- **Structure Preservation**: Maintains original resume structure and formatting
- **Versioned Data**: Preserves complex data structures like versioned research interests
- **Detailed Information**: Keeps education coursework, GPA, final projects, publication details
- **Format Consistency**: Maintains original data formats (strings vs objects, date formats)

### 🛠️ Technical Improvements

**Enhanced system reliability and user experience!**

**HTML Rendering Support:**
- **Summary & Experience**: Now support HTML `<strong>` tags for keyword bolding
- **Conditional Rendering**: Separate view and edit modes to prevent browser HTML escaping
- **Content Preservation**: HTML tags maintained during inline editing
- **CSS Grid Layout**: Skills section uses CSS Grid for reliable 3-column display

**Error Handling:**
- **Comprehensive Logging**: Detailed error information for troubleshooting
- **Graceful Degradation**: System continues to work even when some features fail
- **User-Friendly Messages**: Clear, actionable error messages with suggested solutions
- **Fallback Mechanisms**: Multiple strategies for handling AI response parsing

**Data Integrity:**
- **Smart Merging**: Intelligent data merging that preserves existing information
- **Fallback Logic**: Uses current data when imported data is incomplete
- **Validation Checks**: Ensures data structure integrity throughout the import process
- **Section Visibility**: Automatic management of section visibility based on content

**Performance Optimizations:**
- **Parallel Processing**: Toast notifications and data operations run efficiently
- **Memory Management**: Proper cleanup of temporary data and event listeners
- **Client-Side Validation**: Reduced server calls through smart client-side checks
- **Responsive Loading**: Better loading states and progress indicators

### 🎨 User Interface Enhancements

**Improved visual design and interaction patterns!**

**Toast Notifications:**
- **Material Design Icons**: Consistent iconography across all notification types
- **Hover States**: Interactive close buttons with smooth transitions
- **Focus Management**: Proper keyboard navigation and accessibility
- **Mobile Optimization**: Full-width notifications on smaller screens

**Resume Content:**
- **Technical Keyword Highlighting**: Bold formatting for technical terms in optimized content
- **Clean Typography**: Improved readability with proper font weights
- **Grid Layouts**: Better organization of skills and other list-based content
- **Print Optimization**: Enhanced print styles for professional output

**Data Management:**
- **Smart Defaults**: Checkbox for using current resume data in optimizer
- **Progress Indicators**: Clear feedback during AI processing operations
- **Status Messages**: Informative loading and success states
- **Error Recovery**: Clear paths for users to recover from errors

**Accessibility:**
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **High Contrast**: Sufficient color contrast for readability
- **Focus Indicators**: Clear visual feedback for focused elements
