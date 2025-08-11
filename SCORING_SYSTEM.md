# Resume Scoring System

## Overview

The resume scoring system has been redesigned to provide **consistent, quantifiable scores** for the same resume-job combination. This ensures that users get reliable feedback that doesn't vary between analysis runs.

## Scoring Methodology

### 1. Skills Match Scoring (0-100)

**Formula**: `(Exact matches × 3) + (Related skills × 1) = Raw score`
**Normalization**: `(Raw score / Total job skills × 3) × 100`
**Cap**: 100 if exceeds

**Example**:
- Job requires: React, TypeScript, Node.js, Git, CSS, Testing
- Resume has: React, TypeScript, Node.js, Git, HTML (exact matches)
- Resume has: JavaScript, Web Development (related skills)
- Calculation: (5×3 + 2×1) / (6×3) × 100 = 17/18 × 100 = 94.4% → 94%

### 2. Experience Relevance Scoring (0-100)

**Components**:
- **Industry Match**: 0-30 points
  - Same industry = 30 points
  - Related industry = 20 points  
  - Different industry = 0-10 points
- **Role Level Match**: 0-30 points
  - Exact level = 30 points
  - Adjacent level = 20 points
  - Different level = 0-15 points
- **Achievement Quality**: 0-40 points
  - Quantified results = 40 points
  - Descriptive achievements = 25 points
  - Basic descriptions = 10 points

**Total**: Sum of all three categories

### 3. Keyword Alignment Scoring (0-100)

**Formula**: `(Exact matches × 2) + (Contextual matches × 1) = Raw score`
**Normalization**: `(Raw score / Total job keywords × 2) × 100`
**Cap**: 100 if exceeds

**Keywords include**: Technologies, methodologies, certifications, tools, frameworks

### 4. Overall Compatibility Scoring (0-100)

**Weighted Average**:
- Skills Match: 35%
- Experience Relevance: 40%
- Keyword Alignment: 25%

**Formula**: `(Skills × 0.35) + (Experience × 0.40) + (Keywords × 0.25)`
**Rounding**: To nearest whole number

## Compatibility Levels

| Score Range | Level | Description |
|-------------|-------|-------------|
| 90-100 | Excellent | Perfect alignment |
| 80-89 | Strong | Minor gaps only |
| 70-79 | Good | Some gaps but relevant |
| 60-69 | Moderate | Meaningful overlap |
| 50-59 | Weak | Some relevance |
| 0-49 | Poor | Wrong field/level |

## Consistency Features

### 1. Low Temperature AI Configuration
- Temperature: 0.1 (very low for consistency)
- Top-p: 0.8
- Top-k: 40

### 2. Quantifiable Criteria
- All scores based on specific counts and formulas
- No subjective interpretation
- Transparent calculations in explanations

### 3. Validation
- Score range validation (0-100)
- Explanation length validation
- Weighted average verification
- Consistency testing with multiple runs

## Testing

The system includes a test endpoint (`/api/test-analysis`) that:
- Runs the same resume-job combination 3 times
- Verifies score consistency (≤5 point difference)
- Provides detailed calculation breakdowns
- Shows average scores across runs

## Example Output

```json
{
  "metrics": {
    "skillsMatch": {
      "score": 83,
      "explanation": "Found 8 exact skill matches and 2 related skills out of 10 job requirements. Calculation: (8×3 + 2×1) / (10×3) × 100 = 86.67% (Rounded down to 83% to avoid exceeding 100%)"
    },
    "experienceRelevance": {
      "score": 65,
      "explanation": "Industry: 20/30, Role Level: 20/30, Achievements: 25/40. Total: 65%"
    },
    "keywordAlignment": {
      "score": 60,
      "explanation": "Found 6 exact keyword matches and 2 contextual matches out of 10 job keywords. Calculation: (6×2 + 2×1) / (10×2) × 100 = 70% (Rounded down to 60% to avoid exceeding 100%)"
    },
    "overallCompatibility": {
      "score": 71,
      "explanation": "Weighted calculation: Skills(83×0.35) + Experience(65×0.40) + Keywords(60×0.25) = 70.55% (Rounded to 71%)"
    }
  }
}
```

## Benefits

1. **Consistency**: Same resume + job always produces same scores
2. **Transparency**: All calculations are explained
3. **Quantifiable**: Based on specific counts, not subjective assessment
4. **Reliable**: Low temperature AI ensures consistent results
5. **Testable**: Built-in consistency testing
6. **Actionable**: Specific recommendations based on quantifiable gaps
