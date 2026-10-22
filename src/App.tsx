import { useCallback, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import landingBg from './assets/landing_bg.jpg'
import Desktop from './components/Desktop'
import './App.css'

const NAME = 'ERICA' // shown in the scrolling ticker; change to whatever you like
const WORDS = ['PORT', 'FOLIO']
const LETTER_COUNT = WORDS.join('').length
const WORD_STARTS = WORDS.map((_, i) => WORDS.slice(0, i).join('').length)

// colors a letter cycles through each time it is clicked
const PALETTE = ['#c32f35', '#f28a2e', '#9fbf1b', '#ee5d97', '#3f87d8']
const SPARK_COLORS = ['#f6c437', '#c32f35', '#f28a2e', '#ee5d97', '#3f87d8', '#c4de32']

type Vars = CSSProperties & Record<`--${string}`, string | number>

type Spark = {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  rot: number
  size: number
  color: string
}

const zeros = () => Array.from({ length: LETTER_COUNT }, () => 0)

/* 11 x 9 pixel cat face, drawn as SVG squares */
const CAT = [
  '.#.......#.',
  '###.....###',
  '#.#######.#',
  '#.........#',
  '#..##.##..#',
  '#....#....#',
  '#...#.#...#',
  '.#.......#.',
  '..#######..',
]

function PixelCat({ className = 'cat' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 11 9"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {CAT.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null,
        ),
      )}
    </svg>
  )
}

