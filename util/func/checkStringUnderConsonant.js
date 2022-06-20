export default function checkStringUnderConsonant(word) {
  if (!word || typeof word !== 'string') return;

  const lastLetter = word[word.length - 1];
  const uni = lastLetter.charCodeAt(0);
  if (uni < 44032 || uni > 55203) return null;

  return (uni - 44032) % 28 != 0;
}