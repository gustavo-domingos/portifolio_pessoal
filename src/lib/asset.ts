/** Caminho de um arquivo de /public respeitando o base do Vite (GitHub Pages serve em /portifolio_pessoal/). */
export function asset(path: string): string {
  if (/^(https?:|mailto:)/.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
