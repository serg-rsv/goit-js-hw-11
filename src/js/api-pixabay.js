const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '27629620-bf8dbf1d2d77ad53435eb2e20';

export default class PixabayApiService {
  #totalHits;
  #searchQuery;

  constructor() {
    this.#searchQuery = '';
    this.imageType = 'photo';
    this.orientation = 'horizontal';
    this.safeSearch = 'true';
    this.perPage = 40;
    this.page = 1;
  }
  /**
   * Fetch images from Pixabay.
   * @returns array of objects of images.
   */
  fetchImgs() {
    const reqParams = {
      key: API_KEY,
      q: this.#searchQuery,
      image_type: this.imageType,
      orientation: this.orientation,
      safesearch: this.safeSearch,
      per_page: this.perPage,
      page: this.page,
    };

    return axios.get(BASE_URL, { params: reqParams }).then(({ data }) => {
      console.log(this);
      console.log(data);

      this.#numOfResults = data.totalHits;
      this.page += 1;
      // if (this.#numOfResults > 0) {
      return data.hits;
      //   .map(
      //   ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      //     return { webformatURL, largeImageURL, tags, likes, views, comments, downloads };
      //   }
      // );
      // }
    });
  }
  /**
   * Set request parameter 'page' to 1.
   */
  resetPage() {
    this.page = 1;
  }
  /**
   * Get search query value.
   */
  get query() {
    return this.#searchQuery;
  }
  /**
   * Set search query value.
   */
  set query(newQuery) {
    this.#searchQuery = newQuery;
  }
  /**
   * Return the number of images found.
   */
  get numOfResults() {
    return this.#totalHits;
  }

  set #numOfResults(num) {
    this.#totalHits = num;
  }
}
