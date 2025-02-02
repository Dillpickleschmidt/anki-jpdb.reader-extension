import { getConfiguration } from "../configuration/get-configuration";
import { ConfigurationSchema } from "../configuration/types";

const installedStyles = new Map<string, { file: string; raw?: string }>();

chrome.tabs.onRemoved.addListener((tabId) => {
  installedStyles.forEach((config, key) => {
    if (key.startsWith(`${tabId}-`)) {
      installedStyles.delete(key);
    }
  });
});

const generateWordColorCSS = async (): Promise<string> => {
  const colors = await Promise.all([
    getConfiguration('jpdb-word-color', false),
    getConfiguration('unparsed-color', false),
    getConfiguration('not-in-deck-color', false),
    getConfiguration('locked-color', false),
    getConfiguration('redundant-color', false),
    getConfiguration('new-color', false),
    getConfiguration('learning-color', false),
    getConfiguration('known-color', false),
    getConfiguration('never-forget-color', false),
    getConfiguration('due-color', false),
    getConfiguration('failed-color', false),
    getConfiguration('suspended-color', false),
    getConfiguration('blacklisted-color', false),
    getConfiguration('misparsed-color', false),
  ]);

  return `
    .jpdb-word { color: ${colors[0]} !important; }
    .unparsed { color: ${colors[1]} !important; }
    .not-in-deck { color: ${colors[2]} !important; }
    .locked { color: ${colors[3]} !important; }
    .redundant { color: ${colors[4]} !important; }
    .new { color: ${colors[5]} !important; }
    .learning { color: ${colors[6]} !important; }
    .known { color: ${colors[7]} !important; }
    .never-forget { color: ${colors[8]} !important; }
    .due { color: ${colors[9]} !important; }
    .failed { color: ${colors[10]} !important; }
    .suspended { color: ${colors[11]} !important; }
    .blacklisted { color: ${colors[12]} !important; }
    .misparsed { color: ${colors[13]} !important; }
  `;
};

export const injectStyle = async (tabId: number, file: string, raw?: string): Promise<void> => {
  const key = `${tabId}-${file}`;

  if (installedStyles.has(key)) {
    const config = installedStyles.get(key);
    const remove = (
      cfg:
        | Pick<chrome.scripting.CSSInjection, 'files'>
        | Pick<chrome.scripting.CSSInjection, 'css'>,
    ): Promise<void> =>
      chrome.scripting.removeCSS({ target: { tabId, allFrames: true }, ...cfg }).catch(() => {
        /* noop */
      });

    await remove({ files: [config!.file] });

    if (config?.raw?.length) {
      await remove({ css: config.raw });
    }
  }

  // Generate color CSS
  const colorCSS = await generateWordColorCSS();

  // Inject base CSS
  await chrome.scripting.insertCSS({
    target: { tabId, allFrames: true },
    files: [`css/${file}.css`],
  });

  // Inject color CSS
  await chrome.scripting.insertCSS({
    target: { tabId, allFrames: true },
    css: colorCSS,
  });

  // Inject custom CSS last (if any) so it can override colors
  if (raw?.length) {
    await chrome.scripting.insertCSS({
      target: { tabId, allFrames: true },
      css: raw,
    });
  }

  installedStyles.set(key, { file, raw });
};
