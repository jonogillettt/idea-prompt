import axios from "axios";

const cache = {};

export const defineWord = async (word) => {
  if (cache[word]) return cache[word];

  const res = await axios.get(
    `https://cors-anywhere.herokuapp.com/en.wiktionary.org/w/api.php?action=parse&page=${word.toLowerCase()}&formatversion=2&format=json`
  );
  if (res.status === 200) {
    cache[word] = res.data.parse.text;
  }
  return res.data.parse.text;
};
