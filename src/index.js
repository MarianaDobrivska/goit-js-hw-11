import axios from 'axios';
import Notiflix from 'notiflix';
const galleryEl = document.querySelector('.gallery');
const buttonEl = document.querySelector('button');
const inputEl = document.querySelector('input');
const formEl = document.querySelector('form');

axios.defaults.baseURL = 'https://pixabay.com';

async function handleInput(e) {
  const inputValue = formEl.elements.searchQuery.value;
  console.log(inputValue);

  const getPhotos = async inputValue => {
    const params = {
      key: '31455017-154c201cdb83c0a22577e9bfb',
      q: inputValue,
      image_type: 'photo',
      orientation: 'horisontal',
      safesearch: true,
    };
    const { data } = await axios.get(`/api/?`, { params });
    return data;
  };
  return getPhotos(inputValue);
}

async function createMarkup() {
  return await handleInput().then(({ hits }) => {
    const markup = hits
      .map(({ likes, tags, webformatURL, views, comments, downloads }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      })
      .join('');
    galleryEl.innerHTML = markup;
  });
}

// const formData = new FormData(formEl);
// for (const value of formData.values()) {
//   console.log(value);
// }

async function onButtonClick(event) {
  event.preventDefault();
  try {
    const { hits } = await handleInput();
    if (hits.length === 0) {
      galleryEl.innerHTML = '';
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const markup = await createMarkup();
  } catch (error) {
    console.log(error);
  }
}

buttonEl.addEventListener('click', onButtonClick);
inputEl.addEventListener('input', handleInput);
