import React from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import "./App.css";

const apiUrlBase = process.env.REACT_APP_API_URL_BASE;

function App() {
  const [name, setName] = React.useState<string>("");
  return (
    <div className="App">
      <div>
        <h2>create user</h2>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <button
          onClick={() => {
            Auth.currentSession().then((session) => {
              const token = session.getIdToken().getJwtToken();
              navigator.clipboard.writeText(
                `curl -H "Content-Type: application/json" -H "x-ta-token:${token}" -X POST -d '{"name":"${name}"}' "${apiUrlBase}/user"`
              );
            });
          }}
        >
          copy
        </button>
      </div>
      <div>
        <h2>get user</h2>
        <button
          onClick={() => {
            Auth.currentSession().then((session) => {
              const token = session.getIdToken().getJwtToken();
              navigator.clipboard.writeText(
                `curl -H "Content-Type: application/json" -H "x-ta-token:${token}" "${apiUrlBase}/user"`
              );
            });
          }}
        >
          copy
        </button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
