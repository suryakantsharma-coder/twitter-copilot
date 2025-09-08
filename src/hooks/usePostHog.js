import posthog from 'posthog-js';
import { useEffect } from 'react';
const usePostHog = () => {
  const init = () => {
    posthog.init('phc_3G0Amb4v1d9EeXQzSOWnaLwG0tFcCicebmZK13XYnC5', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
    });
  };

  const trackEvent = (eventName, properties) => {
    posthog.capture(eventName, properties);
  };

  useEffect(() => {
    init();
  }, []);

  return {
    trackEvent,
  };
};

export default usePostHog;
