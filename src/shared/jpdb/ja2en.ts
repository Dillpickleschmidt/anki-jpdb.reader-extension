import { JPDBja2enRequest, JPDBRequestOptions } from './api.types';
import { request } from './request';

export const getEnglishTranslation = async (
  text: string,
  options?: JPDBRequestOptions,
): Promise<string> => {
  // Changed return type to Promise<string>
  const payload: JPDBja2enRequest = {
    text,
  };
  const response = await request('ja2en', payload, options);

  return response.text;
};
