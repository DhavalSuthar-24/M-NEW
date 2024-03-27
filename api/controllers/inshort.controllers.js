import inshorts from 'inshorts-api';

const categories = [
  'national (India)',
  'business',
  'sports',
  'world',
  'politics',
  'technology',
  'startup',
  'entertainment',
  'miscellaneous',
  'hatke (unusual)',
  'science',
  'automobile'
];

function getRandomInshortsNews(callback) {
  const randomIndex = Math.floor(Math.random() * categories.length);
  const randomCategory = categories[randomIndex];

  const options = {
    lang: 'en',
    category: randomCategory,
    numOfResults: 5
  };

  inshorts.get(options, function(result) {
    callback(result);
  });
}

export default getRandomInshortsNews;
