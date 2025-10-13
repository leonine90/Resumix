# Resumix

A modular, component-based resume builder built with Nuxt.js and Vue 3. Resumix allows you to create professional resumes with full inline editing capabilities, AI-powered optimization, and **quantifiable scoring system** for job compatibility analysis.

## Features

- **Modular Components**: Each section of the resume is a separate, reusable component
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
- **✨ AI Achievement Refinement**: **NEW!** Refine individual achievements with AI using custom prompts or quick presets (Add Metrics, More Technical, Show Leadership, Shorten) with undo functionality
- **📊 Quantifiable Resume Analysis**: Get consistent, specific scores (0-100) for resume-job compatibility with transparent calculations and detailed breakdowns
- **📈 Inline Analysis Panel**: **NEW!** View compatibility analysis scores directly in the refinement page for easy reference while editing
- **🔔 Toast Notification System**: Modern, non-intrusive notifications with auto-close for short messages and manual close for longer ones
- **🎨 Enhanced User Experience**: Improved error handling, better AI response parsing, and smart section management
- **🔄 Drag & Drop Section Reordering**: Intuitive drag handles to reorder resume sections with visual feedback and smooth animations
- **📝 AI Cover Letter Generator**: Create professional, tailored cover letters using AI that connect your experience to specific job requirements

## Key Technologies

- **Nuxt.js & Vue 3**: Modern framework for reactive components and SSR
- **Google Gemini AI**: Advanced AI for resume analysis, optimization, and content generation
- **Material Design Icons**: Professional iconography via Iconify
- **PDF Generation**: Browser-based PDF export with print optimization

## Project Structure

```
├── app.vue                 # Main application file
├── data/
│   └── resume.js          # All resume data
├── components/
│   ├── ResumeHeader.vue   # Personal information header with headshot
│   ├── ResumeSidebar.vue  # Sidebar controls for sections and data management
│   ├── sidebar/
│   │   └── SidebarHeader.vue # Collapsible sidebar header with toggle functionality
│   ├── ResearchInterests.vue # Research interests
│   ├── Education.vue      # Education history
│   ├── Summary.vue        # Professional summary with HTML rendering
│   ├── Experience.vue     # Work experience with HTML rendering
│   ├── Publications.vue   # Publications and articles
│   ├── Skills.vue         # Skills list with 3-column grid layout
│   ├── Languages.vue      # Language skills
│   ├── Volunteering.vue   # Volunteer experience
│   ├── Signature.vue      # Signature section
│   ├── PDFDownloader.vue # PDF download
│   ├── ToastContainer.vue # Toast notification system
│   ├── ResumeMatchAnalysis.vue # Resume compatibility analysis display
│   └── FloatingToolbar.vue # Rich text editing toolbar
├── composables/
│   ├── useTextCommands.js # Rich text editing commands for floating toolbar
│   ├── useTextSelection.js # Text selection utilities for editing
│   ├── useBodyScrollLock.js # Modal scroll locking utility
│   └── useToast.js        # Toast notification composable
├── server/
│   └── api/
│       ├── import-resume.post.js  # AI-powered resume text to JSON conversion
│       ├── import-resume-file.post.js # File upload and text extraction
│       ├── tailor-resume.post.js  # AI-powered resume optimization for job posts
│       ├── refine-achievement.post.js # AI-powered individual achievement refinement
│       ├── analyze-resume-match.post.js # Quantifiable resume-job compatibility analysis
│       ├── generate-cover-letter.post.js # AI-powered cover letter generation
│       └── test-analysis.get.js # Consistency testing endpoint
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
The research interests section contains an array of objects with `title` and `description`:

```javascript
researchInterests: [
  {
    title: "Your Research Interest",
    description: "Description of your research interest..."
  }
]
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
- **Collapsible Sidebar**: Toggle the sidebar on the left to access all controls using the chevron button in the header
- **Sidebar Header**: Professional header with toggle button to maximize resume viewing space
- **Header Elements**: Checkboxes to show/hide header elements (address, phone, email, LinkedIn, headshot)
- **Resume Sections**: Checkboxes to show/hide sections and drag handles to reorder them
- **Data Management**: Import/export resume data as JSON
- **Job Optimizer**: Tailor your resume for specific job postings using AI
- **Cover Letter Generator**: Create professional cover letters tailored to job descriptions


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

