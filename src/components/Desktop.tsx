import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import profilePhoto from '../assets/PEQUE.jpg'
import portfolioLogo from '../assets/logo.png'
import {
  siBlender,
  siCplusplus,
  siCss,
  siFigma,
  siFirebase,
  siGithub,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siPhp,
  siPython,
  siTypescript,
  siXampp,
} from 'simple-icons'
import ProjectsWindow from './ProjectsWindow'
import TerminalWindow from './TerminalWindow'
import * as D from '../data/portfolio'
import './Desktop.css'

type Id = 'projects' | 'about' | 'skills' | 'art' | 'contact' | 'terminal'
type W = { open: boolean; min: boolean; seen: boolean; closing: boolean; z: number; tab: string }

const TABS: Partial<Record<Id, string[]>> = {
  about: ['Profile', 'Journey', 'Learning'],
  skills: [...Object.keys(D.TECH), 'Tools & Software', 'Skills'],
  art: ['Gallery', 'Creative Skills', 'Freelance'],
}
const FOLDERS: { id: Id; label: string; hue: number }[] = [
  { id: 'projects', label: 'projects', hue: 150 },
  { id: 'about', label: 'about_me', hue: 0 },
  { id: 'skills', label: 'skills', hue: 60 },
  { id: 'art', label: 'art_studio', hue: 290 },
  { id: 'contact', label: 'contact', hue: 200 },
  { id: 'terminal', label: 'terminal', hue: 0 },
]
const TITLES: Record<Id, string> = { projects: 'projects.exe', about: 'about_me.exe', skills: 'skills.exe', art: 'art_studio.exe', contact: 'contact.exe', terminal: 'terminal.exe' }
const mail = (subject: string) =>
  D.LINKS.email ? `mailto:${D.LINKS.email}?subject=${encodeURIComponent(subject)}` : ''

function Act({ href, label, hint, dl, alt }: { href: string; label: string; hint: string; dl?: boolean; alt?: boolean }) {
  const cls = `act${alt ? ' alt' : ''}`
  if (!href) return <button type="button" className={cls} disabled title={hint}>{label}</button>
  const ext = href.startsWith('http')
  return (
    <a className={cls} href={href} download={dl || undefined} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {label}
    </a>
  )
}
const NEED = {
  email: 'Add your email in LINKS.email (src/data/portfolio.ts)',
  linkedin: 'Add your URL in LINKS.linkedin (src/data/portfolio.ts)',
  github: 'Add your URL in LINKS.github (src/data/portfolio.ts)',
  instagram: 'Add your URL in LINKS.instagram (src/data/portfolio.ts)',
  resume: 'Add your PDF path in LINKS.resumePdf (src/data/portfolio.ts)',
}
const Empty = ({ children }: { children: ReactNode }) => <p className="pw-soon">{children}</p>

