// ===========================================================================
// SITE CONTENT
// The About, Skills and Experience text shown on the left monitor's tabs (and
// by the terminal's `skills` / `experience` commands). Edit the text here and
// every place that shows it updates. Projects live in projects.js and contact
// details in profile.js. Kept in line with the CV.
// ===========================================================================

// About tab: a few short paragraphs. Keep it brief, it has to fit on a monitor.
export const about = [
  'Junior full-stack developer with three years at the UWC Innovation Hub, where I went from AR/VR intern to Analyst Programmer leading a team of six on client projects, including the Robben Island Museum.',
  "I recently completed Zaio's Full Stack Web Development bootcamp, building and deploying a full-stack booking platform (React, Node.js, Express, MongoDB) and an AI document assistant (Python, FastAPI, RAG).",
  'A degree in 3D animation and hands-on Three.js and Unity work let me bring interactive, visual experiences to the web.',
]

// Skills tab: grouped like on the CV. Add, remove or rename freely.
export const skills = [
  { group: 'Frontend', items: ['JavaScript (ES6+)', 'React', 'HTML5', 'CSS3', 'Responsive design'] },
  { group: 'Backend & APIs', items: ['Node.js', 'Express', 'REST APIs', 'JWT auth', 'Python', 'FastAPI'] },
  { group: 'Databases', items: ['MongoDB', 'Firestore', 'PostgreSQL (basic)', 'Data modelling'] },
  { group: 'AI', items: ['RAG pipelines', 'Embeddings', 'FAISS vector search', 'Ollama'] },
  { group: '3D & Interactive', items: ['Three.js / R3F', 'Unity', 'Twinmotion', 'Blender', '3D scanning', 'AR/VR'] },
  { group: 'Tools', items: ['Git & GitHub', 'Vite', 'Render', 'Vercel', 'Cloudinary', 'n8n'] },
]

// Experience tab: newest first. `points` are the bullet points under each role.
export const experience = [
  {
    role: 'Analyst Programmer',
    place: 'UWC Innovation Hub',
    dates: 'Apr 2024 - Jun 2026',
    points: [
      'Promoted from intern to lead a team of 6: project delivery, task allocation and working with stakeholders on requirements.',
      'Robben Island Museum VR (300,000+ visitors a year): photographed Jetty 1 with standard and 360° captures, built 3D scans and laid out the scene in Twinmotion for the client.',
      'Co-designed and storyboarded the experience, synced its audio and video, and built the 3D coin reward unlocked on task completion.',
      "Ran multi-headset demos with the museum's CEO and team, gathering feedback and catching bugs.",
      'Ran the content pipeline from modelling and texturing to Unity integration, and supported all AR/VR systems at the Hub.',
    ],
  },
  {
    role: 'AR/VR Intern',
    place: 'UWC Innovation Hub',
    dates: 'Apr 2023 - Apr 2024',
    points: [
      'Worked on immersive software projects and researched AR in higher education.',
      'Set up and maintained AR/VR hardware and software; trained students and staff with JigSpace.',
    ],
  },
]

// Shown under Experience as a short "Education" list.
export const education = [
  { title: 'Full Stack Web Development Bootcamp', place: 'Zaio Institute of Technology', dates: '2026' },
  { title: 'BA Applied Arts in 3D Animation', place: 'STADIO Higher Education', dates: '2019 - 2022' },
  { title: 'Unity Learn: Create With Code', place: 'Unity', dates: 'at UWC Innovation Hub' },
]