### 📊 Resume-Job Compatibility Analysis

**Get quantifiable, consistent scores with transparent calculations!**

**How to Use:**
1. Open the sidebar → expand **Job Optimizer** section
2. Click **"Analyze Resume Match"**
3. Paste your resume text and job posting
4. Click **"Analyze Compatibility"**

**Scoring Methodology:**
- **Skills Match (35%)**: `(Exact matches × 3) + (Related × 1)` normalized to 0-100
- **Experience Relevance (40%)**: Industry (0-30) + Role Level (0-30) + Achievements (0-40)
- **Keyword Alignment (25%)**: `(Exact × 2) + (Contextual × 1)` normalized to 0-100
- **Overall**: Weighted average of all three metrics

**Compatibility Levels:**
- 90-100: Excellent | 80-89: Strong | 70-79: Good | 60-69: Moderate | 50-59: Weak | 0-49: Poor

**Features:**
- Transparent calculations with exact formulas
- Consistent results (same inputs = same scores)
- Detailed strengths, gaps, and recommendations
- Test endpoint: `/api/test-analysis`

### 📄 Smart Resume Import

**Import resumes in any format - text, JSON, or files!**

**How to Use:**
1. Sidebar → **Data Management** → **Import Resume**
2. Choose method: **File Upload** (drag/drop) or **Text Input** (paste)
3. Click **Import Resume**

**Supported Formats:**
- Text files (.txt, .rtf), Word (.doc, .docx), PDF
- JSON data (exported or AI-generated)
- Pasted text from any source

**Smart Features:**
- Auto-detects JSON vs text input
- AI converts unstructured text to proper format
- Extracts text from uploaded files
- Auto-hides empty sections
- Preserves all resume data and structure

### 🎯 AI Job Optimizer

**Completely rewrite resume content to match job requirements!**

**How to Use:**
1. Sidebar → **Job Optimizer** → **Tailor for Job Post**
2. Paste resume text and job posting
3. Optionally run **Analyze Compatibility** first for scores
4. Click **Optimize Resume**
5. Review before/after comparison and edit as needed

**What Gets Optimized:**
- **Summary**: Completely rewritten with bold technical keywords
- **Experience**: Achievements rewritten to highlight job-relevant skills
- **Skills**: Reordered and adapted to prioritize job requirements

**What Gets Preserved:**
- Personal information and contact details
- Company names, positions, dates, locations
- Education, publications, volunteering, languages
- All structural data and formatting

**Key Features:**
- Works with any resume length (no character limits)
- Editable results before applying
- Technical keyword bolding with `<strong>` tags
- Smart data merging preserves all information

### ✨ AI Achievement Refinement

**Refine individual achievements with AI precision after optimization!**

**How to Use:**
1. **Optimize your resume** using the AI Job Optimizer as usual
2. **In the results page**, find the AI button (✨) next to each achievement
3. **Click the AI button** to open the refinement toolbar
4. **Choose your refinement method:**
   - **Quick Presets**: Click preset buttons for common improvements
   - **Custom Prompt**: Type your own specific instruction
5. **Review the refined achievement** and refine again if needed
6. **Use the undo button** (⟲) if you want to revert changes
7. **Click the AI button again** to close the refinement toolbar

**Quick Preset Buttons:**
- **📊 Add Metrics**: Incorporates specific numbers, percentages, and quantifiable results
- **💻 More Technical**: Adds relevant technologies, frameworks, and technical terminology
- **👥 Show Leadership**: Emphasizes team management, decision-making, and leadership skills
- **✂️ Shorten**: Condenses content while keeping key points and impact

