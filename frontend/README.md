# Music Recommendation Study

This repository contains the code for a research study exploring the impact of album covers on music recommendation systems. The study evaluates how visual album cover features may enhance recommendations through user feedback and statistical analysis.

## Project Overview

- **Purpose:**  
  Investigate whether adding album cover information to music recommendation algorithms improves user satisfaction, novelty, and overall relevance.

- **Components:**  
  - **Frontend:** A Next.js and React-based survey interface where users interact with multiple recommendation models.  
  - **Backend & Analysis:** Python scripts perform statistical analyses (t-tests, ANCOVA, ANOVA) and generate visualizations to assess the study hypotheses.  
  - **Database Layer:** Drizzle ORM defines database schemas, and metadata snapshots are maintained to manage survey data.
  - **Testing:** Playwright end-to-end tests ensure smooth user interactions across various devices and validate key survey flows.
  - **Analytics:** PostHog integration tracks page views and user events, providing insights into survey behavior.

## Frontend Structure

- **Pages:**  
  - Survey steps (e.g., model recommendations, playlist swipers, review screens)  
  - Terms and conditions, thank-you page, and home page

- **Components:**  
  - UI primitives (Sheet, Popover, Chart, etc.)
  - Multi-step form components utilizing React context for state management and Zod for schema validation.
  - Music-specific components such as SongDetailsPanel and MusicSwiper for interactive user experiences.

- **State Management:**  
  Built-in survey context handles data collection and persistence across multiple steps. The local storage is used to retain incomplete surveys.

- **Styling & Theming:**  
  Tailwind CSS combined with custom theming (light/dark mode) support a sleek, responsive design.

## Backend & Analysis

- **Python Modules:**  
  - `analysis.py` handles statistical tests and visualization plots, saving results to the `results` directory.
  - `voyager.py` focuses on data visualization and interactions with external data sources like Google Drive.

- **Database Queries & Schema:**  
  Drizzle ORM and associated SQL snapshots lay out the database structure for storing survey responses and recommendations.

## Testing and Deployment

- **End-to-End Testing:**  
  Playwright tests emulate user flows—from survey initiation and navigation to final submission—ensuring a reliable user experience.

- **Getting Started:**  
  To launch the development server, run:
  ```bash
  npm run dev
  ```
  or the equivalent command for your package manager.

- **Deployment:**  
  Detailed deployment instructions are available in the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Additional Tools

- **Internationalization:**  
  Messages and locale-specific texts are managed via JSON files under the messages directory.
  
- **Analytics:**  
  PostHog is integrated to monitor survey engagement and track page views dynamically.

## Conclusion

This repository encapsulates a robust framework to evaluate the role of visual information in music recommendation systems, combining modern frontend technologies with comprehensive data analysis and testing workflows.

## How to Run

### Frontend Development Server
To start the development server, run:
```bash
npm run dev
```

### Running End-to-End Tests
To execute the Playwright tests, run:
```bash
npx playwright test
```
