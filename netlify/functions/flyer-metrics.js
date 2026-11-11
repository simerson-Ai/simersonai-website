// Counts how often the Ace flyer is opened.
//   POST  -> increment the counter (the flyer beacons this on load)
//   GET   -> read the current count (visit this URL to see the number)
// Uses Netlify Blobs (built in — no external account, no cost). Always returns
// 200 and never throws, so a counting hiccup can never affect the flyer.
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  let getStore;
  try {
    ({ getStore } = require('@netlify/blobs'));
  } catch (_) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: 'blobs-unavailable' }) };
  }

  try {
    const store = getStore('ace-flyer');
    let opens = Number((await store.get('opens')) || 0) || 0;
    if (event.httpMethod === 'POST') {
      opens += 1;
      await store.set('opens', String(opens));
    }
    return { statusCode: 200, headers, body: JSON.stringify({ opens }) };
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: String((e && e.name) || 'error') }) };
  }
};