**Custom Prompts Examples:**
- "focus on Python and data analysis"
- "add cloud technologies like AWS"
- "emphasize scalability and performance"
- "make it sound more senior-level"
- "add agile methodologies"

**Key Features:**
- **Contextual AI**: Uses job posting and position info for better refinements
- **Undo Functionality**: Single-level undo to revert last AI refinement
- **Persistent Toolbar**: Stays open for multiple refinements until you close it
- **Iterative Refinement**: Refine the same achievement multiple times with different prompts
- **Inline Editing**: No modals - everything happens in the same view
- **Technical Keyword Bolding**: Automatically highlights technical terms in refined content

**Benefits:**
- **Fine-tune AI Output**: Perfect each achievement individually
- **Maintain Control**: Guide the AI with your specific requirements
- **Experiment Freely**: Try different approaches and undo if needed
- **Save Time**: Quick presets for common refinement needs
- **Professional Polish**: Add domain-specific expertise to AI-generated content

### 📈 Inline Analysis Panel

**View compatibility analysis directly in the refinement page!**

**Overview:**
After running the AI Job Optimizer analysis, the compatibility scores are available in a collapsible panel at the top of the optimization results page. This allows you to reference missing skills, keywords, and strengths while editing your achievements.

**Features:**
- **Compact Header**: Shows overall compatibility score and level at a glance
- **Collapsible Design**: Click to expand/collapse full analysis details
- **Three Key Metrics**: Skills Match, Experience Relevance, and Keyword Alignment scores
- **Color-Coded Scores**: Green (80-100%), Amber (60-79%), Red (0-59%)
- **Strengths & Gaps**: View top 3 strengths and missing elements for each metric
- **Key Insights**: Overall key strengths and gaps to address
- **Non-Intrusive**: Starts collapsed so it doesn't interrupt editing workflow

**How to Use:**
1. **Analyze your resume** before optimization to generate compatibility scores
2. **Proceed to optimization** after reviewing the analysis
3. **In the results page**, find the purple analysis banner at the top
4. **Click the banner** to expand and see all details
5. **Reference the analysis** while editing achievements to address gaps
6. **Click again to collapse** and focus on editing

**Benefits:**
- **Informed Editing**: Know exactly which skills and keywords to emphasize
- **Context-Aware Refinement**: Use AI refinement with knowledge of missing elements
- **Easy Reference**: No need to switch between pages or remember analysis
- **Goal-Oriented**: Focus on addressing specific gaps identified in the analysis
- **Efficient Workflow**: Everything you need in one place

### 📝 AI Cover Letter Generator

**Generate professional, tailored cover letters in seconds!**

**How to Use:**
1. Sidebar → **Cover Letter Generator** → **Generate Cover Letter**
2. Paste resume text (or use current data) and job description
3. Click **Generate Cover Letter**
4. Review and **Download as PDF**

**What You Get:**
- Professional 3-4 paragraph business letter format
- Tailored content connecting experience to job requirements
- Proper date, salutation, and closing
- Compelling narrative with specific examples
- One-page length optimized for ATS

**Features:**
- Uses actual resume data (no placeholders)
- Original, human-like language (not copy-paste from job posting)
- Editable before download
- Ready-to-submit PDF format

### 🔧 AI Configuration

**Setup:**
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create `.env` file: `GOOGLE_AI_API_KEY=your_key_here`
3. Restart dev server

**Security:** API keys stored in `.env` (not in git), all processing server-side

**Testing:** Visit `/api/test-analysis` for consistency validation

## Quick Start Workflow

### Typical Usage Pattern

1. **Import Your Resume** (Data Management → Import Resume)
   - Upload file or paste text
   - AI converts to proper format
   
2. **Analyze Compatibility** (Job Optimizer → Analyze Resume Match)
   - Paste resume and job posting
   - Get detailed compatibility scores
   
