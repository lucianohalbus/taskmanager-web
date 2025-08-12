import { useEffect } from "react";
import api from "../api/axios";

export default function TestApi() {
  useEffect(() => {
    api.get("/user")
      .then(res => console.log("API OK:", res.data))
      .catch(err => console.error("Erro API:", err));
  }, []);

  return <h1>Testando API...</h1>;
}
