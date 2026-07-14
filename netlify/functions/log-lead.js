// Forwards a lead (plus the generated plan and PDF) to the Google Apps Script
// web app, which logs it to the sheet AND emails the visitor their plan.
// Only runs if LEADS_WEBHOOK_URL is set. Always returns 200.

exports.handler = async (event) => {
  const ok = { statusCode: 200, body: JSON.stringify({ ok: true }) };
  if (event.httpMethod !== 'POST') return ok;

  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return ok;

  let data = {};
  try { data = JSON.parse(event.body || '{}'); } catch (_) { return ok; }

  const clip = (v) => String(v == null ? '' : v).slice(0, 2000);
  const pdf = typeof data.pdf_base64 === 'string' ? data.pdf_base64.slice(0, 9000000) : '';

  const lead = {
    timestamp: new Date().toISOString(),
    name: clip(data.name),
    company: clip(data.company),
    email: clip(data.email),
    phone: clip(data.phone),
    brief: clip(data.brief),
    plan_title: clip(data.plan_title),
    plan_summary: clip(data.plan_summary),
    plan_benefit: clip(data.plan_benefit),
    plan_timeline: clip(data.plan_timeline),
    pdf_base64: pdf,
    source: 'simersonai.com'
  };
  if (!lead.email) return ok;

  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
  } catch (_) {}

  return ok;
};
