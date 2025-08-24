// Frontend: /oauth-callback page
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      exchangeCodeForTokens(code, state);
    }
  }, [searchParams]);


  return <div>Processing OAuth...</div>;
}