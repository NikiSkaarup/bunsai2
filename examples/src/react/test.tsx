import { type ReactProps, React, make } from "bunsai/react";
import logo from "../assets/logo.webp";
import createAssetGetter from "bunsai/asset";

const asset = createAssetGetter(import.meta);

function Test({ attrs, context }: ReactProps<Record<string, any>>) {
  attrs.root_attrs = {
    "data-theme": "my-theme",
  };

  React.useEffect(() => {
    console.log("mounted:", context);
  }, []);

  return (
    <div className="wrapper">
      <div className="logo-wrapper">
        <img src={asset(logo)} alt="logo" className="logo" />
      </div>

      <div className="wel">BunSai + React</div>
    </div>
  );
}

const head = () => (
  <style>
    {`
    html,
    body {
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
    }

    .logo-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logo {
        width: 25%;
        animation: pulse 1s ease infinite;
      }

    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .wel {
        margin-top: 2rem;
        font-family: monospace;
        font-size: 3rem;
        width: 100%;
        text-align: center;
      }

      @keyframes pulse {
        50% {
          transform: scale(105%);
        }
      }
    `}
  </style>
);

export default make({ component: Test, importMeta: import.meta, head });
