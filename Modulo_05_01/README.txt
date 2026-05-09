Template para Teste de Modelo de IA Local (Gemini Nano)

Este projeto demonstra como utilizar a API experimental de IA local do Google Chrome/Edge para executar modelos diretamente no navegador utilizando o Gemini Nano.

Requisitos

Antes de executar a aplicação, verifique os seguintes requisitos:

- Google Chrome ou Microsoft Edge atualizado
- Preferencialmente:
  - Chrome Canary
  - Edge Canary
- Sistema operacional 64 bits
- Espaço livre em disco (aproximadamente 5 GB)
- Internet ativa para download inicial do modelo

---

Ativando as Flags Experimentais

Abra o navegador e acesse:

chrome://flags

Ative as seguintes flags:

#prompt-api-for-gemini-nano
#optimization-guide-on-device-model

Após ativar, reinicie completamente o navegador.

---

Verificando Suporte da API

Abra o DevTools (F12) e execute:

await LanguageModel.availability()

Possíveis retornos:

- "available" → Modelo pronto para uso
- "downloadable" → Modelo disponível para download
- "downloading" → Download em andamento
- "unavailable" → API/modelo indisponível

---

Baixando o Modelo Local

Caso o retorno seja "downloadable", execute:

await LanguageModel.create()

O navegador iniciará automaticamente o download do Gemini Nano.

---

Acompanhando o Download

Você pode verificar o progresso acessando:

chrome://on-device-internals

O status esperado após concluir:

Foundational model state: Installed

---

Instalando as Dependências

Após o download do modelo, abra o terminal no diretório do projeto e execute:

npm ci

Após a instalação das dependências, o projeto estará pronto para uso.