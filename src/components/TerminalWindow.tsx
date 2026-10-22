import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { PROJECTS } from '../data/projects'
import * as D from '../data/portfolio'
import './TerminalWindow.css'

type AppTarget = 'projects' | 'about' | 'skills' | 'art' | 'contact' | 'terminal'
type Entry = { id: number; command: string; output: string }
type Props = { onOpen: (target: AppTarget) => void }

const COMMANDS = ['help', 'about', 'skills', 'projects', 'contact', 'github', 'open projects']

const helpText = `Available commands:
  help       Show this command list
  ls         List portfolio sections
  whoami     Meet Erica
  about      Read the profile summary
  skills     List technical and creative skills
  tools      List tools and software
  projects   List selected projects
  contact    Show contact details
  github     Open GitHub profile
  linkedin   Open LinkedIn profile
  instagram  Open Instagram profile
  open <app> Open a portfolio section
  clear      Clear this terminal`

function TerminalWindow({ onOpen }: Props) {
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputEndRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [entries])

  const run = (rawCommand: string) => {
    const command = rawCommand.trim()
    if (!command) return

    setHistory((current) => [...current, command])
    setHistoryIndex(-1)

    const normalized = command.toLowerCase().replace(/\s+/g, ' ')
    if (normalized === 'clear') {
      setEntries([])
      return
    }

    let output: string
    if (normalized === 'help') {
      output = helpText
    } else if (normalized === 'ls') {
      output = 'about_me.exe  skills.exe  art_studio.exe  projects.exe  contact.exe  terminal.exe'
    } else if (normalized === 'whoami' || normalized === 'about') {
      output = `${D.PERSON.name}\n${D.PERSON.identity}\n${D.PERSON.location}\n\n${D.PERSON.tagline}`
    } else if (normalized === 'skills') {
      output = `TECH SKILLS\n${D.TECH['Tech Skills'].map((skill) => `• ${skill.name}${skill.level ? ` — ${skill.level}` : ''}`).join('\n')}\n\nCREATIVE\n${D.HARD.join(' · ')}`
    } else if (normalized === 'tools') {
      output = D.SOFTWARE.map((tool) => `• ${tool.name}`).join('\n')
    } else if (normalized === 'projects') {
      output = PROJECTS.map((project) => `• ${project.name}${project.year ? ` (${project.year})` : ''} — ${project.type}`).join('\n')
    } else if (normalized === 'contact') {
      output = `Email: ${D.LINKS.email}\nInstagram: @shlly.i\nLocation: ${D.PERSON.location}`
    } else if (normalized === 'github') {
      output = D.LINKS.github
    } else if (normalized === 'linkedin') {
      output = D.LINKS.linkedin
    } else if (normalized === 'instagram') {
      output = D.LINKS.instagram
    } else if (normalized.startsWith('open ')) {
      const target = normalized.slice(5).replace(/\.exe$/, '')
      const targets: Record<string, AppTarget> = {
        projects: 'projects',
        about: 'about',
        about_me: 'about',
        skills: 'skills',
        art: 'art',
        art_studio: 'art',
        contact: 'contact',
        terminal: 'terminal',
      }
      const app = targets[target]
      if (app) {
        onOpen(app)
        output = `Opening ${target}.exe…`
      } else {
        output = `App not found: ${target}\nType "ls" to see available sections.`
      }
    } else {
      output = `Command not found: ${command}\nType "help" to see available commands.`
    }

    setEntries((current) => [...current, { id: nextId.current++, command, output }])
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    run(input)
    setInput('')
  }

  const navigateHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(nextIndex)
      setInput(history[history.length - 1 - nextIndex] ?? '')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = historyIndex - 1
      setHistoryIndex(nextIndex)
      setInput(nextIndex >= 0 ? history[history.length - 1 - nextIndex] : '')
    }
  }

  return (
    <section className="terminal" aria-label="Interactive portfolio terminal">
      <header className="terminal-header">
        <span className="terminal-status"><i /> SYSTEM ONLINE</span>
        <span className="terminal-path">ERICA / PORTFOLIO / SHELL</span>
      </header>
      <div className="terminal-screen">
        <div className="terminal-welcome">
          <p className="terminal-ascii" aria-hidden="true">┌─┐┬─┐┬┌─┬─┐┌─┐</p>
          <p><strong>Welcome to Erica’s portfolio terminal.</strong></p>
          <p>Type <code>help</code> to explore. This is a portfolio interface—not a system shell.</p>
        </div>
        <div className="terminal-suggestions" aria-label="Suggested commands">
          {COMMANDS.map((command) => (
            <button key={command} type="button" onClick={() => { setInput(command); inputRef.current?.focus() }}>
              {command}
            </button>
          ))}
        </div>
        <div className="terminal-output" aria-live="polite" aria-relevant="additions text">
          {entries.map((entry) => (
            <div className="terminal-entry" key={entry.id}>
              <p className="terminal-command"><span>erica@portfolio:~$</span> {entry.command}</p>
              <pre>{entry.output}</pre>
            </div>
          ))}
          <div ref={outputEndRef} />
        </div>
        <form className="terminal-form" onSubmit={submit}>
          <label htmlFor="terminal-input"><span>erica@portfolio:~$</span></label>
          <input
            ref={inputRef}
            id="terminal-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={navigateHistory}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Enter a terminal command"
            placeholder="type a command…"
          />
          <span className="terminal-cursor" aria-hidden="true" />
        </form>
      </div>
      <footer className="terminal-footer">
        <span>↑ / ↓ COMMAND HISTORY</span>
        <span>ENTER TO RUN</span>
      </footer>
    </section>
  )
}

export default TerminalWindow
