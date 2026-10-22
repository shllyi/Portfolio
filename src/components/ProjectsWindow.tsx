import { useEffect, useMemo, useRef, useState } from 'react'
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projects'
import type { Project } from '../data/projects'
import './ProjectsWindow.css'

export type WindowStatus = 'idle' | 'open' | 'closed'

const PROJECT_MOTIFS: Record<string, string> = {
  'furcare-hub': '✿',
  sheemramen: '〰',
  'kwentong-kape': '☕',
  cocovision: '◉',
  pageturner: '✷',
  nendopop: '✧',
  unitree: '❋',
  lensheem: '◌',
  popsheem: '✦',
}

type Props = {
  status: WindowStatus
  onClose: () => void
  zIndex?: number // lets the desktop control stacking order against other windows
}

function ProjectsWindow({ status, onClose, zIndex }: Props) {
  const [category, setCategory] = useState<(typeof PROJECT_CATEGORIES)[number]>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const visible = useMemo(
    () => PROJECTS.filter((p) => category === 'All' || p.category === category),
    [category],
  )
  const projectYears = PROJECTS.flatMap((project) => project.year === undefined ? [] : [project.year])
  const yearRange = `${Math.min(...projectYears)}—${Math.max(...projectYears)}`
  const selected: Project | undefined = PROJECTS.find((p) => p.id === selectedId)

  // Esc closes the window
  useEffect(() => {
    if (status !== 'open') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status, onClose])

  // move focus to the project title when a card opens
  useEffect(() => {
    if (selectedId) headingRef.current?.focus()
  }, [selectedId])

  return (
    <div className="pw-layer" style={{ zIndex }}>
      <section
        className={`pw is-${status}`}
        aria-label="Projects window"
        aria-hidden={status !== 'open'}
      >
        <div className="titlebar">
          <span className="dot dot-green" aria-hidden="true" />
          <span className="dot dot-yellow" aria-hidden="true" />
          <button type="button" className="dot dot-red" aria-label="Close projects window" onClick={onClose} />
          <span className="pw-title" aria-hidden="true">
            projects.exe
          </span>
        </div>

        <div className="pw-body">
          {selected ? (
            <article className="pw-detail">
              <div className="project-detail-top">
                <button type="button" className="pw-back" onClick={() => setSelectedId(null)}>
                  <span aria-hidden="true">←</span> All projects
                </button>
                <span className="project-detail-index">PROJECT / {String(PROJECTS.indexOf(selected) + 1).padStart(2, '0')}</span>
              </div>
              <header className="project-detail-hero">
                <span className="project-detail-kicker">{selected.category} · {selected.type}</span>
                <h2 className="pw-name" tabIndex={-1} ref={headingRef}>{selected.name}</h2>
                {selected.tagline && <p className="pw-tagline">{selected.tagline}</p>}
                <ul className="pw-meta">
                  {selected.year && <li>{selected.year}</li>}
                  {selected.status && <li>{selected.status}</li>}
                </ul>
              </header>

              <div className="project-detail-content">
                <section className="project-detail-overview">
                  <h3 className="pw-sub">Project overview</h3>
                  {selected.overview ? <p className="pw-text">{selected.overview}</p> : <p className="pw-soon">More details coming soon.</p>}
                  {selected.problem && (
                    <>
                      <h3 className="pw-sub">The challenge</h3>
                      <p className="pw-text">{selected.problem}</p>
                    </>
                  )}
                  {selected.role && (
                    <>
                      <h3 className="pw-sub">My role</h3>
                      <p className="pw-text">{selected.role}</p>
                    </>
                  )}
                </section>
                {(selected.features || selected.techs.length > 0) && (
                  <aside className="project-detail-side">
                    {selected.features && (
                      <section className="project-detail-panel">
                        <h3 className="pw-sub">Key features</h3>
                        <ul className="pw-list">
                          {selected.features.map((feature) => <li key={feature}>{feature}</li>)}
                        </ul>
                      </section>
                    )}
                    {selected.techs.length > 0 && (
                      <section className="project-detail-panel">
                        <h3 className="pw-sub">Built with</h3>
                        <ul className="pw-tags">
                          {selected.techs.map((tech) => <li key={tech}>{tech}</li>)}
                        </ul>
                      </section>
                    )}
                  </aside>
                )}
              </div>
              {selected.screenshots && selected.screenshots.length > 0 && (
                <div className="pw-shots">
                  {selected.screenshots.map((s) => (
                    <img key={s.src} src={s.src} alt={s.alt} loading="lazy" />
                  ))}
                </div>
              )}

              {(selected.github || selected.demo) && (
                <div className="pw-links">
                  {selected.github && (
                    <a href={selected.github} target="_blank" rel="noopener noreferrer">
                      View code
                    </a>
                  )}
                  {selected.demo && (
                    <a href={selected.demo} target="_blank" rel="noopener noreferrer">
                      Live demo
                    </a>
                  )}
                </div>
              )}
            </article>
          ) : (
            <>
              <header className="projects-intro">
                <div className="projects-intro-copy">
                  <span className="projects-eyebrow">PROJECTS / {yearRange}</span>
                  <h2>Academic Projects</h2>
                  <p>Web and Mobile Applications.</p>
                </div>
                <div className="projects-count" aria-live="polite">
                  <strong>{String(visible.length).padStart(2, '0')}</strong>
                  <span>{visible.length === 1 ? 'PROJECT' : 'PROJECTS'}<br />{category === 'All' ? 'IN THE FOLDER' : `IN ${category.toUpperCase()}`}</span>
                </div>
                <span className="projects-intro-spark" aria-hidden="true">✦</span>
              </header>
              <div className="pw-tabs" role="group" aria-label="Filter projects by category">
                {PROJECT_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="pw-tab"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <ul className="pw-grid">
                {visible.map((p) => (
                  <li key={p.id}>
                    <button type="button" className="pw-card" data-project={p.id} onClick={() => setSelectedId(p.id)}>
                      <span className="pw-card-motif" aria-hidden="true">{PROJECT_MOTIFS[p.id]}</span>
                      <span className="pw-card-top">
                        <span className="pw-type">{p.type}</span>
                        {p.year && <span className="pw-year">{p.year}</span>}
                        {p.status && <span className="pw-project-status">{p.status}</span>}
                      </span>
                      <span className="pw-card-name">{p.name}</span>
                      {p.tagline && <span className="pw-card-tag">{p.tagline}</span>}
                      {p.techs.length > 0 && (
                        <span className="pw-tags pw-tags-sm">
                          {p.techs.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </span>
                      )}
                      <span className="pw-card-open"><span>Open notebook entry</span><span aria-hidden="true">↗</span></span>
                    </button>
                  </li>
                ))}
              </ul>
              {visible.length === 0 && <p className="pw-soon">No projects in this category yet.</p>}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProjectsWindow