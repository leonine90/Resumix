# Privacy & GDPR Compliance Documentation

**Last Updated:** October 12, 2025  
**Version:** 1.0

## Overview

This document outlines the data processing activities, PII mapping, and compliance measures implemented in Resumix for GDPR and privacy law compliance.

## Data Processing Activities Register

### 1. Local Resume Building (No Third-Party Processing)
- **Purpose:** Enable users to create and edit resumes locally
- **Legal Basis:** Contract (providing the service)
- **Data Processed:** All resume data (personal info, work history, education, skills, etc.)
- **Storage Location:** User's browser (localStorage)
- **Retention:** Until user clears browser data or deletes manually
- **Third Parties:** None
- **Consent Required:** No (essential functionality)

### 2. AI Resume Optimization
- **Purpose:** Enhance resume content for specific job applications
- **Legal Basis:** Consent (explicit user opt-in)
- **Data Processed:** Resume text, job descriptions, achievements
- **Storage Location:** Temporary processing by Google AI
- **Retention:** Per Google's AI retention policy
- **Third Parties:** Google Generative AI (Gemini 2.5 Flash)
- **Consent Required:** Yes

### 3. AI Cover Letter Generation
- **Purpose:** Generate tailored cover letters
- **Legal Basis:** Consent (explicit user opt-in)
- **Data Processed:** Resume text, job descriptions
- **Storage Location:** Temporary processing by Google AI
- **Retention:** Per Google's AI retention policy
- **Third Parties:** Google Generative AI (Gemini 2.5 Flash)
- **Consent Required:** Yes

### 4. Resume-Job Compatibility Analysis
- **Purpose:** Analyze how well resume matches job requirements
- **Legal Basis:** Consent (explicit user opt-in)
- **Data Processed:** Resume text, job descriptions
- **Storage Location:** Temporary processing by Google AI
- **Retention:** Per Google's AI retention policy
- **Third Parties:** Google Generative AI (Gemini 2.5 Flash)
- **Consent Required:** Yes

### 5. AI Resume Import
- **Purpose:** Convert unstructured resume text to application format
- **Legal Basis:** Consent (explicit user opt-in)
- **Data Processed:** Resume text or uploaded files
- **Storage Location:** Temporary processing by Google AI
- **Retention:** Per Google's AI retention policy
- **Third Parties:** Google Generative AI (Gemini 2.5 Flash)
- **Consent Required:** Yes

## PII Data Mapping

### Personal Identifiers
| Data Element | Purpose | Source | Storage | Third-Party Access | Retention |
|---|---|---|---|---|---|
| Full Name | Resume identification | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Email Address | Contact information | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Phone Number | Contact information | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Physical Address | Contact information | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Date of Birth | Resume detail | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| LinkedIn URL | Professional profile | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Headshot Image | Visual identification | User-provided URL | Browser localStorage | None | User-controlled |

### Professional Information
| Data Element | Purpose | Source | Storage | Third-Party Access | Retention |
|---|---|---|---|---|---|
| Work Experience | Employment history | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Job Titles | Professional roles | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Company Names | Employer identification | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Employment Dates | Career timeline | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Achievements | Job accomplishments | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Education History | Academic background | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Skills | Professional capabilities | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Publications | Academic/professional output | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Languages | Language proficiency | User input | Browser localStorage | Google AI (with consent) | User-controlled |
| Volunteer Work | Community involvement | User input | Browser localStorage | Google AI (with consent) | User-controlled |

### Consent & Preferences
| Data Element | Purpose | Source | Storage | Third-Party Access | Retention |
|---|---|---|---|---|---|
| AI Consent Flag | Track AI processing permission | User choice | Browser localStorage | None | User-controlled |
| Consent Timestamp | Audit trail | System-generated | Browser localStorage | None | User-controlled |
| Consent Version | Policy version tracking | System-generated | Browser localStorage | None | User-controlled |

## Data Flow Diagrams

### Local Resume Building Flow
```
User Input → Browser JavaScript → localStorage → User's Device
                                              ↓
                                         PDF Export
```

### AI Processing Flow (With Consent)
```
User Input → Consent Check → Application Server → Google AI API
                ↓                                       ↓
            Denied: Stop                          Processing
                                                        ↓
                                                   Response
                                                        ↓
                                              Application Server
                                                        ↓
                                                  User's Browser
```

## Third-Party Processors

### Google Generative AI (Primary Processor)
- **Service:** Gemini 2.5 Flash API
- **Purpose:** AI-powered resume optimization, analysis, and content generation
- **Data Shared:** Resume text, job descriptions, achievements (only with explicit user consent)
- **Location:** United States (Google Cloud infrastructure)
- **Agreement:** Google Cloud Terms of Service
- **Privacy Policy:** https://policies.google.com/privacy
- **Data Retention:** Per Google's AI retention policy
- **Security:** TLS encryption in transit
- **GDPR Compliance:** Google provides Standard Contractual Clauses

## Data Retention Policies

### User-Controlled Data
- **Storage:** Browser localStorage
- **Retention:** Indefinite until user action
- **Deletion Methods:**
  1. "Delete All Data" button in Privacy & Data settings
  2. Manual browser data clearing
  3. Browser uninstallation/reset

