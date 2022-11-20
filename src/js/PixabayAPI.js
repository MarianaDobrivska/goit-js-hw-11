import axios from 'axios';

export class PixabayAPI {
  #page = 1;
  #query = '';
  #per_page = 40;
  #totalPhotos = 0;

  async getPhotos() {
    const params = {
      key: '31455017-154c201cdb83c0a22577e9bfb',
      q: this.#query,
      image_type: 'photo',
      orientation: 'horisontal',
      safesearch: true,
      per_page: this.#per_page,
      page: this.#page,
    };
    axios.defaults.baseURL = 'https://pixabay.com';
    const { data } = await axios.get(`/api/?`, { params });

    return data;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  setTotal(newTotal) {
    this.#totalPhotos = newTotal;
  }

  hasMorePhotos() {
    return this.#page < Math.ceil(this.#totalPhotos / this.#per_page);
  }
}
