import CheckLogin from "../../src/components/CheckLogIn";


export default function App(props) {

  return (
    <CheckLogin>
      {props.children}

    </CheckLogin>
  )


}
/*
<style jsx global>{`
      * {
        font-family: Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
          'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New',
          monospace, serif;
      }
      html {
        box-sizing: border-box;
        -webkit-font-smoothing: antialised;
        -moz-osx-font-smoothing: grayscale;
      }
      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }
      body {
        margin: 0;
      }
      @media print {
        body {
          background-color: #fff;
        }
      }
    `}</style>*/