### Server-Side Data
- **Storage:** None - no persistent server storage
- **Retention:** N/A
- **Note:** API requests are processed in real-time with no server-side persistence

### Third-Party Processing (Google AI)
- **Storage:** Temporary processing memory
- **Retention:** Per Google's Generative AI retention policy
- **Control:** Users can revoke consent to prevent future data sharing

## Security Measures

### Technical Safeguards
1. **Client-Side Storage:** All user data stored locally in browser, not on servers
2. **HTTPS Encryption:** All API communications use TLS encryption
3. **No Server Persistence:** No resume data stored on application servers
4. **Consent-Based Processing:** AI features blocked until explicit consent granted
5. **Data Minimization:** Only necessary data sent to AI services
6. **Access Controls:** Data accessible only to the user in their browser

### Organizational Safeguards
1. **Privacy by Design:** Consent mechanisms built into all AI features
2. **Transparent Processing:** Clear warnings before data sent to third parties
3. **User Control:** Easy data deletion and consent revocation
4. **Documentation:** Comprehensive privacy policy and terms of service
5. **Audit Trail:** Consent timestamps for accountability

### Consent Management
1. **First-Visit Modal:** Consent request on first application use
2. **Two-Tier Consent:** Essential (required) vs. AI Processing (optional)
3. **Granular Control:** Users can enable/disable AI features independently
4. **Easy Revocation:** One-click consent withdrawal in settings
5. **Version Tracking:** Consent re-requested when policy changes

## User Rights Implementation

### Right to Access
- **Implementation:** JSON export functionality
- **Location:** Sidebar → Data Management → Export as JSON
- **Format:** Machine-readable JSON

### Right to Rectification
- **Implementation:** Inline editing for all resume fields
- **Location:** Click any text when editing enabled
- **Scope:** All personal and professional data

### Right to Erasure
- **Implementation:** "Delete All Data" button
- **Location:** Sidebar → Privacy & Data → Delete All Data
- **Scope:** Complete removal of all localStorage data
- **Confirmation:** Double-confirmation dialog

### Right to Data Portability
- **Implementation:** Export in multiple formats
- **Formats:** JSON (structured), PDF (readable)
- **Location:** Sidebar → Data Management

### Right to Withdraw Consent
- **Implementation:** AI consent toggle
- **Location:** Sidebar → Privacy & Data → Enable AI Features
- **Effect:** Immediately blocks all AI processing

### Right to Object
- **Implementation:** Consent denial in modal, toggle in settings
- **Effect:** All AI features disabled

## Compliance Checklist

### GDPR Requirements
- [x] Legal basis for processing documented
- [x] Consent mechanism for non-essential processing
- [x] Privacy policy with all required disclosures
- [x] User rights implementation (access, rectification, erasure, portability)
- [x] Data processing agreement with third-party processor reference
- [x] Data retention policies defined
- [x] Security measures implemented
- [x] Privacy by design principles applied
- [x] Consent withdrawal mechanism
- [x] Data minimization practices

### Technical Implementation
- [x] Consent modal on first visit
- [x] Consent state management (localStorage)
- [x] Consent version tracking
- [x] AI feature blocking without consent
- [x] Privacy policy accessible
- [x] Terms of service accessible
- [x] Data deletion functionality
- [x] Data export functionality
- [x] Clear data processing warnings
- [x] Footer with legal links

### Documentation
- [x] Privacy Policy
- [x] Terms of Service
- [x] Privacy Compliance Documentation (this file)
- [x] README with privacy section
- [x] PII data mapping
- [x] Data flow documentation

## Contact Information

### Privacy Inquiries
- **Email:** privacy@resumix.app
- **Purpose:** GDPR requests, privacy concerns, data protection questions
- **Response Time:** Within 30 days as required by GDPR

### Legal Inquiries
- **Email:** legal@resumix.app
- **Purpose:** Legal matters, terms of service questions

## Audit Trail

### Consent Records
- **Storage:** Browser localStorage
- **Fields:** aiProcessing (boolean), timestamp (ISO 8601), version (string)
- **Access:** User only (via browser developer tools or data export)
- **Purpose:** Demonstrate compliance with consent requirements

### No Server Logs
- **Note:** Application does not maintain server-side audit logs of user actions
- **Rationale:** No server-side storage of user data

## Recommendations for Operators

### Before Production Deployment
1. Review and customize jurisdiction in Terms of Service (Section 15)
2. Add actual contact email addresses (update privacy@resumix.app, legal@resumix.app)
3. Consider switching from Google Gemini API to Vertex AI for enterprise DPA
4. Review Google's latest privacy policy and terms
5. Consider obtaining cyber liability insurance
6. Determine if a Data Protection Officer (DPO) is required based on scale
7. Implement server-side logging if audit trail needed (ensure GDPR compliance)

### Ongoing Compliance
1. Monitor consent acceptance rates
2. Review and update privacy policy annually
3. Track and respond to user rights requests
4. Monitor Google AI policy changes
5. Keep documentation updated
6. Conduct periodic privacy impact assessments
7. Train any team members on privacy practices

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | October 12, 2025 | Initial privacy compliance implementation |

---

**Document Owner:** Resumix Development Team  
**Review Frequency:** Annually or upon significant changes  
**Next Review:** October 12, 2026

