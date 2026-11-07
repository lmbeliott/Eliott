// Rendu Markdown des énoncés écrits par la communauté : même balisage que les énoncés officiels
// (scripts/build-content.mjs), sans coloration syntaxique, et nettoyé par DOMPurify
// puisque le texte vient d'autres utilisateurs.
import { Marked } from 'marked'
import DOMPurify from 'dompurify'

const LANGS: Record<string, string> = { py: 'python', python: 'python', cpp: 'cpp', 'c++': 'cpp', c: 'cpp' }
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const marked = new Marked({ gfm: true, breaks: false })
marked.use({
  renderer: {
    code({ text, lang }) {
      const l = LANGS[(lang ?? '').trim().toLowerCase()] ?? 'text'
      return `<pre data-lang="${l}"><code class="hljs">${escape(text)}</code></pre>\n`
    },
    // Pas d'images distantes : elles permettraient de suivre qui ouvre l'énoncé.
    image({ text }) {
      return escape(text)
    },
    html({ text }) {
      return escape(text)
    },
  },
})

export function renderMarkdown(src: string): string {
  const html = marked.parse(src.trim(), { async: false }) as string
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'em', 'strong', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote', 'a', 'h3', 'h4', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr', 'del', 'sub', 'sup'],
    ALLOWED_ATTR: ['href', 'data-lang', 'class', 'align'],
    ALLOWED_URI_REGEXP: /^https?:\/\//i,
  }).replace(/<a /g, '<a rel="noopener noreferrer nofollow" target="_blank" ')
}
