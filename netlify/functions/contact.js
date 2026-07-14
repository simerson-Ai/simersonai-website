// Handles the Contact page form. Parses the submitted fields, forwards them to
// the Google Apps Script web app (which logs to the "Contact Messages" tab and
// emails a notification), then redirects the visitor to the thank-you page.
// Always redirects, even if the webhook is unreachable, so the visitor is never stuck.

exports.handler = async (event) => {
  const redirect = { statusCode: 302, headers: { Location: '/thank-you.html' }, body: '' };
  if (event.httpMethod !== 'POST') return redirect;

  let body = event.body || '';
  if (event.isBase64Encoded) {
    try { body = Buffer.from(body, 'base64').toString('utf8'); } catch (_) {}
  }

  const params = new URLSearchParams(body);
  const clip = (v) => String(v == null ? '' : v).slice(0, 5000);

  const payload = {
    type: 'contact',
    timestamp: new Date().toISOString(),
    name: clip(params.get('name')),
    company: clip(params.get('company')),
    email: clip(params.get('email')),
    phone: clip(params.get('phone')),
    message: clip(params.get('message')),
    sms_consent: params.get('sms_consent') ? 'Yes' : 'No',
    source: 'simersonai.com'
  };

  const url = process.env.LEADS_WEBHOOK_URL;
  if (url && payload.email) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (_) {}
  }

  return redirect;
};
