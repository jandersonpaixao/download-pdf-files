# WORK IN PROGRESS

este script tem como objetivo baixar arquivos pdf atraves de um link lendo de uma planilha google sheets.

### Dependências

- Node

### Configurando o projeto

Para que possa ser feita a leitura dos dados da planilha é necessário adicionar as credenciais em um arquivo `.env`. Duplique o arquivo `.env.exemple`, troque seu nome para `.env` e adicione as credenciais.

### Instalação

Para instalar as dependências do projeto basta executar o comando:

```shell
$ npm install
```

## Gerar arquivos

para que a leitura da planilha ocorra perfeitamente, as colunas linkArquivo, idModulo, nomeArquivo e tipoArquivo devem estar preenchidas corretamente!

- a coluna linkArquivo deve conter uma URL válida de arquivo drive para fazer o download;
- a coluna idModulo é utilizada para fazer a separação de arquivos que pertecem a escopos diferentes

```shell
$ npm run start:download
```
