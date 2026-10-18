# Portfólio de Gustavo Alves da Silva

Site pessoal em React, TypeScript e Vite, publicado no GitHub Pages:
https://gustavo-domingos.github.io/portifolio_pessoal/

A identidade é uma carta topográfica: o topo da página é um mapa desenhado em canvas, com uma trilha que passa por cada
experiência e projeto. O relevo reage ao cursor, uma onda se espalha ao clicar e uma bicicleta pedala até a parada
escolhida. Tudo respeita `prefers-reduced-motion` e funciona em português e inglês, nos modos claro e escuro.

## Comandos

```bash
npm install
npm run dev       # http://localhost:5173/portifolio_pessoal/
npm test          # testes (Vitest)
npm run lint
npm run build     # checagem de tipos + build em dist/
npm run deploy    # build e publicação no branch gh-pages
```

## Atualizar o conteúdo

Todo o texto fica em dois arquivos, um por idioma, com o mesmo formato:

- `src/content/pt.ts`
- `src/content/en.ts`

O tipo `Content` (`src/content/types.ts`) obriga os dois arquivos a terem os mesmos campos, e
`src/content/content.test.ts` confere se os cases, paradas e fontes batem entre os idiomas. Para incluir um projeto,
acrescente um item em `projects.cases` nos dois arquivos e, se quiser uma parada no mapa, um item em `hero.stops` e uma
posição em `src/components/heroRoute.ts`.

## Currículo

As fontes do currículo ficam em `docs/curriculo/` (`curriculo-pt.html` e `resume-en.html`, com o estilo em
`curriculo.css`). Para gerar o PDF, abra o HTML no Chrome, use Ctrl+P, escolha "Salvar como PDF" com margens padrão e
salve em `public/cv/` com o mesmo nome do arquivo atual.

## Estrutura

```
src/
├── content/        textos (pt, en) e o tipo que os descreve
├── i18n/           idioma atual e troca de idioma
├── hooks/          tema, movimento reduzido, media queries
├── lib/            mapa: funções puras (topo.ts, testadas) e o controlador do canvas (topoMap.ts)
├── components/     cabeçalho, modal de case, miniaturas de terreno, bicicleta
├── sections/       uma seção da página por arquivo, cada uma com o seu CSS
└── styles/         tokens (cores, tipos, espaços) e estilos base
public/             favicon, imagem de compartilhamento (og.png), currículos em PDF
docs/curriculo/     fontes HTML do currículo
```
