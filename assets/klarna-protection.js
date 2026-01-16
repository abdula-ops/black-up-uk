/**
 * Klarna SDK Protection Script
 * Prevents crashes from undefined __SDK_VERSION__ and other Klarna initialization errors
 */

(function() {
  'use strict';

  // Defensive coding: Define __SDK_VERSION__ if not already defined
  if (typeof window.__SDK_VERSION__ === 'undefined') {
    window.__SDK_VERSION__ = '1.0.0'; // Default fallback version
    console.warn('Klarna Protection: __SDK_VERSION__ was undefined, set to default value');
  }

  // Wrap the Klarna initialization in a try-catch to prevent crashes
  const originalKlarna = window.Klarna;
  
  // Create a safe wrapper for Klarna methods
  window.Klarna = new Proxy(originalKlarna || {}, {
    get: function(target, prop) {
      try {
        if (prop in target && typeof target[prop] === 'function') {
          // Wrap Klarna methods in try-catch
          return function(...args) {
            try {
              return target[prop](...args);
            } catch (error) {
              console.error(`Klarna Protection: Error calling Klarna.${String(prop)}:`, error);
              return undefined;
            }
          };
        }
        return target[prop];
      } catch (error) {
        console.error(`Klarna Protection: Error accessing Klarna.${String(prop)}:`, error);
        return undefined;
      }
    },
    set: function(target, prop, value) {
      try {
        target[prop] = value;
        return true;
      } catch (error) {
        console.error(`Klarna Protection: Error setting Klarna.${String(prop)}:`, error);
        return false;
      }
    }
  });

  // Listen for Klarna-related script errors and prevent them from crashing the page
  window.addEventListener('error', function(event) {
    if (event.filename && event.filename.includes('klarna')) {
      console.error('Klarna Protection: Caught Klarna script error:', event.message);
      event.preventDefault(); // Prevent the error from bubbling up
      return true;
    }
  }, true);

  // Safe initialization wrapper for Klarna On-Site Messaging
  document.addEventListener('DOMContentLoaded', function() {
    try {
      // Check if Klarna object exists and has necessary methods
      if (window.Klarna && typeof window.Klarna.OnsiteMessaging === 'object') {
        console.log('Klarna Protection: Klarna initialized successfully');
      } else {
        console.warn('Klarna Protection: Klarna OnsiteMessaging not available');
      }
    } catch (error) {
      console.error('Klarna Protection: Error during Klarna initialization check:', error);
    }
  });

  console.log('Klarna Protection: Script loaded successfully');
})();


