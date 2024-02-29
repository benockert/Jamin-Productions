import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validate_token } from "../api/api.js";

function RequireAuth({ children }) {
  let navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const token = useRef(sessionStorage.getItem("source_control_jwt"));

  useEffect(() => {
    if (!!token.current) {
      validate_token(token.current).then((resp) => {
        if (resp.status === 200) {
          setAuthed(true);
        } else {
          navigate("/login");
        }
      });
    } else {
      navigate("/login");
    }
  });

  if (authed) {
    return children;
  }
}

export default RequireAuth;
