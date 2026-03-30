import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'strike', 'del',
  'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'code', 'pre', 'span', 'div', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class', 'colspan', 'rowspan']

function looksLikeHtml(s: string): boolean {
  return /^<[a-z][\s\S]*>/i.test(s.trim())
}

export function useRichText() {
  function toSanitizedRichHtml(raw: string | null | undefined): string {
    if (raw == null || typeof raw !== 'string') return ''
    const trimmed = raw.trim()
    if (!trimmed) return ''

    let html: string
    if (looksLikeHtml(trimmed)) {
      html = raw
    }
    else {
      html = marked.parse(raw, { async: false }) as string
    }

    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    })
  }

  /** Extrait texte pour meta description (aperçu sans balises ni bruit markdown). */
  function toPlainTextExcerpt(raw: string | null | undefined, maxLen: number): string {
    if (raw == null || typeof raw !== 'string') return ''
    const plain = raw
      .replace(/<[^>]*>/g, ' ')
      .replace(/[#*_`[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return plain.slice(0, maxLen)
  }

  return { toSanitizedRichHtml, toPlainTextExcerpt }
}
