// generate-plan.js
// Generates a custom automation "game plan" concept for a visitor's brief.
// Runs on Netlify (server-side) so the Anthropic API key is NEVER exposed in the browser.

const MODEL = "claude-haiku-4-5";   // cheap + fast; good for short structured output
const MAX_BRIEF_LEN = 600;          // caps input size to bound cost / abuse
const MAX_TOKENS = 600;             // caps output size

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    // No key configured — tell the front-end to use its built-in fallback plan.
    return reply(500, { error: "Not configured" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return reply(400, { error: "Bad request" });
  }

  const brief = String(body.brief || "").slice(0, MAX_BRIEF_LEN).trim();
  if (!brief) {
    return reply(400, { error: "Missing brief" });
  }
  const businessType = clip(body.business_type);
  const role = clip(body.role);
  const hours = clip(body.hours);
  const timeline = clip(body.timeline);

  const prompt =
    'You are an AI automation consultant for SimersonAi. A business owner wants to automate a task. ' +
    'Produce a concise, realistic starter CONCEPT for an AI agent that would do it. ' +
    'Respond with ONLY valid minified JSON, no markdown and no preamble, in exactly this shape: ' +
    '{"title":"short name for the automation","summary":"1-2 plain sentences a non-technical owner understands",' +
    '"benefit":"an estimated payoff phrased as a possibility, e.g. Your team could save roughly 6 hours a week",' +
    '"timeline":"a rough build duration ONLY, like 2-3 weeks","steps":["step","step","step"],' +
    '"questions":["question","question"]}. ' +
    'Rules: 3 to 5 steps. Write each step as a short action title, then a dash, then 1 to 2 plain-language sentences (about 18 to 28 words total) explaining what the agent does at that step and why it helps. ' +
    'Benefit MUST be phrased as an estimate, never a promise or guarantee. ' +
    'Timeline is ONLY a rough duration phrase. ' +
    'NEVER mention price, cost, fees, or dollar amounts anywhere. ' +
    '1 to 2 short clarifying questions you would need answered to build it. ' +
    'Be specific to their task. ' +
    'Task: "' + brief + '". Business type: ' + businessType + '. Role: ' + role +
    '. Time spent weekly: ' + hours + '. Desired timeline: ' + timeline + '.';

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!r.ok) {
      return reply(502, { error: "Generation failed" });
    }

    const data = await r.json();
    const text = (data.content || [])
      .filter(function (b) { return b.type === "text"; })
      .map(function (b) { return b.text; })
      .join("");

    // Pull the JSON object out of the model's response.
    const s = text.indexOf("{"), e = text.lastIndexOf("}");
    const jsonStr = (s >= 0 && e > s) ? text.slice(s, e + 1) : "{}";
    const plan = JSON.parse(jsonStr);

    return reply(200, plan);
  } catch (err) {
    return reply(502, { error: "Generation failed" });
  }
};

function clip(v) {
  return String(v || "not specified").slice(0, 80);
}

function reply(statusCode, obj) {
  return {
    statusCode: statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(obj)
  };
}
