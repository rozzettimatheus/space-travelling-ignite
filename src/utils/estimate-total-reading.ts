import { RichText } from 'prismic-dom';

type Text = {
  heading: string;
  body: any[];
};

type ParsedText = {
  heading: string;
  body: string;
};

const EXTRACT_WORDS_REGEX = /\S+/g;
const DEFAULT_WORDS_PER_MINUTE = 200;

const extractWords = (content: Text): ParsedText => {
  return {
    heading: content.heading,
    body: RichText.asText(content.body),
  };
};

export function estimateTotalReading(textArray: Text[]): number {
  const totalWordsCount = textArray.reduce((acc, value) => {
    const { heading, body } = extractWords(value);

    const headingTotalWords = String(heading).match(EXTRACT_WORDS_REGEX).length;
    const bodyTotalWords = body.match(EXTRACT_WORDS_REGEX).length;

    return acc + headingTotalWords + bodyTotalWords;
  }, 0);

  return Math.ceil(totalWordsCount / DEFAULT_WORDS_PER_MINUTE);
}
