================================================================
  SIMERSON AI — FLYER LANDING PAGES  (folder: /f/)
================================================================

WHAT THIS IS
  Three phone-friendly landing pages, one per audience:

    simersonai.com/f/hospice   → hospice & palliative care
    simersonai.com/f/billing   → medical billing companies
    simersonai.com/f/ymca      → YMCA / community org

  Each page has two buttons:
    • "Explore Simerson Ai"  → simersonai.com  (with tracking, see below)
    • "Email Bear directly"  → opens the person's email app with the
                               subject + a "Source:" line already filled in

  Clean URLs work automatically: /f/hospice serves /f/hospice/index.html.
  No redirects file needed.

----------------------------------------------------------------
HOW THE TRACKING WORKS  (so you know which flyer got the reply)
----------------------------------------------------------------
  • Website button carries:  ?utm_source=flyer&utm_medium=print&utm_campaign=<slug>
    (slug = hospice / billing / ymca). Shows up in your site analytics
    as the campaign name, so a visit from the hospice page reads "hospice".

  • Email button pre-fills the subject AND puts "Source: <slug>-flyer" as the
    first line of the message body. When someone emails you, that line tells
    you exactly which flyer they came from.

----------------------------------------------------------------
HOW TO PUBLISH  (the live site is a manual Netlify Drop — NOT Git)
----------------------------------------------------------------
  IMPORTANT: The live simersonai.com site is updated by dragging a static
  folder onto Netlify. Dropping REPLACES the whole site, so you must drop the
  COMPLETE site folder (with this /f/ folder inside it), never /f/ by itself.

  SAFEST STEPS (avoids reverting any recent site change):
    1. Go to app.netlify.com → the simersonai.com site → Deploys.
    2. Open the current live deploy → "Download" (gets the exact live site).
    3. Copy this entire "f" folder into that downloaded folder.
    4. Drag the whole folder onto app.netlify.com/drop  (or the site's
       "Deploys" drop zone). Wait for "Published".
    5. Test on your phone: simersonai.com/f/hospice

  This "f" folder is already sitting inside simersonai-site-live/, which is the
  July 14 copy of the live site — if you know nothing else changed since then,
  you can just re-drop simersonai-site-live/ and skip the download step.

----------------------------------------------------------------
TEXT-MESSAGE COPY  (copy-paste, then send with the link)
----------------------------------------------------------------
  HOSPICE:
    "Hi [name] — this is Bear with Simerson Ai. Here's the quick rundown of
     the AI agent team we can build for a hospice — reads referrals, answers
     the intake line, keeps documentation audit-ready. 2-min read:
     simersonai.com/f/hospice"

  BILLING:
    "Hi [name] — Bear with Simerson Ai. Quick look at the billing agents we
     build — eligibility, claim scrubbing, appeals, A/R follow-up, all with a
     human approving each step: simersonai.com/f/billing"

  YMCA:
    "Hi [name] — Bear with Simerson Ai. Here's how we help a Y handle the
     phones and front-desk sign-ups 24/7 so staff can focus on members:
     simersonai.com/f/ymca"

  TIP: Texting the LINK (not the image) lets them tap the buttons and email
  you back with the source pre-filled. Text the PNG image only when you just
  want a quick visual with no tracking.

----------------------------------------------------------------
TO ADD A NEW AUDIENCE
----------------------------------------------------------------
  Copy any <slug>/index.html to a new folder, change the eyebrow / headline /
  features, and update the two button links' utm_campaign + the email subject
  and "Source:" line to the new slug. Then re-publish per the steps above.
