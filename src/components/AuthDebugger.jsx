import React, { useState, useEffect } from 'react';

/**
 * Debug component to troubleshoot auth issues
 * Add this component temporarily to any admin page to debug auth token issues
 */
export const AuthDebugger = () => {
  const [token, setToken] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  const refreshToken = () => {
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
  };

  const testAuth = async () => {
    try {
      // Test endpoints with direct token
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Test API endpoint with direct fetch
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/experiences`, {
        headers,
        credentials: 'include'
      });
      
      const data = await response.json();
      alert(`Test result: ${response.status}\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert(`Test error: ${error.message}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '5px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Debug Auth
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        maxWidth: '80vw',
        maxHeight: '50vh',
        overflow: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Auth Debugger</h3>
        <button onClick={() => setIsVisible(false)}>Close</button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Token Present:</strong> {token ? 'Yes' : 'No'}
      </div>
      
      {token && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Token Preview:</strong> 
          <div style={{ wordBreak: 'break-all' }}>
            {token.substring(0, 20)}...
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={refreshToken}>Refresh</button>
        <button onClick={testAuth}>Test Auth</button>
        <button 
          onClick={() => {
            localStorage.removeItem('authToken');
            refreshToken();
          }}
          style={{ backgroundColor: '#ffcccc' }}
        >
          Clear Token
        </button>
      </div>
    </div>
  );
};

export default AuthDebugger;