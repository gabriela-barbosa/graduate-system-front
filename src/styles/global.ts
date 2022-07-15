import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 100%;
    display: table-cell;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font: 400 16px Roboto, sans-serif;
  }
   html,
   body {
    height: 100%;
  }

   label{
     color: #4b907e;
   }

   //select{
   //  width: 300px;
   //  border: 3px solid #cbcbcb;
   //  border-radius: 8px;
   //  height: 48px;
   //  color: #4b907e;
   //  font-family: Roboto;
   //  font-size: 20px;
   //}
   //
   //select:active{
   //  border: 3px solid #cbcbcb !important;
   //}


  html {
    width: 100%;
    height: 100%;
    display: table;
    font-size: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  .formSecretaria{
    width: 1200px;
  }

  .radioInput{
    margin-left: 30px;
    margin-right: 5px;
    margin-top: 12px;
  }

  .radioInput2{
    margin-right: 5px;
    margin-top: 12px;
  }

  .radioLabel{
    margin-right: 20px;
    margin-top: 10px;
  }

  .columnsecretaria {
    float: left;
    width: 33%;
  }
  input:invalid {
    border: 3px solid #900;
    border-color: #900;
    background-color: #FDD;
  }

  .contentSelect{
    padding: 20px 0px 50px 50px;
  }

  /* This is the style of our error messages */


  /* Clear floats after the columns */
  //.row:after {
  //  content: "";
  //  display: table;
  //  clear: both;
  //}

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

  form{
    width: 100%;
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

  .trash-icon{
    margin-left: 20px;
    cursor: pointer;
  }

  .tables{
    width: 700px;
  }

  .abrir-modal{
    margin-right: 5% ;
    width: 204px;
    padding: 10px;
    height: 46px;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    background-color: #ffff;
    opacity: 0.8;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 23px;
    color: #4b907eff;
    border: solid 2px;
    &:hover {
      opacity: 1;
    }

    .modal{
      color: red;
    }

  `
