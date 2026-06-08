/**
 * Castro Coffee — Menu Publish button (Google Apps Script)
 * ---------------------------------------------------------------------------
 * Adds a "🌐 Website" menu to the spreadsheet with a "Publish menu to website"
 * button. Clicking it tells the website to rebuild with the latest prices.
 *
 * ONE-TIME SETUP (developer):
 *   1. Open the Google Sheet ▸ Extensions ▸ Apps Script.
 *   2. Paste this whole file in, replacing anything there. Save.
 *   3. In Vercel: Project ▸ Settings ▸ Git ▸ Deploy Hooks ▸ create one
 *      (e.g. name "Publish menu", branch "main"). Copy the URL.
 *   4. Back in Apps Script, run the function `setupDeployHook` once and paste
 *      the URL when prompted. (Authorize when Google asks.)
 *   5. Reload the spreadsheet — the "🌐 Website" menu appears.
 *
 * After that, owners just click 🌐 Website ▸ Publish menu to website.
 * ---------------------------------------------------------------------------
 */

const HOOK_PROP = "VERCEL_DEPLOY_HOOK_URL";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌐 Website")
    .addItem("Publish menu to website", "publishMenu")
    .addSeparator()
    .addItem("Set / change deploy hook (dev)", "setupDeployHook")
    .addToUi();
}

function publishMenu() {
  const ui = SpreadsheetApp.getUi();
  const url = PropertiesService.getScriptProperties().getProperty(HOOK_PROP);

  if (!url) {
    ui.alert(
      "Not set up yet",
      'The website deploy hook hasn\'t been configured. Ask your developer to run "Set / change deploy hook".',
      ui.ButtonSet.OK
    );
    return;
  }

  const confirm = ui.alert(
    "Publish menu?",
    "This updates the live website with the current prices and items in this sheet. " +
      "It usually takes about a minute to appear.",
    ui.ButtonSet.OK_CANCEL
  );
  if (confirm !== ui.Button.OK) return;

  try {
    const res = UrlFetchApp.fetch(url, { method: "post", muteHttpExceptions: true });
    const code = res.getResponseCode();
    if (code >= 200 && code < 300) {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        "Sent! The website will update in about a minute.", "✅ Publishing", 6
      );
    } else {
      ui.alert("Something went wrong", "The website returned status " + code + ". Try again, or contact your developer.", ui.ButtonSet.OK);
    }
  } catch (e) {
    ui.alert("Couldn't reach the website", String(e), ui.ButtonSet.OK);
  }
}

function setupDeployHook() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt("Set deploy hook", "Paste the Vercel Deploy Hook URL:", ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  const url = resp.getResponseText().trim();
  if (!/^https:\/\//.test(url)) { ui.alert("That doesn't look like a URL. Nothing saved."); return; }
  PropertiesService.getScriptProperties().setProperty(HOOK_PROP, url);
  ui.alert("Saved. Owners can now use 🌐 Website ▸ Publish menu to website.");
}
