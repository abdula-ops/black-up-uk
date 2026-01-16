/**
 * Global Fetch Protection Script
 * Handles fetch errors gracefully, especially for Swym and product JSON fetches
 * Prevents "Unexpected end of JSON input" and 404 errors from crashing other scripts
 */

(function() {
  'use strict';

  // Store the original fetch function
  const originalFetch = window.fetch;

  // Override the global fetch function with error handling
  window.fetch = function(...args) {
    const url = args[0];
    
    return originalFetch.apply(this, args)
      .then(response => {
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          console.warn(`Fetch Protection: HTTP error ${response.status} for URL: ${url}`);
          
          // For 404 errors, return a safe empty response instead of throwing
          if (response.status === 404) {
            console.warn(`Fetch Protection: Resource not found (404), returning safe fallback for: ${url}`);
            
            // Return a cloned response with empty JSON to prevent crashes
            return new Response(JSON.stringify({ error: 'Resource not found', status: 404 }), {
              status: 404,
              statusText: 'Not Found',
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        
        return response;
      })
      .catch(error => {
        console.error(`Fetch Protection: Network error for URL: ${url}`, error);
        
        // Return a safe fallback response to prevent crashes
        return new Response(JSON.stringify({ error: error.message || 'Network error', status: 0 }), {
          status: 0,
          statusText: 'Network Error',
          headers: { 'Content-Type': 'application/json' }
        });
      });
  };

  // Intercept JSON.parse to handle Swym-related parsing errors
  const originalJSONParse = JSON.parse;
  JSON.parse = function(text, ...args) {
    try {
      return originalJSONParse.call(this, text, ...args);
    } catch (error) {
      // Check if this is likely a Swym-related error
      if (error.message && error.message.includes('Unexpected end of JSON input')) {
        console.error('Fetch Protection: JSON parse error (likely from 404 or empty response):', error);
        console.warn('Fetch Protection: Attempted to parse:', text ? text.substring(0, 100) : 'empty string');
        
        // Return a safe empty object instead of throwing
        return { error: 'Invalid JSON', message: 'Unexpected end of JSON input' };
      }
      
      // For other JSON errors, log and re-throw
      console.error('Fetch Protection: JSON parse error:', error);
      throw error;
    }
  };

  // Add error listener specifically for Swym-related errors
  window.addEventListener('error', function(event) {
    const errorMessage = event.message || '';
    const filename = event.filename || '';
    
    // Detect Swym-related errors
    if (filename.includes('swym') || 
        filename.includes('shop_events') || 
        errorMessage.toLowerCase().includes('swym')) {
      console.error('Fetch Protection: Caught Swym-related error:', errorMessage);
      event.preventDefault(); // Prevent the error from bubbling up
      return true;
    }
    
    // Detect JSON parsing errors from product fetches
    if (errorMessage.includes('Unexpected end of JSON input') ||
        errorMessage.includes('JSON.parse')) {
      console.error('Fetch Protection: Caught JSON parsing error:', errorMessage);
      event.preventDefault(); // Prevent the error from bubbling up
      return true;
    }
  }, true);

  // Add unhandledrejection listener for Promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    
    if (reason && typeof reason === 'object') {
      const message = reason.message || '';
      const stack = reason.stack || '';
      
      // Check if this is a Swym or fetch-related error
      if (message.includes('Unexpected end of JSON input') ||
          stack.includes('swym') ||
          stack.includes('shop_events') ||
          message.toLowerCase().includes('swym')) {
        console.error('Fetch Protection: Caught unhandled promise rejection (Swym/Fetch):', reason);
        event.preventDefault(); // Prevent the rejection from bubbling up
        return true;
      }
    }
  });

  console.log('Fetch Protection: Script loaded successfully - monitoring all fetch requests and JSON parsing');
})();


