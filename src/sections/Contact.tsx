import { useRef, useState } from 'react'
import { useLanguage } from '../i18n/context'
import { asset } from '../lib/asset'
import './Contact.css'

export function Contact() {
  const { t } = useLanguage()
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const emailRef = useRef<HTMLAnchorElement>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(t.contact.email)
      setStatus('copied')
    } catch {
      const el = emailRef.current
      if (el) window.getSelection()?.selectAllChildren(el)
      setStatus('failed')
    }
    window.setTimeout(() => setStatus('idle'), 2500)
  }

  return (
    <section id="contato" className="section contact" aria-labelledby="contato-titulo">
      <div className="container contact__inner">
        <h2 id="contato-titulo" className="section__title">{t.contact.title}</h2>
        <p className="contact__text">{t.contact.text}</p>

        <div className="contact__email-row">
          <a ref={emailRef} className="contact__email" href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          <button type="button" className="button button--ghost" onClick={copy}>
            {status === 'copied' ? t.ui.copied : t.ui.copy}
          </button>
          <span className="visually-hidden" role="status">
            {status === 'copied' ? t.ui.copied : status === 'failed' ? t.ui.copyFailed : ''}
          </span>
        </div>

        <ul className="contact__links">
          {t.contact.links.map((l) => (
            <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>
          ))}
          <li><a href={asset(t.contact.cv.href)} download>{t.contact.cv.label}</a></li>
        </ul>
      </div>
    </section>
  )
}
