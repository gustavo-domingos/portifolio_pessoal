import { useLanguage } from '../i18n/context'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>{t.footer.text}</p>
        <a href={t.footer.source.href} target="_blank" rel="noreferrer">{t.footer.source.label}</a>
      </div>
    </footer>
  )
}
