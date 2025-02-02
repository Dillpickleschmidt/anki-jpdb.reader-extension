import { JPDBSetCardSentenceRequest, JPDBRequestOptions } from './api.types';
import { request } from './request';

export const setCardSentence = async (
  vid: number,
  sid: number,
  sentence: string,
  translation?: string,
  options?: JPDBRequestOptions,
): Promise<void> => {
  const payload: JPDBSetCardSentenceRequest = {
    vid,
    sid,
    sentence,
    translation,
  };

  await request('set-card-sentence', payload, options);
};
