import { profile } from '../../data/profile.js'
import { projects } from '../../data/projects.js'

// ===========================================================================
// TERMINAL COMMANDS
// Everything the hidden terminal (opened by clicking the keyboard) understands.
//
// Each command has:
//   - description: shown by `help` (leave it out to keep a command secret)
//   - run(args): returns { lines, action }
//       lines  -> what gets printed (see the helpers below)
//       action -> optional special effect: 'clear' | 'exit' | 'matrix' | 'email'
//
// To add a command, add an entry to COMMANDS. The text is pulled from
// data/profile.js and data/projects.js, so it updates itself when those change.
// ===========================================================================

// Line helpers: `style` picks the colour (see .terminal__line--* in App.css)
const text = (value) => ({ text: value, style: 'text' })
const accent = (value) => ({ text: value, style: 'accent' })
const muted = (value) => ({ text: value, style: 'muted' })
const error = (value) => ({ text: value, style: 'error' })
const link = (label, href) => ({ text: label, href, style: 'link' })
const blank = () => ({ text: '', style: 'text' })

function whoamiLines() {
  return [accent(`${profile.name} - ${profile.role}`), text(profile.intro)]
}

// Skills = every technology used across the projects, without duplicates.
function skillsLines() {
  const tech = [...new Set(projects.flatMap((project) => project.tech || []))]
  const rows = []
  for (let i = 0; i < tech.length; i += 4) rows.push(text(`  ${tech.slice(i, i + 4).join('  ·  ')}`))
  return [accent("Tech I've built with:"), ...rows]
}

function projectsLines() {
  return [
    accent(`${projects.length} projects found:`),
    ...projects.map((project) => text(`  -> ${project.title}${project.subtitle ? `  (${project.subtitle})` : ''}`)),
    blank(),
    muted("Type 'exit' and open the Projects tab to see them in action."),
  ]
}

function contactLines() {
  const lines = [accent('Reach me at:')]
  if (profile.email) lines.push(link(`  email     ${profile.email}`, `mailto:${profile.email}`))
  if (profile.github) lines.push(link(`  github    ${profile.github.replace(/^https?:\/\//, '')}`, profile.github))
  if (profile.linkedin) lines.push(link(`  linkedin  ${profile.linkedin.replace(/^https?:\/\//, '')}`, profile.linkedin))
  if (profile.cv) lines.push(link('  cv        download', profile.cv))
  return lines
}

// "Files" for `ls` and `cat`, mapped to the commands that print them.
const FILES = {
  'about.txt': whoamiLines,
  'skills.txt': skillsLines,
  'contact.txt': contactLines,
}

export const COMMANDS = {
  help: {
    description: 'list available commands',
    run: () => ({
      lines: [
        accent('Available commands:'),
        ...Object.entries(COMMANDS)
          .filter(([, command]) => command.description)
          .map(([name, command]) => text(`  ${name.padEnd(17)}${command.description}`)),
        blank(),
        muted('Tip: Tab autocompletes, Up/Down recalls previous commands.'),
      ],
    }),
  },
  whoami: { description: 'who is Storm?', run: () => ({ lines: whoamiLines() }) },
  skills: { description: "tech I've worked with", run: () => ({ lines: skillsLines() }) },
  projects: { description: 'list my projects', run: () => ({ lines: projectsLines() }) },
  contact: { description: 'ways to reach me', run: () => ({ lines: contactLines() }) },
  email: {
    description: 'open your mail app',
    run: () => ({ lines: [muted(`Opening a new email to ${profile.email}...`)], action: 'email' }),
  },
  ls: {
    description: 'list files',
    run: () => ({ lines: [text(`${Object.keys(FILES).join('    ')}    projects/`)] }),
  },
  cat: {
    // secret: not listed in help, but `ls` hints at it
    run: (args) => {
      if (!args) return { lines: [error('usage: cat <file>')] }
      if (args === 'projects' || args === 'projects/') return { lines: [error(`cat: ${args}: Is a directory (try 'projects')`)] }
      const file = FILES[args]
      return { lines: file ? file() : [error(`cat: ${args}: No such file`)] }
    },
  },
  sudo: {
    description: 'try: sudo hire storm',
    run: (args) => {
      if (args.toLowerCase() === 'hire storm') {
        return {
          lines: [
            muted('[sudo] password for recruiter: ********'),
            accent('ACCESS GRANTED'),
            text("Excellent decision. Let's talk:"),
            ...(profile.email ? [link(`  ${profile.email}`, `mailto:${profile.email}`)] : []),
          ],
        }
      }
      return { lines: [error('guest is not in the sudoers file. This incident will be reported.')] }
    },
  },
  matrix: {
    description: 'wake up, Neo...',
    run: () => ({ lines: [muted('Follow the white rabbit. (press any key)')], action: 'matrix' }),
  },
  clear: { description: 'clear the screen', run: () => ({ lines: [], action: 'clear' }) },
  exit: {
    description: 'back to the Portfolio OS menu',
    run: () => ({ lines: [muted('Launching Portfolio OS...')], action: 'exit' }),
  },
}

// Runs one line of input. Returns { lines, action } like a command does.
export function runCommand(input) {
  const trimmed = input.trim()
  if (!trimmed) return { lines: [] }

  const [name, ...rest] = trimmed.split(/\s+/)
  const command = COMMANDS[name.toLowerCase()]
  if (!command) {
    return { lines: [error(`command not found: ${name}`), muted("Type 'help' to see what I can do.")] }
  }
  return command.run(rest.join(' '))
}

// Tab completion: the single command that starts with what's been typed.
export function autocomplete(input) {
  const typed = input.trimStart().toLowerCase()
  if (!typed || typed.includes(' ')) return null
  const matches = Object.keys(COMMANDS).filter((name) => name.startsWith(typed))
  return matches.length === 1 ? matches[0] : null
}
