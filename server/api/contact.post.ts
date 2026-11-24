import { defineEventHandler, readBody, createError } from 'h3'
import { Resend } from 'resend'

interface ContactPayload {
  motif?: string
  name?: string
  email?: string
  message?: string
  company?: string
  capacity?: string
  talkTitle?: string
  talkFormat?: string
  website?: string // Honeypot field
}

const MOTIF_LABELS: Record<string, string> = {
  general: 'Questions générales',
  questions: 'Questions générales',
  sponsoring: 'Devenir partenaire',
  speaker: 'Proposer un talk',
  host: 'Proposer un lieu',
}

const TALK_FORMAT_LABELS: Record<string, string> = {
  full: 'Talk complet (25-30 min)',
  lightning: 'Lightning talk (10-15 min)',
  other: 'Autre / À définir',
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactPayload>(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Requête invalide.',
      message: 'Requête invalide.',
    })
  }

  // 1. Anti-spam honeypot
  // Si le champ caché 'website' est rempli, on rejette silencieusement avec un 200 (faux succès)
  if (body.website && String(body.website).trim().length > 0) {
    return {
      success: true,
      message: 'Message reçu.',
    }
  }

  // 2. Extraction et assainissement des champs
  const motifKey = String(body.motif || 'general').trim().toLowerCase()
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const message = String(body.message || '').trim()
  const company = body.company ? String(body.company).trim() : ''
  const capacity = body.capacity ? String(body.capacity).trim() : ''
  const talkTitle = body.talkTitle ? String(body.talkTitle).trim() : ''
  const talkFormat = body.talkFormat ? String(body.talkFormat).trim() : ''

  // 3. Validation des champs requis
  if (!name || name.length < 2 || name.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom est requis (entre 2 et 100 caractères).',
      message: 'Le nom est requis (entre 2 et 100 caractères).',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email) || email.length > 200) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Une adresse courriel valide est requise.',
      message: 'Une adresse courriel valide est requise.',
    })
  }

  if (!message || message.length < 5 || message.length > 5000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le message est requis (entre 5 et 5000 caractères).',
      message: 'Le message est requis (entre 5 et 5000 caractères).',
    })
  }

  const motifLabel = MOTIF_LABELS[motifKey] || 'Contact'
  const talkFormatLabel = TALK_FORMAT_LABELS[talkFormat] || talkFormat

  // 4. Récupération des variables de configuration serveur
  const config = useRuntimeConfig(event)
  const apiKey = (config.resendApiKey as string) || process.env.RESEND_API_KEY
  const toEmail = (config.contactToEmail as string) || process.env.CONTACT_TO_EMAIL
  const fromEmail = (config.contactFromEmail as string) || process.env.CONTACT_FROM_EMAIL || 'Vue Montreal <onboarding@resend.dev>'

  if (!apiKey || !toEmail) {
    console.error('[API Contact] Configuration manquante : RESEND_API_KEY ou CONTACT_TO_EMAIL non défini.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Le service de contact n\'est pas encore configuré. Veuillez réessayer ultérieurement.',
      message: 'Le service de contact n\'est pas encore configuré. Veuillez réessayer ultérieurement.',
    })
  }

  // 5. Construction du corps du courriel (Texte brut et HTML)
  const textLines: string[] = [
    `Nouveau message depuis le formulaire de contact Vue Montreal`,
    `=============================================================`,
    ``,
    `Motif : ${motifLabel}`,
    `Nom : ${name}`,
    `Courriel : ${email}`,
  ]

  if (company) {
    textLines.push(`Entreprise / Organisation : ${company}`)
  }
  if (capacity) {
    textLines.push(`Capacité d'accueil : ${capacity}`)
  }
  if (talkTitle) {
    textLines.push(`Titre du talk : ${talkTitle}`)
  }
  if (talkFormatLabel) {
    textLines.push(`Format souhaité : ${talkFormatLabel}`)
  }

  textLines.push(``)
  textLines.push(`Message :`)
  textLines.push(`---------`)
  textLines.push(message)
  textLines.push(``)
  textLines.push(`=============================================================`)
  textLines.push(`Envoyé depuis le site vuemontreal.org`)

  const textBody = textLines.join('\n')

  const escapedName = escapeHtml(name)
  const escapedEmail = escapeHtml(email)
  const escapedMotif = escapeHtml(motifLabel)
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>')
  const escapedCompany = company ? escapeHtml(company) : ''
  const escapedCapacity = capacity ? escapeHtml(capacity) : ''
  const escapedTalkTitle = talkTitle ? escapeHtml(talkTitle) : ''
  const escapedTalkFormat = talkFormatLabel ? escapeHtml(talkFormatLabel) : ''

  const htmlBody = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #42b883; background: linear-gradient(135deg, #42b883 0%, #35495e 100%); padding: 24px; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 14px; opacity: 0.9; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; }
    .content { padding: 24px; }
    .field-group { margin-bottom: 20px; }
    .field-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #09090b; }
    .field-value a { color: #42b883; text-decoration: none; }
    .field-value a:hover { text-decoration: underline; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 15px; line-height: 1.6; color: #1e293b; margin-top: 8px; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Nouveau message de contact</h1>
      <p>Communauté Vue Montreal</p>
      <div class="badge">${escapedMotif}</div>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="field-label">Expéditeur</div>
        <div class="field-value"><strong>${escapedName}</strong> &lt;<a href="mailto:${escapedEmail}">${escapedEmail}</a>&gt;</div>
      </div>
      <div class="field-group">
        <div class="field-label">Motif</div>
        <div class="field-value">${escapedMotif}</div>
      </div>
      ${escapedCompany ? `
      <div class="field-group">
        <div class="field-label">Entreprise / Organisation</div>
        <div class="field-value">${escapedCompany}</div>
      </div>` : ''}
      ${escapedCapacity ? `
      <div class="field-group">
        <div class="field-label">Capacité d'accueil estimée</div>
        <div class="field-value">${escapedCapacity}</div>
      </div>` : ''}
      ${escapedTalkTitle ? `
      <div class="field-group">
        <div class="field-label">Titre du talk</div>
        <div class="field-value"><strong>${escapedTalkTitle}</strong></div>
      </div>` : ''}
      ${escapedTalkFormat ? `
      <div class="field-group">
        <div class="field-label">Format souhaité</div>
        <div class="field-value">${escapedTalkFormat}</div>
      </div>` : ''}
      <div class="field-group" style="margin-bottom: 0;">
        <div class="field-label">Message</div>
        <div class="message-box">${escapedMessage}</div>
      </div>
    </div>
    <div class="footer">
      Vous pouvez répondre directement à ce courriel pour contacter ${escapedName} (${escapedEmail}).
    </div>
  </div>
</body>
</html>
`.trim()

  // 6. Envoi via le SDK Resend
  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `[Vue Montreal] ${motifLabel} - ${name}`,
      text: textBody,
      html: htmlBody,
    })

    if (error) {
      console.error('[API Contact] Erreur Resend:', error)
      throw createError({
        statusCode: 502,
        statusMessage: error.message || 'Échec de l\'envoi du courriel via Resend.',
        message: error.message || 'Échec de l\'envoi du courriel via Resend.',
      })
    }

    return {
      success: true,
      id: data?.id,
    }
  } catch (err: any) {
    if (err.statusCode) {
      throw err
    }
    console.error('[API Contact] Exception inattendue:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Une erreur est survenue lors de l\'envoi de votre message.',
      message: 'Une erreur est survenue lors de l\'envoi de votre message.',
    })
  }
})
