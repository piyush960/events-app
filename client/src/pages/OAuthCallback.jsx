import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeTokens } from "../services/EventService";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const hasRun = useRef(false);

  const handleExchangeToken = async () => {
    const code = params.get("code");
    const data = await exchangeTokens(code);
    window.sessionStorage.setItem("tokens", JSON.stringify(data?.tokens));
    window.sessionStorage.setItem("userInfo", JSON.stringify(data?.userInfo?.data))
    navigate('/');
  }

  useEffect(() => {
    if (!hasRun.current) {
      handleExchangeToken();
      hasRun.current = true;
    }
  }, []);

  return (
    <div>
      <h1>Processing OAuth Callback...</h1>
    </div>
  );
};

export default OAuthCallback;
