import React, { useState } from 'react';
import emailService from '../services/emailService';

const EmailTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testDirectEmailJS = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('Starting email test...');
      
      // Test with simple message
      const testMessage = {
        username: 'Test User',
        text: 'This is a test message to verify email functionality.'
      };

      console.log('Calling email service...');
      const result = await emailService.sendBirthdayMessageNotification(testMessage);
      
      console.log('Email service result:', result);
      setResult(result);

    } catch (error) {
      console.error('Email test error:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: 'white', 
      padding: '20px', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h3>Email Debug Test</h3>
      
      <button 
        onClick={testDirectEmailJS}
        disabled={testing}
        style={{
          background: testing ? '#ccc' : '#0095f6',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: testing ? 'not-allowed' : 'pointer'
        }}
      >
        {testing ? 'Testing Email...' : 'Test Email Now'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          borderRadius: '5px',
          background: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: result.success ? '#155724' : '#721c24'
        }}>
          <strong>Result:</strong>
          <pre style={{ 
            fontSize: '12px', 
            margin: '5px 0 0 0',
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Check browser console for detailed logs</strong>
      </div>
    </div>
  );
};

export default EmailTest;
