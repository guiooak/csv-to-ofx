<p align="center">
  <img src="public/favicon.svg" alt="" width="64" height="64" />
</p>

<h1 align="center">csv→ofx</h1>

<p align="center">
  Converta o CSV da fatura do cartão de crédito Sicredi em um arquivo OFX,<br />
  pronto para importar no seu app de gestão financeira.
</p>

<p align="center">
  <a href="https://guiooak.github.io/csv-to-ofx/">
    <img src="https://img.shields.io/badge/Abrir_o_app-0b7a5f?style=for-the-badge&logoColor=white" alt="Abrir o app" />
  </a>
</p>

<p align="center">
  <a href="https://guiooak.github.io/csv-to-ofx/"><strong>guiooak.github.io/csv-to-ofx</strong></a>
</p>

---

## Como usar

1. **Exporte a fatura:** no app ou internet banking Sicredi, baixe a fatura do cartão em CSV.
2. **Envie o arquivo:** abra o [app](https://guiooak.github.io/csv-to-ofx/) e arraste o CSV para a área indicada (ou escolha no computador).
3. **Importe o OFX:** baixe o arquivo gerado e importe no seu app de finanças.

## O que ele faz

- **Lança parcelas no mês certo:** uma compra em 6x aparece com a data da parcela atual, não da compra original.
- **Mostra um resumo antes do download:** período da fatura e quantidade de lançamentos.
- **Gera IDs estáveis por transação:** importar a mesma fatura duas vezes não duplica lançamentos nos apps que respeitam o `FITID`.
- **Privacidade:** tudo roda no seu navegador. Nenhum dado da fatura é enviado para servidor algum.

## Desenvolvimento

Feito com React, TypeScript e Vite.

```bash
npm install
npm run dev      # servidor local em http://localhost:5173
npm test         # testes com Vitest
npm run build    # build de produção em dist/
```

O deploy é automático: cada push no `main` roda lint, testes e build, e publica no GitHub Pages ([workflow](.github/workflows/deploy.yml)).

## Licença

[MIT](LICENSE). Projeto pessoal, sem vínculo com o Sicredi.
