import * as Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown): Prismic.Client {
  const client = Prismic.createClient(process.env.PRISMIC_API_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  client.enableAutoPreviewsFromReq(req);

  return client;
}