3. **Optimize for Job** (Job Optimizer → Tailor for Job Post)
   - AI rewrites summary and achievements
   - View analysis panel for missing skills
   
4. **Refine Achievements** (Click ✨ button on each achievement)
   - Use quick presets or custom prompts
   - Undo if needed
   
5. **Apply & Download** (Click Apply button)
   - Apply optimizations to resume
   - Download as PDF

### Best Practices

- **Analyze before optimizing**: See what's missing in your resume
- **Use the analysis panel**: Reference gaps while refining achievements
- **Iterate with AI refinement**: Try different prompts for perfect results
- **Edit before applying**: Review and tweak all AI-generated content
- **Generate cover letter last**: Use optimized resume for better results

## Privacy & GDPR Compliance

Resumix is designed with privacy and GDPR compliance in mind for commercial use.

### Data Protection Features

**Local-First Architecture:**
- All resume data stored in your browser (localStorage)
- No server-side storage of personal information
- You maintain complete control over your data

**Consent Management:**
- First-time users see a consent modal
- Two-tier consent: Essential (required) + AI Processing (optional)
- AI features require explicit user consent
- Easy consent revocation in Privacy & Data settings

**User Rights:**
- **Right to Access**: Export your data as JSON
- **Right to Rectification**: Edit any information inline
- **Right to Erasure**: Delete all data with one click
- **Right to Data Portability**: Export in JSON and PDF formats
- **Right to Withdraw Consent**: Disable AI features anytime

**Privacy Controls:**
- Privacy & Data section in sidebar
- Toggle AI processing on/off
- Delete all data functionality
- Current consent status display
- Links to Privacy Policy and Terms of Service

### AI Data Processing

When you enable AI features, your resume data is sent to Google AI APIs for processing:
- **Service:** Google Generative AI (Gemini 2.5 Flash)
- **Purpose:** Resume optimization, cover letter generation, compatibility analysis
- **Data Sent:** Resume text, job descriptions, achievements
- **Consent:** Required before any AI processing
- **Warnings:** Clear notices before data is sent
- **Control:** Can be disabled anytime

**Important:** Only use AI features with data you're comfortable sharing with Google AI. Review Google's [Privacy Policy](https://policies.google.com/privacy) for details on their data handling.

### Documentation

- **Privacy Policy**: Comprehensive data handling disclosure at `/privacy-policy`
- **Terms of Service**: Legal terms and AI disclaimers at `/terms-of-service`
- **Compliance Docs**: See `PRIVACY_COMPLIANCE.md` for technical implementation details

### For Commercial Deployment

Before deploying for commercial use:

1. **Review Legal Documents:**
   - Customize Privacy Policy with your jurisdiction
   - Update Terms of Service with your entity information
   - Update contact emails (privacy@, legal@, support@)

2. **Environment Configuration:**
   - Set `GOOGLE_AI_API_KEY` in environment variables
   - Configure contact emails for privacy inquiries
   - Set production `APP_URL`

3. **Consider Enterprise Options:**
   - Google Vertex AI for enterprise-grade DPA
   - Self-hosted AI models for maximum privacy
   - Additional audit logging if required

4. **Compliance Setup:**
   - Designate someone to handle GDPR requests (30-day response time)
   - Consider Data Protection Officer (DPO) if processing at scale
   - Review and update policies annually

### Security Best Practices

- All data stored client-side (browser localStorage)
- HTTPS encryption for all API communications
- No persistent server-side storage
- Consent-based third-party data sharing
- Clear data deletion mechanisms

### Testing Consent Flow

To test the compliance features:
1. Clear your browser localStorage
2. Reload the application
3. You should see the consent modal
4. Test "Essential Only" vs "Accept All"
5. Verify AI features work only with consent
6. Test consent revocation in Privacy & Data settings
7. Test data deletion functionality

For detailed technical documentation, see `PRIVACY_COMPLIANCE.md`.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
