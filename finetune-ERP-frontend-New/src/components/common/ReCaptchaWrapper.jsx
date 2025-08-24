import { forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaWrapper = forwardRef(function ReCaptchaWrapper(props, ref) {
  const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!sitekey) {
    console.error('Missing reCAPTCHA sitekey');
    return null;
  }
  return <ReCAPTCHA ref={ref} sitekey={sitekey} {...props} />;
});

export default ReCaptchaWrapper;
