// ===========================================================================
// PROJECTS
// Everything shown in the Projects tab, on the right monitor, by the terminal's
// `projects` command and on the phone screen.
//
// Each project:
//   category      heading it's grouped under on the left monitor (in order of
//                 first appearance)
//   tech          shown as tags (the first 3 on the left list, up to 6 on the
//                 right monitor)
//   links.code    GitHub repo (null = no public code)
//   links.live    live demo (null = none yet)
//   previewVideo  screen recording for the right monitor, e.g.
//                 '/videos/airbnb.mp4' (file goes in public/videos). null = none yet
//   previewImage  fallback screenshot, e.g. '/images/airbnb.jpg'. null = none yet
//   note          optional one-liner shown instead of links (e.g. client work)
// ===========================================================================

const GITHUB = 'https://github.com/Stormzy-webdev'

export const projects = [
  {
    id: 'airbnb-capstone',
    title: 'Airbnb Clone (Capstone)',
    subtitle: 'Full-stack booking platform',
    description:
      'My bootcamp capstone: guests search listings, view details and book stays, while hosts manage listings and reservations from their own dashboard. Backed by a REST API with JWT authentication and MongoDB.',
    category: 'Featured',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Cloudinary'],
    links: { code: `${GITHUB}/airbnb-capstone`, live: 'https://airbnb-frontend-9obn.onrender.com/' },
    previewVideo: '/videos/airbnb.mp4',
    previewImage: '/images/airbnb.jpg',
  },
  {
    id: 'robben-island-vr',
    title: 'Robben Island Museum VR',
    subtitle: 'Client work at UWC Innovation Hub',
    description:
      'Contributed to a large-scale VR experience for the Robben Island Museum, a heritage site with over 300,000 visitors a year. I designed and built an interactive 3D coin reward that visitors unlock by completing tasks.',
    category: 'Featured',
    tech: ['Unity', 'VR', 'Blender', '3D modelling'],
    links: { code: null, live: null },
    note: 'Client project: no public code or demo.',
    previewVideo: null,
    previewImage: null,
  },
  {
    id: '3d-portfolio',
    title: 'Interactive 3D Portfolio',
    subtitle: "The site you're on",
    description:
      'A 3D desk modelled in Blender and rendered in the browser with React Three Fiber: cinematic camera moves, a working Portfolio OS on the monitors, generated sound, a hidden terminal and a phone fallback.',
    category: 'Featured',
    tech: ['React', 'Three.js', 'R3F', 'Vite', 'Blender', 'Web Audio'],
    links: { code: `${GITHUB}/PortfolioWebsite`, live: 'https://portfolio-website-six-sigma-80.vercel.app' },
    previewVideo: null,
    previewImage: null,
  },
  {
    id: 'student-feedback',
    title: 'Student Feedback Automation',
    subtitle: 'React form + n8n workflow',
    description:
      'A React feedback form wired to an n8n workflow that validates each submission, saves it to Google Sheets, flags low ratings for follow-up and automatically emails the student a thank-you.',
    category: 'Full Stack & AI',
    tech: ['React', 'n8n', 'Google Sheets', 'Webhooks', 'Vite'],
    links: { code: `${GITHUB}/student-feedback-form`, live: null },
    previewVideo: null,
    previewImage: null,
  },
  {
    id: 'rag-handbook',
    title: 'Handbook Assistant (RAG)',
    subtitle: 'AI question answering',
    description:
      'An AI assistant that answers questions about a bootcamp handbook. It searches the PDF for relevant passages, answers only from what it finds and cites the page. Runs locally with Ollama behind a FastAPI endpoint.',
    category: 'Full Stack & AI',
    tech: ['Python', 'FastAPI', 'FAISS', 'Embeddings', 'Ollama'],
    links: { code: `${GITHUB}/RAG-System`, live: null },
    previewVideo: null,
    previewImage: null,
  },
  {
    id: 'online-store',
    title: 'Urban Threads Store',
    subtitle: 'E-commerce with Firebase',
    description:
      'An online clothing store with user login, products loaded from Firestore and a shopping cart saved to each user’s account in real time.',
    category: 'Full Stack & AI',
    tech: ['JavaScript', 'Firebase Auth', 'Firestore', 'HTML', 'CSS'],
    links: { code: `${GITHUB}/online-store`, live: null },
    previewVideo: null,
    previewImage: null,
  },
  {
    id: 'amazon-clone',
    title: 'Amazon Clone',
    subtitle: 'Storefront recreation',
    description:
      'A recreation of the Amazon storefront in vanilla JavaScript: products rendered from data, category filters and search, plus a cart that persists between visits and a dark/light theme.',
    category: 'Frontend',
    tech: ['JavaScript', 'HTML', 'CSS', 'localStorage'],
    links: { code: `${GITHUB}/Amazon-Clone`, live: null },
    previewVideo: '/videos/amazon.mp4',
    previewImage: '/images/amazon.jpg',
  },
  {
    id: 'google-keep-clone',
    title: 'Google Keep Clone',
    subtitle: 'Notes app',
    description:
      'A Google Keep-style notes app: an expanding note composer, a colour picker per note that keeps text readable on any colour, and a dark/light theme.',
    category: 'Frontend',
    tech: ['JavaScript', 'HTML', 'CSS'],
    links: { code: `${GITHUB}/GoogleKept`, live: null },
    previewVideo: '/videos/google-keep.mp4',
    previewImage: '/images/google-keep.jpg',
  },
  {
    id: 'tictactoe',
    title: 'TicTacToe',
    subtitle: 'Two-player React game',
    description:
      'A two-player Tic Tac Toe game built in React: custom player names, a running scoreboard of wins and draws, undo and restart, win/draw notifications and sound effects with a mute toggle.',
    category: 'Frontend',
    tech: ['React', 'JavaScript', 'Webpack', 'Babel', 'CSS'],
    links: { code: `${GITHUB}/TicTacToe`, live: null },
    previewVideo: '/videos/tictactoe.mp4',
    previewImage: '/images/tictactoe.jpg',
  },
]

export const defaultProjectId = projects[0].id
