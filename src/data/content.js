// ===========================================================================
// SITE CONTENT
// The About, Skills and Experience text shown on the left monitor's tabs (and
// by the terminal's `skills` / `experience` commands). Edit the text here and
// every place that shows it updates. Projects live in projects.js and contact
// details in profile.js.
// ===========================================================================

// About tab: a few short paragraphs. Keep it brief, it has to fit on a monitor.
export const about = [
  'Junior Software Engineer with over two years of commercial experience at the UWC Innovation Hub, where I progressed from intern to Analyst Programmer and led a team of six.',
  "I've just completed a Full Stack Web Development bootcamp at Zaio Institute of Technology, building apps with React, Node.js, Express, REST APIs and SQL/NoSQL databases.",
  'I learn fast, explain technical work clearly, and want to grow into a well-rounded software engineer, with Java and enterprise development next.',
]

// Skills tab: grouped like on the CV. Add, remove or rename freely.
export const skills = [
  { group: 'Languages & Web', items: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'React', 'Responsive design'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'JWT auth', 'Firebase'] },
  { group: 'Databases', items: ['SQL', 'MongoDB', 'Firestore', 'Data modelling'] },
  { group: 'AI & Automation', items: ['RAG (FAISS + embeddings)', 'Python / FastAPI', 'n8n workflows'] },
  { group: '3D & XR', items: ['Three.js / React Three Fiber', 'Unity', 'Blender', 'AR/VR'] },
  { group: 'Tools', items: ['Git & GitHub', 'VS Code', 'Vite', 'Agile'] },
]

// Experience tab: newest first. `points` are the bullet points under each role.
export const experience = [
  {
    role: 'Analyst Programmer',
    place: 'UWC Innovation Hub',
    dates: 'Apr 2024 - Jun 2026',
    points: [
      'Promoted from intern to lead a team of 6: project delivery, task allocation and stakeholder requirements.',
      'Built an interactive 3D coin reward for the Robben Island Museum VR experience (300,000+ visitors a year).',
      'Ran the content pipeline from modelling and texturing to Unity integration.',
      'Supported and maintained all AR/VR systems at the Hub and delivered training.',
    ],
  },
  {
    role: 'AR/VR Intern',
    place: 'UWC Innovation Hub',
    dates: 'Apr 2023 - Apr 2024',
    points: [
      'Worked on immersive software projects and researched AR in higher education.',
      'Set up and maintained AR/VR hardware and software; trained students and staff.',
    ],
  },
]

// Shown under Experience as a short "Education" list.
export const education = [
  { title: 'Full Stack Web Development Bootcamp', place: 'Zaio Institute of Technology', dates: '2026' },
  { title: 'BA Applied Arts in 3D Animation', place: 'STADIO Higher Education', dates: '2019 - 2022' },
]
