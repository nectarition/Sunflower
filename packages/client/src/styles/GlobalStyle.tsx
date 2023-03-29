import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  p, table,
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  input {
    font-size: 16px;
  }
  small {
    font-size: 0.8em;
    font-weight: 500;
  }
  h1 { font-size: 2em; }
  h2 {
    font-size: 1.75em;
    color: var(--tertiary-color);
  }
  h3 { font-size: 1.5em; }
  h4 { font-size: 1.25em; }
  h5 { font-size: 1em; }
  h6 { font-size: 0.9em; }
  a {
    color: var(--secondary-color);
  }
  table {
    min-width: 50%;
    max-width: 100%;
    border-collapse: collapse;
    text-align: left;

    tr {
      &:nth-child(2n) {
        background-color: #f8f8f8;
      }
    }
    th,
    td {
      padding: 10px;
    }
    th:empty {
      display: none;
    }

    thead {
      border-bottom: 2px solid var(--secondary-color);
    }
    tbody {
      border-bottom: 2px solid var(--secondary-color);
    }
  }
`

export default GlobalStyle
