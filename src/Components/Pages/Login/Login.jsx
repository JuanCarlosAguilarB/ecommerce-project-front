import { useEffect, useState } from "react";
import { loginFields } from "./formFields";
import Input from "./Input";
import FormExtra from "./FormExtra";
import FormAction from "./FormAction";
import { Header } from "../../Atoms";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

// borrarr

// import React from "react";

import React, { useRef } from "react";

const JitsiMeetComponent = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "hangup") {
        // Realiza las acciones necesarias para finalizar la llamada
        // Por ejemplo, puedes redirigir al usuario o hacer cualquier otra acción
      }
    };

    // Agregar un event listener para el mensaje del iframe
    window.addEventListener("message", handleMessage);

    // Remover el event listener al desmontar el componente
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe style={{ width: "100%", height: "100vh" }}
        ref={iframeRef}
        allow="camera; microphone; fullscreen; display-capture"
        src="https://meet.jit.si/ExcessHornsHookAway"
        // src="https://meet.litethinking.com/LongTermNotesVaryEfficiently"
        allowFullScreen
        title="Jitsi Meet"
      />
    </div>
  );
};

// borrar

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // authenticateUser(loginState);
    console.log(loginState);  
  };

  return (
    <>
      <JitsiMeetComponent />
      <div className="min-h-full flex items-center justify-center py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Header
            heading="Login to your account"
            paragraph="Don't have an account yet? "
            linkName="Signup"
            linkUrl="/signup"
          />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px">
              {fields.map((field) => (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={loginState[field.id]}
                  labelText={field.labelText}
                  labelFor={field.labelFor}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  isRequired={field.isRequired}
                  placeholder={field.placeholder}
                />
              ))}
            </div>

            <FormExtra />
            <FormAction handleSubmit={handleSubmit} text="Login" />
          </form>
        </div>
      </div>
    </>
  );
}
