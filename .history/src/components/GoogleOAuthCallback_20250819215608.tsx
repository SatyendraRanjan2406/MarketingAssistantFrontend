// Frontend: /oauth-callback page
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      exchangeCodeForTokens(code, state);
    }
  }, [searchParams]);

  const exchangeCodeForTokens = async (code, state) => {
    try {
      const response = await fetch('http://localhost:8001/accounts/api/google-oauth/exchange-tokens/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // OAuth successful - redirect to dashboard
        navigate('/dashboard');
      } else {
        console.error('OAuth failed:', data.error);
        navigate('/error');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      navigate('/error');
    }
  };

  return <div>Processing OAuth...</div>;
}