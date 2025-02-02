import { DeckConfiguration, DiscoverWordConfiguration } from '../anki/types';

export type Keybind = { key: string; code: string; modifiers: string[] };
export type ConfigurationSchema = {
  schemaVersion: number;
  jpdbApiToken: string;
  jpdbBlacklistDeck: string;
  jpdbForqDeck: string;
  jpdbNeverForgetDeck: string;
  skipReleaseNotes: boolean;
  jpdbAddToForq: boolean;
  jpdbUseTwoGrades: boolean;
  jpdbSetSentence: boolean;
  jpdbAutoTranslate: boolean;
  jpdbDisableReviews: boolean;
  jpdbRotateFlags: boolean;
  jpdbRotateCycle: boolean;
  jpdbReviewNothing: Keybind;
  jpdbReviewSomething: Keybind;
  jpdbReviewHard: Keybind;
  jpdbReviewOkay: Keybind;
  jpdbReviewEasy: Keybind;
  jpdbReviewFail: Keybind;
  jpdbReviewPass: Keybind;
  jpdbRotateForward: Keybind;
  jpdbRotateBackward: Keybind;

  enableAnkiIntegration: boolean;
  ankiUrl: string;
  ankiProxyUrl: string;
  ankiMiningConfig: DeckConfiguration;
  ankiBlacklistConfig: DeckConfiguration;
  ankiNeverForgetConfig: DeckConfiguration;
  ankiReadonlyConfigs: DiscoverWordConfiguration[];

  contextWidth: number;
  hidePopupAutomatically: boolean;
  hidePopupDelay: number;
  hideAfterAction: boolean;

  useLegacyHighlighter: boolean;
  skipFurigana: boolean;

  showPopupOnHover: boolean;
  touchscreenSupport: boolean;
  disableFadeAnimation: boolean;

  parseKey: Keybind;
  showPopupKey: Keybind;
  showAdvancedDialogKey: Keybind;
  lookupSelectionKey: Keybind;
  addToMiningKey: Keybind;
  addToBlacklistKey: Keybind;
  addToNeverForgetKey: Keybind;

  // Word Colors
  'jpdb-word-color': string;
  'unparsed-color': string;
  'not-in-deck-color': string;
  'locked-color': string;
  'redundant-color': string;
  'new-color': string;
  'learning-color': string;
  'known-color': string;
  'never-forget-color': string;
  'due-color': string;
  'failed-color': string;
  'suspended-color': string;
  'blacklisted-color': string;
  'misparsed-color': string;

  // Button Colors
  'add-button-color': string;
  'never-forget-button-color': string;
  'blacklist-button-color': string;
  'nothing-button-color': string;
  'something-button-color': string;
  'hard-button-color': string;
  'okay-button-color': string;
  'easy-button-color': string;
  'pass-button-color': string;
  'fail-button-color': string;

  selectedDecks: [number, string][];
  selectedMiningDeck: string;

  customWordCSS: string;
  customPopupCSS: string;
};
