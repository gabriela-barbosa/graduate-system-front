import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font: 400 16px Roboto, sans-serif;
  }
   html,
  body {
    height: 100%;
  }

  html {
    box-sizing: border-box;
    font-size: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ol,
  ul,
  p,
  fieldset {
    margin: 0;
    padding: 0;
  }

  a{
    text-decoration: none;
  }

  ol,
  ul {
    list-style: none;
  }

  .table-header{
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

  table{
    border-collapse: collapse;
  }

  .pendente{
    color: #DCB552 !important;
  }

  .atualizado{
    color: #5BAFC9 !important;
  }

  .user{
    float: right;
    display: block;
    position: relative;
  }

  .cabecalho{
    width: 100%;
  }

  .colunameio{
    width: 80%;
  }

  #__next {
    height: 100%;
  }
  `
