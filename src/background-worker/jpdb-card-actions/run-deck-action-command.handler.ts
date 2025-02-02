import { getConfiguration } from '@shared/configuration/get-configuration';
import { ConfigurationSchema } from '@shared/configuration/types';
import { MessageSender } from '@shared/extension/types';
import { addVocabulary } from '@shared/jpdb/add-vocabulary';
import { removeVocabulary } from '@shared/jpdb/remove-vocabulary';
import { setCardSentence } from '@shared/jpdb/set-card-sentence';
import { getEnglishTranslation } from '@shared/jpdb/ja2en';
import { JPDBSpecialDeckNames } from '@shared/jpdb/types';
import { RunDeckActionCommand } from '@shared/messages/background/run-deck-action.command';
import { ToastCommand } from '@shared/messages/foreground/toast.command';
import { BackgroundCommandHandler } from '../lib/background-command-handler';

export class RunDeckActionCommandHandler extends BackgroundCommandHandler<RunDeckActionCommand> {
  public readonly command = RunDeckActionCommand;

  public async handle(
    sender: MessageSender,
    vid: number,
    sid: number,
    deck: 'mining' | 'blacklist' | 'neverForget',
    action: 'add' | 'remove',
    sentence?: string,
    shouldTranslate?: boolean,
  ): Promise<void> {
    const deckIdOrName = await this.getDeck(sender, deck);
    if (!deckIdOrName) return;

    try {
      await (action === 'add' ? addVocabulary : removeVocabulary)(deckIdOrName, vid, sid);
      await new ToastCommand(
        'success',
        `Successfully ${action}ed ${action === 'add' ? 'to' : 'from'} deck`,
      ).call(sender.tab!.id!);

      if (action === 'add' && sentence) {
        const translation = shouldTranslate ? await getEnglishTranslation(sentence) : undefined;
        await setCardSentence(vid, sid, sentence, translation);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      await new ToastCommand('error', `Failed to ${action} vocabulary.`).call(sender.tab!.id!);
    }
  }

  private async getDeck(
    sender: MessageSender,
    key: 'mining' | 'blacklist' | 'neverForget',
  ): Promise<JPDBSpecialDeckNames | number | false> {
    const deckKey = {
      mining: 'selectedMiningDeck',
      blacklist: 'jpdbBlacklistDeck',
      neverForget: 'jpdbNeverForgetDeck',
    }[key] as keyof ConfigurationSchema;

    const deck = await getConfiguration(deckKey, true);

    if (!deck) {
      await new ToastCommand('error', `No deck selected for ${key}`).call(sender.tab!.id!);

      return false;
    }

    if (!Number.isNaN(Number(deck))) {
      return Number(deck);
    }

    return deck as JPDBSpecialDeckNames;
  }
}
