import { BackgroundCommand } from '../lib/background-command';

export class RunDeckActionCommand extends BackgroundCommand<
  [
    vid: number,
    sid: number,
    key: 'mining' | 'blacklist' | 'neverForget',
    action: 'add' | 'remove',
    sentence?: string,
    shouldTranslate?: boolean,
  ]
> {
  public readonly key = 'runDeckAction';
}
