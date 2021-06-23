import React, { useEffect, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import "./App.css";

function App() {
  const jwtToken = useJwtToken();

  if (!jwtToken) {
    return <div>loading...</div>;
  }

  return (
    <div className="App">
      <h1>JWT Token</h1>
      <button
        onClick={() => {
          navigator.clipboard.writeText(jwtToken);
        }}
      >
        copy jwtToken
      </button>
    </div>
  );
}

export default withAuthenticator(App);

function useJwtToken() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    Auth.currentSession().then((session) => {
      const token = session.getIdToken().getJwtToken();
      setToken(token);
    });
  }, []);
  return token;
}
