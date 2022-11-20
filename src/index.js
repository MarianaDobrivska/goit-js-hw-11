import axios from 'axios';
import Notiflix from 'notiflix';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';

refs.loadMoreBtn.classList.add('visually-hidden');

const pixabay = new PixabayAPI();

async function handleSubmit(event) {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.target;

  const currentQuery = searchQuery.value.trim();

  if (!currentQuery) {
    refs.galleryEl.innerHTML = '';
    Notiflix.Notify.warning('Please enter your query');
    return;
  }

  pixabay.query = currentQuery;
  refs.galleryEl.innerHTML = '';
  pixabay.resetPage();
  try {
    const { hits, totalHits } = await pixabay.getPhotos();
    if (hits.length === 0) {
      refs.galleryEl.innerHTML = '';
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    pixabay.totalPhotos = totalHits;
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
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
    const showMore = pixabay.hasMorePhotos();

    if (showMore) {
      refs.loadMoreBtn.classList.remove('visually-hidden');
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.warning('Something went wrong. Please try again!');
  }
  event.target.reset();
}

async function handleLoadMoreClick(event) {
  pixabay.incrementPage();

  const showMore = pixabay.hasMorePhotos();

  if (!showMore) {
    refs.loadMoreBtn.classList.add('visually-hidden');
  }

  try {
    const { hits } = await pixabay.getPhotos();
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
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  } catch (error) {
    Notiflix.Notify.warning('Something went wrong. Please try again!');
  }
}

refs.formEl.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreClick);
