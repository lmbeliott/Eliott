// Le parcours dessiné comme un profil de randonnée : chaque chapitre est une étape,
// placée à l'altitude cumulée de ses problèmes. Les pistes noires grimpent raide.
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { chapters, chapterTitle, levelTitle, levels, problemById, SLOPE_LABEL, type Slope } from '../lib/content'
import { formatAltitude, useI18n } from '../lib/i18n'
import { SUMMITS, summitName } from '../lib/summits'

const SLOPE_VAR: Record<Slope, string> = { verte: 'var(--verte)', bleue: 'var(--bleue)', rouge: 'var(--rouge)', noire: 'var(--noire)' }

interface Props {
  solved?: Set<string>
  /** Affiche « tu es ici » sur le premier chapitre non terminé */
  showHere?: boolean
  animate?: boolean
  className?: string
}

const W = 1000
const H = 300
const PAD = { l: 18, r: 18, t: 28, b: 54 }

// Petit relief déterministe entre deux étapes.
const jitter = (i: number, k: number) => Math.sin(i * 12.9898 + k * 78.233) * 0.5 + Math.cos(i * 3.1 + k) * 0.25

export function ElevationProfile({ solved = new Set(), showHere = true, animate = false, className }: Props) {
  const { lang, t } = useI18n()
  const navigate = useNavigate()

  const geo = useMemo(() => {
    let alt = 0
    const pts = chapters.map((c) => {
      const gain = c.problems.reduce((a, id) => a + (problemById(id)?.xp ?? 0), 0)
      alt += gain
      return { c, alt, gain }
    })
    const total = Math.max(alt, 1)
    const top = Math.max(total, ...SUMMITS.filter((s) => s.meters <= total * 1.05).map((s) => s.meters))
    const x = (i: number) => PAD.l + ((i + 0.5) / chapters.length) * (W - PAD.l - PAD.r)
    const y = (m: number) => H - PAD.b - (m / top) * (H - PAD.t - PAD.b)
    // Ligne de crête : départ au camp de base, deux bosses entre chaque étape.
    let d = `M ${PAD.l} ${y(0)}`
    let prev = { x: PAD.l, m: 0 }
    pts.forEach((p, i) => {
      const nx = x(i)
      for (const k of [1, 2]) {
        const fx = prev.x + ((nx - prev.x) * k) / 3
        const fm = prev.m + ((p.alt - prev.m) * k) / 3 + jitter(i, k) * Math.max(80, (p.alt - prev.m) * 0.35)
        d += ` L ${fx.toFixed(1)} ${y(Math.max(0, fm)).toFixed(1)}`
      }
      d += ` L ${nx.toFixed(1)} ${y(p.alt).toFixed(1)}`
      prev = { x: nx, m: p.alt }
    })
    const area = `${d} L ${prev.x} ${H - PAD.b} L ${PAD.l} ${H - PAD.b} Z`
    return { pts, total, top, x, y, d, area }
  }, [])

  const status = geo.pts.map(({ c }) => {
    const n = c.problems.length
    const done = c.problems.filter((id) => solved.has(id)).length
    return { n, done, complete: n > 0 && done === n }
  })
  const hereIdx = showHere ? status.findIndex((s) => !s.complete) : -1

  // Bandes de niveaux sous l'axe
  const bands = levels.map((l) => {
    const idx = chapters.map((c, i) => (c.level.id === l.id ? i : -1)).filter((i) => i >= 0)
    const x0 = geo.x(idx[0]) - (W - PAD.l - PAD.r) / chapters.length / 2
    const x1 = geo.x(idx[idx.length - 1]) + (W - PAD.l - PAD.r) / chapters.length / 2
    return { l, x0, x1 }
  })

  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="group" aria-label={t('Profil du parcours, du camp de base au sommet', 'Path profile, from base camp to summit')}>
        {/* Sommets de référence */}
        {SUMMITS.filter((s) => s.meters <= geo.top).map((s) => (
          <g key={s.name} aria-hidden>
            <line x1={PAD.l} x2={W - PAD.r} y1={geo.y(s.meters)} y2={geo.y(s.meters)} stroke="var(--line-strong)" strokeDasharray="2 5" />
            <text x={PAD.l} y={geo.y(s.meters) - 5} fontSize="11" fill="var(--muted)">
              <tspan fill="var(--ink-2)">{summitName(lang, s)}</tspan> {formatAltitude(lang, s.meters)}
            </text>
          </g>
        ))}
        <path d={geo.area} fill="var(--surface-2)" aria-hidden />
        <path
          d={geo.d}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinejoin="round"
          className={animate ? 'anim-draw' : undefined}
          style={animate ? ({ '--len': 2600 } as React.CSSProperties) : undefined}
          aria-hidden
        />
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--line-strong)" aria-hidden />

        {/* Bandes de pistes */}
        {bands.map(({ l, x0, x1 }) => (
          <g key={l.id} aria-hidden>
            <rect x={x0 + 2} y={H - PAD.b + 10} width={x1 - x0 - 4} height="3" rx="1.5" fill={SLOPE_VAR[l.slope]} />
            <text x={x0 + 2} y={H - PAD.b + 30} fontSize="12.5" fontWeight="600" fill="var(--ink)">
              {SLOPE_LABEL[l.slope][lang]}
            </text>
            <text x={x0 + 2} y={H - PAD.b + 46} fontSize="11.5" fill="var(--muted)">
              {levelTitle(lang, l)}
            </text>
          </g>
        ))}

        {/* Étapes */}
        {geo.pts.map(({ c }, i) => {
          const s = status[i]
          const cx = geo.x(i)
          const cy = geo.y(geo.pts[i].alt)
          const color = SLOPE_VAR[c.level.slope]
          const label = `${chapterTitle(lang, c)} — ${s.done}/${s.n} ${t('résolus', 'solved')}`
          return (
            <g
              key={c.id}
              role="link"
              tabIndex={0}
              aria-label={label}
              onClick={() => navigate(`/parcours/${c.id}`)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), navigate(`/parcours/${c.id}`))}
              className="cursor-pointer outline-none [&:focus-visible_circle.ring]:stroke-[var(--focus)] [&:hover_circle.ring]:stroke-[var(--ink)]"
            >
              <title>{label}</title>
              <circle cx={cx} cy={cy} r="14" fill="transparent" />
              <circle className="ring" cx={cx} cy={cy} r="9" fill="var(--surface)" stroke="transparent" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="6" fill={s.complete ? color : 'var(--surface)'} stroke={color} strokeWidth="2.5" />
              {s.done > 0 && !s.complete && <path d={`M ${cx} ${cy - 6} A 6 6 0 0 1 ${cx} ${cy + 6} Z`} fill={color} />}
            </g>
          )
        })}

        {/* Tu es ici */}
        {hereIdx >= 0 && (
          <g aria-hidden>
            <circle cx={geo.x(hereIdx)} cy={geo.y(geo.pts[hereIdx].alt)} r="8" fill="var(--signal)" className="anim-pulse" opacity="0.6" />
            <g transform={`translate(${geo.x(hereIdx)}, ${geo.y(geo.pts[hereIdx].alt) - 16})`}>
              <rect x="-38" y="-22" width="76" height="20" rx="3" fill="var(--signal)" />
              <path d="M -5 -2 L 0 4 L 5 -2 Z" fill="var(--signal)" />
              <text x="0" y="-8" textAnchor="middle" fontSize="11.5" fontWeight="650" fill="var(--signal-ink)">
                {t('Tu es ici', 'You are here')}
              </text>
            </g>
          </g>
        )}
      </svg>
      <figcaption className="sr-only">
        {t(
          `Le parcours compte ${chapters.length} chapitres répartis sur 4 pistes ; tout terminer fait monter à ${formatAltitude(lang, geo.total)}.`,
          `The path has ${chapters.length} chapters over 4 runs; finishing everything takes you up to ${formatAltitude(lang, geo.total)}.`,
        )}
      </figcaption>
    </figure>
  )
}