function FolderIcon({ hue = 0, className }: { hue?: number; className?: string }) {
  return (
    <svg className={className} style={{ filter: `hue-rotate(${hue}deg) drop-shadow(2px 2px 0 var(--ink))` }} viewBox="0 0 14 11" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="6" height="3" fill="#7d9a12" />
      <rect x="0" y="2" width="14" height="9" fill="#5d7410" />
      <rect x="1" y="3" width="12" height="7" fill="#c9de3a" />
      <rect x="1" y="3" width="12" height="1" fill="#eaf59a" />
      <rect x="1" y="9" width="12" height="1" fill="#a4bf22" />
    </svg>
  )
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="3" fill="#183e32" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="m6 9 3 3-3 3m6 0h5" stroke="#b9ef8b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

const BRAND_ICONS = {
  github: siGithub,
  firebase: siFirebase,
  xampp: siXampp,
  mysql: siMysql,
  mongodb: siMongodb,
  figma: siFigma,
  blender: siBlender,
}

const LANGUAGE_ICONS = {
  Python: siPython,
  PHP: siPhp,
  'C++': siCplusplus,
  JavaScript: siJavascript,
  HTML5: siHtml5,
  CSS3: siCss,
  TypeScript: siTypescript,
}

function SoftwareIcon({ icon }: { icon: string }) {
  const brand = BRAND_ICONS[icon as keyof typeof BRAND_ICONS]
  if (brand) {
    return (
      <span className={`software-logo logo-${icon}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d={brand.path} fill={`#${brand.hex}`} />
        </svg>
      </span>
    )
  }

  if (icon === 'vscode') {
    return (
      <span className="software-logo logo-vscode" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false"><path d="M17.6 2.2 9.1 10 4.8 6.7 2 8.2v7.6l2.8 1.5L9.1 14l8.5 7.8L22 20V4l-4.4-1.8ZM4.8 14.6v-5l3 2.5-3 2.5Zm5.8-2.5 7.8-6.4v12.8l-7.8-6.4Z" /></svg>
      </span>
    )
  }

  const initials = icon === 'illustrator' ? 'Ai' : icon === 'photoshop' ? 'Ps' : icon === 'ibispaint' ? 'ibis' : 'Canva'
  return <span className={`software-logo logo-${icon}`} aria-hidden="true">{initials}</span>
}

const TECH_ICONS = { ...LANGUAGE_ICONS, MySQL: siMysql }

function TechIcon({ name }: { name: string }) {
  const brand = TECH_ICONS[name as keyof typeof TECH_ICONS]
  const icon = name === 'C++' ? 'cplusplus' : name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  if (!brand) {
    const initials: Record<string, string> = {
      'Visual Basic': 'VB',
      SQL: 'SQL',
      'Machine Learning': 'ML',
      'Web & app Development': 'W/A',
    }
    return <span className={`software-logo logo-${icon}`} aria-hidden="true">{initials[name]}</span>
  }
  return (
    <span className={`software-logo logo-${icon}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={brand.path} fill={`#${brand.hex}`} />
      </svg>
    </span>
  )
}

/* ------------------------------ window frame ------------------------------ */
function Win(p: { title: string; z: number; min: boolean; closing: boolean; active: boolean; onFocus: () => void; onMin: () => void; onClose: () => void; children: ReactNode }) {
  return (
    <section className={`w${p.min ? ' min' : ''}${p.closing ? ' closing' : ''}${p.active ? ' active' : ''}`} style={{ zIndex: p.z }} aria-label={p.title} onPointerDown={p.onFocus}>
      <div className="titlebar">
        <span className="dot dot-green" aria-hidden="true" />
        <button type="button" className="dot dot-yellow" aria-label={`Minimize ${p.title}`} onClick={p.onMin} />
        <button type="button" className="dot dot-red" aria-label={`Close ${p.title}`} onClick={p.onClose} />
        <span className="pw-title">{p.title}</span>
      </div>
      <div className="w-body">{p.children}</div>
    </section>
  )
}

/* --------------------------------- content -------------------------------- */
function Profile() {
  return (
    <div className="about-profile">
      <header className="about-profile-hero">
        <div className="about-profile-copy">
          <span className="about-kicker">A LITTLE INTRODUCTION · 01</span>
          <h2>{D.PERSON.name}</h2>
          <p className="about-profile-identity">{D.PERSON.identity}</p>
          <span className="about-location"><span aria-hidden="true">⌖</span>{D.PERSON.location}</span>
        </div>
        <div className="about-profile-doodle" aria-hidden="true">
          <span className="about-profile-spark">✳</span>
          <img className="about-profile-photo" src={profilePhoto} alt="" />
          <span className="about-profile-caption">tech<br />&amp; art</span>
        </div>
      </header>
      <nav className="about-profile-links" aria-label="Profile links">
        <Act href={D.LINKS.resumePdf} dl label="Download resume" hint={NEED.resume} />
        <Act href={D.LINKS.github} alt label="GitHub" hint={NEED.github} />
        <Act href={D.LINKS.linkedin} alt label="LinkedIn" hint={NEED.linkedin} />
      </nav>
      <section className="about-facts-section" aria-labelledby="about-facts-title">
        <div className="about-section-heading">
          <span className="about-section-index" aria-hidden="true">A</span>
          <div><h3 id="about-facts-title">The little details</h3><p>A few notes from my school and creative life.</p></div>
        </div>
        <dl className="about-facts">
          {D.PERSON.details.map(([label, value]) => (
            <div className="about-fact" key={label}>
              <dt>{label}</dt><dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="about-story" aria-labelledby="about-story-title">
        <div className="about-section-heading">
          <span className="about-section-index about-story-index" aria-hidden="true">B</span>
          <div><h3 id="about-story-title">About Me</h3><p>A little context behind what I make.</p></div>
        </div>
        <div className="about-story-copy">
          {D.PERSON.intro.map((paragraph, index) => (
            <p key={paragraph}><span aria-hidden="true">0{index + 1}</span>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  )
}
const Journey = () => (
  <div className="about-journey">
    <header className="about-subpage-hero">
      <span className="about-kicker">NOTES FROM THE NEXT PAGE · 02</span>
      <h2>Growing, one project at a time.</h2>
      <p>What I hope to contribute, the way I like to work, and a few things I’m curious about.</p>
    </header>
    <section className="about-objective">
      <span className="about-objective-margin" aria-hidden="true">↗</span>
      <div><span className="about-card-eyebrow">AIMING FOR</span><h3>A meaningful first step.</h3><p>{D.PERSON.objective}</p></div>
    </section>
    <div className="about-journey-grid">
      <section className="about-list-card">
        <div className="about-section-heading">
          <span className="about-section-index" aria-hidden="true">01</span>
          <div><h3>What I bring</h3><p>Things I value in the work.</p></div>
        </div>
        <ul className="about-bring-list">{D.PERSON.bring.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
      </section>
      <section className="about-exploring-card">
        <div className="about-section-heading">
          <span className="about-section-index about-exploring-index" aria-hidden="true">02</span>
          <div><h3>On my learning list</h3><p>Topics I’m exploring right now.</p></div>
        </div>
        <ul className="about-exploring-list">{D.PERSON.exploring.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </div>
  </div>
)
const Learning = () =>
  D.CERTS.length === 0 ? (
    <div className="about-learning">
      <header className="about-subpage-hero about-learning-hero">
        <span className="about-kicker">A WORK IN PROGRESS · 03</span>
        <h2>Still collecting new skills.</h2>
        <p>These are the subjects I’m spending time with as I grow as a developer and creative.</p>
      </header>
      <ul className="about-learning-list">
        {D.PERSON.exploring.map((item, index) => (
          <li key={item} style={{ '--learning-index': index } as CSSProperties}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item}
          </li>
        ))}
      </ul>
      <p className="about-learning-note">Courses and certifications will be added here when available.</p>
    </div>
  ) : (
    <ul className="pw-grid">
      {D.CERTS.map((c) => (
        <li key={c.title} className="card learning-card">
          {c.image && <img src={c.image} alt={`${c.title} certificate`} loading="lazy" />}
          <span className="about-card-eyebrow">{c.date}</span><b>{c.title}</b><span>{c.issuer}</span>
          {c.url && <a className="act alt" href={c.url} target="_blank" rel="noopener noreferrer">Verify credential ↗</a>}
        </li>
      ))}
    </ul>
  )

function SkillsSoftware() {
  return (
    <ul className="software-grid">
      {D.SOFTWARE.map((item) => (
        <li key={item.name} className="software-card">
          <SoftwareIcon icon={item.icon} />
          <span className="software-copy"><b>{item.name}</b><small>{item.use}</small></span>
        </li>
      ))}
    </ul>
  )
}

function SkillsTech() {
  return (
    <ul className="software-grid">
      {D.TECH['Tech Skills'].map((skill) => (
        <li key={skill.name} className="software-card">
          <TechIcon name={skill.name} />
          <span className="software-copy">
            <b>{skill.name}</b>
            {skill.level && <small>{skill.level}</small>}
          </span>
        </li>
      ))}
    </ul>
  )
}

function SkillGroup({ title, description, skills, kind }: { title: string; description: string; skills: string[]; kind: 'hard' | 'soft' }) {
  return (
    <section className={`skill-group skill-group-${kind}`} aria-labelledby={`skill-group-${kind}`}>
      <header className="skill-group-heading">
        <span className="skill-group-mark" aria-hidden="true">{kind === 'hard' ? '✳' : '✦'}</span>
        <div>
          <h3 id={`skill-group-${kind}`}>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="skill-count">{String(skills.length).padStart(2, '0')}</span>
      </header>
      <ol className="skill-list">
        {skills.map((skill, index) => (
          <li key={skill}>
            <span className="skill-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span>{skill}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function HardAndSoftSkills() {
  return (
    <div className="skills-overview">
      <header className="skills-intro">
        <h2>What I bring to the table</h2>
        <p>A focused mix of practical skills and thoughtful ways of working.</p>
      </header>
      <div className="skill-groups">
        <SkillGroup title="Hard skills" description="Things I can make and do" skills={D.HARD} kind="hard" />
        <SkillGroup title="Soft skills" description="How I think and work with others" skills={D.SOFT} kind="soft" />
      </div>
    </div>
  )
}

function CreativeSkills() {
  const disciplines = [
    { label: 'DRAW & TELL', motif: '✿', summary: 'Character ideas, illustration, and visual storytelling.' },
    { label: 'BUILD WORLDS', motif: '✧', summary: 'Game-inspired characters, assets, and environments.' },
    { label: 'MAKE A MARK', motif: '◈', summary: 'Logos, posters, identity, and graphic layouts.' },
    { label: 'DESIGN FOR PEOPLE', motif: '▧', summary: 'Interfaces, wireframes, and visual hierarchy.' },
  ]
  return (
    <div className="creative-skills">
      <header className="creative-skills-intro">
        <div className="creative-intro-copy">
          <span className="creative-eyebrow">ART STUDIO · FIELD NOTES</span>
          <h2>My Graphic Skills.</h2>
          <p>Illustration and design are a big part of how I think. Here are a few of the creative areas I enjoy exploring.</p>
          <span className="creative-intro-stamp">DRAW<br />· MAKE ·</span>
        </div>
        <div className="creative-hero-art" aria-hidden="true">
          <span className="creative-art-sun" />
          <span className="creative-art-orbit creative-art-orbit-one" />
          <span className="creative-art-orbit creative-art-orbit-two" />
          <span className="creative-art-pencil">✎</span>
          <span className="creative-art-spark creative-art-spark-one">✦</span>
          <span className="creative-art-spark creative-art-spark-two">✧</span>
          <span className="creative-art-caption">imagine<br />· create ·</span>
        </div>
      </header>
      <p className="creative-explore-note"><span aria-hidden="true">↳</span> Open a note to see the skills behind each area.</p>
      <div className="creative-skill-grid">
        {Object.entries(D.CREATIVE).map(([category, skills], index) => (
          <details className={`creative-skill-card creative-skill-card-${index + 1}`} key={category} open={index === 0}>
            <summary>
              <span className="creative-skill-motif" aria-hidden="true">{disciplines[index].motif}</span>
              <span className="creative-skill-heading">
                <span className="creative-skill-label">{disciplines[index].label}</span>
                <span className="creative-skill-title">{category}</span>
              </span>
              <span className="creative-skill-toggle" aria-hidden="true">+</span>
              <span className="creative-skill-index">{String(index + 1).padStart(2, '0')}</span>
            </summary>
            <p className="creative-skill-summary">{disciplines[index].summary}</p>
            <ul className="creative-skill-tags">
              {skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </details>
        ))}
      </div>
    </div>
  )
}

function Gallery() {
  const [f, setF] = useState<string>(D.ARTWORK_FILTERS[0])
  const [sel, setSel] = useState<D.Artwork | null>(null)
  const list = useMemo(() => D.ARTWORKS.filter((a) => f === 'All Works' || a.category === f), [f])
  const activeIndex = sel ? list.findIndex((artwork) => artwork.id === sel.id) : -1
  const selectAdjacent = useCallback((direction: -1 | 1) => {
    if (!list.length) return
    const start = activeIndex < 0 ? 0 : activeIndex
    setSel(list[(start + direction + list.length) % list.length])
  }, [activeIndex, list])

  useEffect(() => {
    if (!sel) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        setSel(null)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        selectAdjacent(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        selectAdjacent(-1)
      }
    }
    window.addEventListener('keydown', k, true)
    return () => window.removeEventListener('keydown', k, true)
  }, [sel, selectAdjacent])

  const galleryHeading = (
    <header className="art-gallery-intro">
      <div>
        <span className="art-gallery-kicker">ART STUDIO · GALLERY</span>
        <h2>A few things I’ve made.</h2>
        <p>Illustrations and graphic designs.</p>
      </div>
      <div className="art-gallery-count" aria-live="polite">
        <strong>{String(list.length).padStart(2, '0')}</strong>
        <span>{list.length === 1 ? 'PIECE' : 'PIECES'}<br />ON THE WALL</span>
        <i aria-hidden="true">✳</i>
      </div>
    </header>
  )

  return (
    <>
      {D.ARTWORKS.length === 0 ? (
        <div className="art-gallery-empty">
          <header className="art-gallery-heading">
            <span className="art-gallery-kicker">THE ART WALL · 01</span>
            <h2>A space for the things I make.</h2>
            <p>Illustration, game-inspired art, and graphic design all find a place here. The gallery is waiting for selected pieces.</p>
          </header>
          <div className="art-gallery-wall" aria-label="Gallery currently has no published artwork">
            <div className="art-wall-note">
              <span className="art-wall-spark" aria-hidden="true">✳</span>
              <span className="art-wall-title">A blank page<br />is a good start.</span>
              <span className="art-wall-caption">MORE TO COME</span>
            </div>
            <div className="art-wall-circle" aria-hidden="true"><span>✎</span></div>
            <div className="art-wall-line" aria-hidden="true" />
          </div>
          <div className="art-gallery-footer">
            <span>Things I like to make</span>
            <ul>
              {['Character art', 'Game-inspired visuals', 'Logos & posters', 'UI concepts'].map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      ) : list.length === 0 ? (
        <>
          {galleryHeading}
          <div className="pw-tabs" role="group" aria-label="Filter artwork">
            {D.ARTWORK_FILTERS.map((k) => <button key={k} type="button" className="pw-tab" aria-pressed={f === k} onClick={() => setF(k)}>{k}</button>)}
          </div>
          <Empty>No pieces in this section just yet. Try another filter.</Empty>
        </>
      ) : (
        <>
          {galleryHeading}
          <div className="pw-tabs" role="group" aria-label="Filter artwork">
            {D.ARTWORK_FILTERS.map((k) => <button key={k} type="button" className="pw-tab" aria-pressed={f === k} onClick={() => setF(k)}>{k}</button>)}
          </div>
          <ul className="pw-grid art-gallery-grid">
            {list.map((a, index) => (
              <li key={a.id} className={`card art${a.galleryImages ? ' art-bundle-card' : ''}`} style={{ '--art-index': index } as CSSProperties}>
                <button
                  type="button"
                  className="art-preview"
                  aria-label={`Open artwork: ${a.alt}`}
                  onClick={() => setSel(a)}
                >
                  <img src={a.src} alt={a.alt} loading="lazy" />
                </button>
                <div className="art-card-caption">
                  <small>{a.category}{a.origin ? ` · ${a.origin}` : ''}</small>
                  <span aria-hidden="true">OPEN ↗</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {sel && createPortal(
        <div className="lb artwork-lightbox" role="dialog" aria-modal="true" aria-label={sel.alt} onClick={() => setSel(null)}>
          <div className={`lb-box artwork-viewer${sel.galleryImages ? ' artwork-bundle-viewer' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="artwork-viewer-top">
              <span><i aria-hidden="true">✳</i> {sel.category}</span>
              <span className="artwork-viewer-count">{String(activeIndex + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
              <button type="button" className="artwork-viewer-close" autoFocus aria-label="Close artwork viewer" onClick={() => setSel(null)}>×</button>
            </div>
            {sel.galleryImages ? (
              <div className="artwork-bundle-images">
                {sel.galleryImages.map((image, index) => (
                  <figure key={image.src}>
                    <img src={image.src} alt={image.alt} />
                    <figcaption>{String(index + 1).padStart(2, '0')} <span>/ 06</span></figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="artwork-single-stage">
                <img src={sel.src} alt={sel.alt} />
              </div>
            )}
            {!sel.imageOnly && <p className="artwork-viewer-description">{sel.description}</p>}
            <div className="artwork-viewer-bottom">
              <button type="button" className="artwork-step" onClick={() => selectAdjacent(-1)} disabled={list.length < 2}>← Previous</button>
              <span>Use ← → keys to browse</span>
              <button type="button" className="artwork-step" onClick={() => selectAdjacent(1)} disabled={list.length < 2}>Next →</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

function Freelance({ home }: { home: () => void }) {
  const tools = D.SOFTWARE.filter((s) => ['Figma', 'Canva', 'ibis Paint X', 'Adobe Illustrator', 'Adobe Photoshop', 'Blender'].includes(s.name))
  return (
    <div className="art-commissions">
      <header className="art-commission-hero">
        <span className="art-gallery-kicker">CREATIVE WORK · 02</span>
        <h2>I also take Commissions !!</h2>
        <p>I take on creative work in illustration and graphic design. 5 years of experience in free-lancing.</p>
        <span className="art-commission-doodle" aria-hidden="true">✎</span>
      </header>
      <section className="art-services" aria-labelledby="art-services-heading">
        <div className="art-subheading">
          <span aria-hidden="true">01</span>
          <div><h3 id="art-services-heading">Areas I work in</h3><p>Creative services listed in my portfolio.</p></div>
        </div>
        <ul className="art-services-list">
          {D.SERVICES.map((service, index) => (
            <li key={service} style={{ '--service-index': index } as CSSProperties}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{service}
            </li>
          ))}
        </ul>
      </section>
      <section className="art-tools-section" aria-labelledby="art-tools-heading">
        <div className="art-subheading">
          <span className="art-subheading-mark" aria-hidden="true">✳</span>
          <div><h3 id="art-tools-heading">On my desk</h3><p>Tools I use for visual work.</p></div>
        </div>
        <ul className="art-tool-list">
          {tools.map((tool, index) => (
            <li key={tool.name} style={{ '--tool-index': index } as CSSProperties}>
              <SoftwareIcon icon={tool.icon} />
              <span>{tool.name}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="pw-links">
        <Act href={D.LINKS.koFi} alt label="Commission details on Ko-fi ↗" hint="" />
        <Act href={mail('Commission inquiry')} label="Commission inquiry" hint={NEED.email} />
        <button type="button" className="act alt" onClick={home}>Back to main portfolio</button>
      </div>
    </div>
  )
}

function Contact() {
  return (
    <div className="contact-page">
      <header className="contact-intro">
        <div className="contact-intro-copy">
          <span className="contact-eyebrow"><i aria-hidden="true" /> CONTACT / SAY HELLO</span>
          <h2>My inbox is open.</h2>
          <p>Have an internship lead, a design question, or just want to chat? Send me a note.</p>
          <a className="contact-email" href={mail('Hello, Erica!')} aria-label={`Email ${D.LINKS.email}`}>
            <span aria-hidden="true">✉</span><span>{D.LINKS.email}</span><span className="contact-email-arrow" aria-hidden="true">↗</span>
          </a>
          <span className="contact-response-note">Email is the easiest way to reach me.</span>
        </div>
        <div className="contact-art" aria-hidden="true">
          <span className="contact-art-sun" />
          <span className="contact-art-orbit" />
          <span className="contact-art-envelope"><span>✉</span></span>
          <span className="contact-art-spark contact-art-spark-one">✦</span>
          <span className="contact-art-spark contact-art-spark-two">✧</span>
          <span className="contact-location"><span>⌖</span>{D.PERSON.location}</span>
        </div>
      </header>

      <div className="contact-grid">
        <section className="contact-note contact-note-career">
          <div className="contact-note-heading">
            <span className="contact-note-number">01</span>
            <div><span className="contact-card-label">CAREER</span><h3>Internships &amp; IT</h3></div>
          </div>
          <p>I’m a fourth-year BSIT student looking for an internship where I can learn, contribute, and get more hands-on experience.</p>
          <div className="contact-actions">
            <Act href={mail('Internship inquiry')} label="Ask about my internship" hint={NEED.email} />
            <Act href={D.LINKS.resumePdf} dl alt label="View my resume" hint={NEED.resume} />
          </div>
        </section>

        <section className="contact-note contact-note-creative">
          <div className="contact-note-heading">
            <span className="contact-note-number">02</span>
            <div><span className="contact-card-label">CREATIVE WORK</span><h3>Illustration &amp; design</h3></div>
          </div>
          <p>Need an illustration, poster, logo, or other visual? Tell me a little about what you have in mind.</p>
          <div className="contact-actions">
            <Act href={mail('Creative work inquiry')} label="Ask about a project" hint={NEED.email} />
            <Act href={D.LINKS.koFi} alt label="Find me on Ko-fi" hint="" />
          </div>
        </section>
      </div>

      <section className="contact-social">
        <div className="contact-social-copy">
          <span className="contact-card-label">ELSEWHERE</span>
          <h3>Find me around the web.</h3>
          <p>My work, updates, and occasional art live here.</p>
        </div>
        <div className="contact-actions">
          <Act href={D.LINKS.github} alt label="GitHub" hint={NEED.github} />
          <Act href={D.LINKS.linkedin} alt label="LinkedIn" hint={NEED.linkedin} />
          <Act href={D.LINKS.instagram} alt label="Instagram · @shlly.i" hint={NEED.instagram} />
        </div>
      </section>

      {!D.LINKS.email && <p className="contact-note">Contact links aren’t set up yet. Add your email and profile URLs in <code>LINKS</code> in src/data/portfolio.ts.</p>}
    </div>
  )
}

/* --------------------------------- desktop -------------------------------- */
type Props = { show: boolean; wallpaperOnly: boolean; spark: (e: MouseEvent<HTMLElement>) => void; onWelcome: (e: MouseEvent<HTMLElement>) => void }

export default function Desktop({ show, wallpaperOnly, spark, onWelcome }: Props) {
  const ids = FOLDERS.map((f) => f.id)
  const [wins, setWins] = useState(() =>
    Object.fromEntries(ids.map((i) => [i, { open: false, min: false, seen: false, closing: false, z: 20, tab: TABS[i]?.[0] ?? '' }])) as Record<Id, W>,
  )
  const [heroExpanded, setHeroExpanded] = useState(false)
  const [now, setNow] = useState(new Date())
  const z = useRef(20)
  const closeTimers = useRef<Partial<Record<Id, number>>>({})
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  useEffect(() => () => Object.values(closeTimers.current).forEach((timer) => window.clearTimeout(timer)), [])

  const patch = (id: Id, p: Partial<W>) => setWins((w) => ({ ...w, [id]: { ...w[id], ...p } }))
  const open = (id: Id, tab?: string) => {
    const timer = closeTimers.current[id]
    if (timer) window.clearTimeout(timer)
    delete closeTimers.current[id]
    z.current += 1
    patch(id, { open: true, min: false, seen: true, closing: false, z: z.current, ...(tab ? { tab } : {}) })
  }
  const close = useCallback((id: Id) => {
    const timer = closeTimers.current[id]
    if (timer) window.clearTimeout(timer)
    setWins((current) => ({ ...current, [id]: { ...current[id], open: false, min: false, closing: true } }))
    closeTimers.current[id] = window.setTimeout(() => {
      setWins((current) => ({ ...current, [id]: { ...current[id], closing: false } }))
      delete closeTimers.current[id]
    }, 420)
  }, [])
  const focus = (id: Id) => { z.current += 1; patch(id, { z: z.current }) }
  const home = () => setWins((w) => Object.fromEntries(ids.map((i) => [i, { ...w[i], min: true }])) as Record<Id, W>)
  const top = useMemo(() => ids.filter((i) => wins[i].open && !wins[i].min).sort((a, b) => wins[b].z - wins[a].z)[0], [wins]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!show) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && top && top !== 'projects') close(top) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [show, top, close])

  const go = (id: Id, tab?: string, e?: MouseEvent<HTMLElement>) => {
    if (e) spark(e)
    open(id, tab)
  }

  const body = (id: Id, tab: string): ReactNode => {
    if (id === 'about') return tab === 'Journey' ? <Journey /> : tab === 'Learning' ? <Learning /> : <Profile />
    if (id === 'art') return tab === 'Gallery' ? <Gallery /> : tab === 'Freelance' ? <Freelance home={home} /> : <CreativeSkills />
    if (id === 'terminal') return <TerminalWindow onOpen={(target) => open(target)} />
    if (id === 'skills') {
      if (tab === 'Tech Skills') return <SkillsTech />
      if (tab === 'Tools & Software') return <SkillsSoftware />
      if (tab === 'Skills') return <HardAndSoftSkills />
      return (
        <>
          <ul className="pw-tags big">{D.TECH[tab].map((s) => <li key={s.name}>{s.name}{s.level && <b> {s.level}</b>}</li>)}</ul>
        </>
      )
    }
    return <Contact />
  }
  const hasVisibleWindow = ids.some((id) => (wins[id].open && !wins[id].min) || wins[id].closing)

  return (
    <div className={`dsk${show ? ' on' : ''}${hasVisibleWindow ? ' has-window' : ''}${wallpaperOnly ? ' wallpaper-only' : ''}`} aria-hidden={!show || wallpaperOnly}>
      <div className="icons">
        {FOLDERS.map((f) => (
          <button key={f.id} type="button" className="reopen" onClick={(e) => go(f.id, undefined, e)} aria-label={`Open ${f.label}`}>
            {f.id === 'terminal' ? <TerminalIcon className="reopen-icon terminal-icon" /> : <FolderIcon hue={f.hue} className="reopen-icon" />}
            <span className="reopen-label">{f.label}</span>
          </button>
        ))}
      </div>

      <aside className={`hero${heroExpanded ? '' : ' is-collapsed'}`} aria-label="Introduction">
        {D.STATUS.show && <p className="pill"><i aria-hidden="true" />{D.STATUS.label}</p>}
        <div className="hero-topline">
          <span className="hero-kicker"><i aria-hidden="true">✦</i> PORTFOLIO / 2026</span>
          <span className="hero-card-number">01</span>
        </div>
        <div className="hero-heading">
          <span className="hero-avatar">
            <img src={portfolioLogo} alt="" />
          </span>
          <h2>{D.PERSON.name}</h2>
        </div>
        <button
          type="button"
          className="hero-toggle"
          aria-expanded={heroExpanded}
          aria-controls="hero-details"
          onClick={() => setHeroExpanded((expanded) => !expanded)}
        >
          <span>{heroExpanded ? 'Close details' : 'Open for more details'}</span>
          <span className="hero-toggle-icon" aria-hidden="true">{heroExpanded ? '−' : '↗'}</span>
        </button>
        <div className="hero-details" id="hero-details" aria-hidden={!heroExpanded} inert={!heroExpanded}>
          <div className="hero-details-inner">
            <p className="ident">{D.PERSON.identity}</p>
            <p className="loc">{D.PERSON.location}</p>
            <div className="more">
              <p>{D.PERSON.tagline}</p>
              <div className="pw-links">
                <button type="button" className="act" onClick={(e) => go('projects', undefined, e)}>View My Projects</button>
                <button type="button" className="act" onClick={(e) => go('art', 'Gallery', e)}>Explore My Artwork</button>
                <Act href={D.LINKS.resumePdf} dl alt label="Download My Resume" hint={NEED.resume} />
                <button type="button" className="act alt" onClick={(e) => go('contact', undefined, e)}>Contact Me</button>
                <Act href={D.LINKS.github} alt label="View GitHub" hint={NEED.github} />
                <Act href={D.LINKS.linkedin} alt label="Connect on LinkedIn" hint={NEED.linkedin} />
                <Act href={D.LINKS.instagram} alt label="Instagram @shlly.i" hint={NEED.instagram} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {FOLDERS.map((f) => {
        const w = wins[f.id]
        if (f.id === 'projects')
          return <ProjectsWindow key={f.id} zIndex={w.z} status={!w.seen ? 'idle' : w.open && !w.min ? 'open' : 'closed'} onClose={() => close('projects')} />
        if (!w.open && !w.closing) return null
        const tabs = TABS[f.id]
        return (
          <Win key={f.id} title={TITLES[f.id]} z={w.z} min={w.min} closing={w.closing} active={top === f.id} onFocus={() => focus(f.id)}
            onMin={() => patch(f.id, { min: true })} onClose={() => close(f.id)}>
            {tabs && (
              <div className="pw-tabs" role="group" aria-label={`${TITLES[f.id]} sections`}>
                {tabs.map((t) => <button key={t} type="button" className="pw-tab" aria-pressed={w.tab === t} onClick={() => patch(f.id, { tab: t })}>{t}</button>)}
              </div>
            )}
            {body(f.id, w.tab)}
          </Win>
        )
      })}

      <footer className="tb">
        <button type="button" className="tb-welcome" onClick={onWelcome} aria-label="Open welcome window" title="Welcome">
          <span className="tb-welcome-icon" aria-hidden="true">✦</span>
          <span className="tb-welcome-label">welcome.exe</span>
        </button>
        <nav className="tb-nav" aria-label="Portfolio navigation">
          {FOLDERS.map(({ id, label, hue }) => (
            <button
              key={id}
              type="button"
              aria-label={`Open ${label}`}
              title={label}
              aria-current={top === id ? 'true' : undefined}
              onClick={(e) => {
                spark(e)
                if (top === id) {
                  patch(id, { min: true })
                } else {
                  open(id)
                }
              }}
            >
              {id === 'terminal' ? <TerminalIcon className="tb-folder-icon terminal-icon" /> : <FolderIcon hue={hue} className="tb-folder-icon" />}
            </button>
          ))}
        </nav>
        <div className="tb-status" aria-label="System status">
          <span className="tb-status-mark" aria-hidden="true">●</span>
          <time className="tb-clock" dateTime={now.toISOString()}>
            <span>{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
            <span>{now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
          </time>
        </div>
      </footer>
    </div>
  )
}