/* where a click happened (or the element's center if it came from the keyboard) */
function originOf(e: MouseEvent<HTMLElement>) {
  if (e.detail === 0) {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return { x: e.clientX, y: e.clientY }
}

function App() {
  const [open, setOpen] = useState(true) // true = intro window showing, false = desktop
  const [wallpaperOnly, setWallpaperOnly] = useState(false)
  const [playId, setPlayId] = useState(0) // bump to replay the title entrance
  const [colors, setColors] = useState<number[]>(zeros)
  const [pops, setPops] = useState<number[]>(zeros)
  const [sparks, setSparks] = useState<Spark[]>([])

  const nextId = useRef(0)
  const closeRef = useRef<HTMLButtonElement>(null)

  const burst = useCallback((x: number, y: number, count = 9) => {
    const made: Spark[] = Array.from({ length: count }, (_, k) => {
      const angle = (Math.PI * 2 * k) / count + Math.random() * 0.6
      const dist = 50 + Math.random() * 70
      return {
        id: nextId.current++,
        x,
        y,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: (Math.random() - 0.5) * 360,
        size: 14 + Math.random() * 16,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      }
    })
    setSparks((prev) => [...prev, ...made])
    window.setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !made.includes(s)))
    }, 1000)
  }, [])

  const popLetter = (i: number, e: MouseEvent<HTMLElement>) => {
    const { x, y } = originOf(e)
    setColors((prev) => prev.map((c, k) => (k === i ? (c + 1) % PALETTE.length : c)))
    setPops((prev) => prev.map((p, k) => (k === i ? p + 1 : p)))
    burst(x, y)
  }

  // pointer clicks are handled per letter; this covers Enter/Space on the title
  const sparkleAll = (e: MouseEvent<HTMLElement>) => {
    if (e.detail !== 0) return
    const { x, y } = originOf(e)
    setColors((prev) => prev.map((c) => (c + 1) % PALETTE.length))
    setPops((prev) => prev.map((p) => p + 1))
    burst(x, y, 14)
  }

  const closeWindow = (e: MouseEvent<HTMLElement>) => {
    const { x, y } = originOf(e)
    burst(x, y, 12)
    setOpen(false)
  }

  // reopens the intro window (used by welcome.exe on the taskbar)
  const reopenWindow = (e: MouseEvent<HTMLElement>) => {
    const { x, y } = originOf(e)
    burst(x, y, 12)
    setPops(zeros())
    setPlayId((n) => n + 1)
    setOpen(true)
    if (e.detail === 0) window.setTimeout(() => closeRef.current?.focus(), 60)
  }

  // ENTER PORTFOLIO: leave the intro and show the desktop
  const enterPortfolio = (e: MouseEvent<HTMLElement>) => {
    const { x, y } = originOf(e)
    burst(x, y, 16)
    setWallpaperOnly(false)
    setOpen(false)
  }

  // small sparkle used by desktop folders and buttons
  const spark = (e: MouseEvent<HTMLElement>) => {
    const { x, y } = originOf(e)
    burst(x, y, 10)
  }

  return (
    <>
      <main className={`stage ${open ? 'is-open' : 'is-closed'}${wallpaperOnly ? ' wallpaper-only' : ''}`}>
        <img
          className="bg"
          src={landingBg}
          alt="Illustrated collage of Erica holding a developer ID card. Illustrator and graphic designer, 2026."
        />

        <section
          className={`window ${open ? 'is-open' : 'is-closed'}`}
          aria-label="Portfolio welcome window"
          aria-hidden={!open}
        >
          <i className="star star-a" aria-hidden="true" />
          <i className="star star-b" aria-hidden="true" />
          <i className="star star-c" aria-hidden="true" />
          <i className="star star-d" aria-hidden="true" />

          <div className="titlebar">
            <span className="dot dot-green" aria-hidden="true" />
            <span className="dot dot-yellow" aria-hidden="true" />
            <button
              ref={closeRef}
              type="button"
              className="dot dot-red"
              aria-label="Close window"
              onClick={closeWindow}
            />
            <span className="window-title">welcome.exe</span>
          </div>

          <div className="sky">
            <div className="clouds" aria-hidden="true">
              <i className="cloud cloud-a" />
              <i className="cloud cloud-b" />
              <i className="cloud cloud-c" />
            </div>

            <div className="banner">
              <div className="cats" aria-hidden="true">
                <PixelCat />
                <PixelCat />
              </div>

              <h1 className="title" key={playId}>
                <button
                  type="button"
                  className="title-btn"
                  aria-label="Portfolio. Press for sparkles."
                  onClick={sparkleAll}
                >
                  {WORDS.map((word, w) => (
                    <span className="word" key={word}>
                      {[...word].map((ch, k) => {
                        const i = WORD_STARTS[w] + k
                        return (
                          <span
                            key={i}
                            className="letter"
                            style={{ '--i': i, color: PALETTE[colors[i]] } as Vars}
                            onClick={(e) => popLetter(i, e)}
                            aria-hidden="true"
                          >
                            <span
                              key={pops[i]}
                              className={pops[i] ? 'glyph is-pop' : 'glyph'}
                            >
                              {ch}
                            </span>
                          </span>
                        )
                      })}
                    </span>
                  ))}
                </button>
              </h1>

              <div className="cats" aria-hidden="true">
                <PixelCat />
                <PixelCat />
              </div>
            </div>

            <div className="landing-note">
              <span className="landing-note-pin" aria-hidden="true">EP</span>
              <div className="landing-note-copy">
                <span className="landing-note-kicker">HELLO, I’M</span>
                <strong>Erica Peque</strong>
                <span className="landing-note-role">BSIT student · frontend &amp; illustration</span>
              </div>
              <span className="landing-note-doodle" aria-hidden="true">✳</span>
            </div>

            <span className="sky-caption" aria-hidden="true">A MIX OF CODE AND ILLUSTRATION</span>
          </div>

          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {[0, 1].map((g) => (
                <div className="ticker-group" key={g}>
                  {Array.from({ length: 6 }, (_, n) => (
                    <span className="ticker-item" key={n}>
                      {NAME}
                      <PixelCat className="cat cat-sm" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="enter" onClick={enterPortfolio}>
            ENTER PORTFOLIO <span aria-hidden="true">▸</span>
          </button>
        </section>
      </main>

      {!open && (
        <button
          type="button"
          className="wallpaper-toggle"
          aria-label={wallpaperOnly ? 'Show desktop' : 'Show only the background'}
          aria-pressed={wallpaperOnly}
          title={wallpaperOnly ? 'Show desktop' : 'Show only the background'}
          onClick={() => setWallpaperOnly((only) => !only)}
        />
      )}
      <Desktop show={!open} wallpaperOnly={wallpaperOnly} spark={spark} onWelcome={reopenWindow} />

      <div className="sparks" aria-hidden="true">
        {sparks.map((s) => (
          <i
            key={s.id}
            className="spark"
            style={
              {
                '--x': `${s.x}px`,
                '--y': `${s.y}px`,
                '--dx': `${s.dx}px`,
                '--dy': `${s.dy}px`,
                '--rot': `${s.rot}deg`,
                '--size': `${s.size}px`,
                '--c': s.color,
              } as Vars
            }
          />
        ))}
      </div>
    </>
  )
}

export default App