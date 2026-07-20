/** Deliberately dated inline styling — this page is meant to look like it
 * hasn't been touched since 2006, which is the whole point of demonstrating
 * a browser-automation fallback instead of a real API. */
export function legacyLayout(title: string, body: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>MediTrack Legacy PMS — ${title}</title>
<style>
  body { font-family: "Times New Roman", Times, serif; background: #d6d3ce; margin: 0; padding: 0; }
  .titlebar { background: linear-gradient(#5a7ca0, #33506e); color: #fff; padding: 6px 12px; font-weight: bold; font-size: 15px; border-bottom: 2px solid #1f3a54; }
  .wrap { max-width: 640px; margin: 24px auto; background: #f5f4f0; border: 2px solid #7c7a73; padding: 16px 20px; }
  h1 { font-size: 18px; border-bottom: 1px solid #999; padding-bottom: 6px; }
  table { border-collapse: collapse; width: 100%; margin: 10px 0; }
  td, th { border: 1px solid #999; padding: 4px 8px; font-size: 13px; text-align: left; }
  th { background: #c9c6be; }
  label { display: block; margin: 8px 0 2px; font-size: 13px; font-weight: bold; }
  input[type=text], input[type=password] { font-size: 13px; padding: 3px; width: 260px; border: 1px inset #888; }
  input[type=submit], button { font-size: 13px; padding: 4px 14px; margin-top: 12px; background: #d8d5cd; border: 2px outset #fff; cursor: pointer; }
  a { color: #003399; }
  .footer { font-size: 11px; color: #555; margin-top: 20px; border-top: 1px solid #aaa; padding-top: 6px; }
  .error { color: #a10000; font-weight: bold; }
  .confirmation-number { font-size: 20px; font-weight: bold; letter-spacing: 1px; background: #eef; padding: 6px 10px; border: 1px dashed #669; display: inline-block; }
</style>
</head>
<body>
  <div class="titlebar">MediTrack Legacy Practice Management System v3.2</div>
  <div class="wrap">
    <h1>${title}</h1>
    ${body}
    <div class="footer">MediTrack PMS &copy; 2004-2009 — internal staff use only. Simulated for OpenEHR Bridge browser-automation demo.</div>
  </div>
</body>
</html>`;
}
