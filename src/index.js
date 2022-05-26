import './sass/main.scss';
import imgCardTmpl from './templates/img-card.hbs';
import PixabayApiService from './js/api-pixabay';
import { Notify } from 'notiflix';
// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const myPixabay = new PixabayApiService();
const simplelightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  myPixabay.query = e.currentTarget.elements.searchQuery.value;
  myPixabay.resetPage();

  try {
    const imgs = await myPixabay.fetchImgs();

    if (myPixabay.numOfResults === 0) {
      throw 'Sorry, there are no images matching your search query. Please try again.';
    }

    Notify.info(`Hooray! We found ${myPixabay.numOfResults} images.`);

    renderImgCards(imgs);
    simplelightbox.refresh();
  } catch (msg) {
    Notify.failure(msg);
  }
}

function renderImgCards(imgs) {
  refs.gallery.insertAdjacentHTML('beforeend', imgCardTmpl(imgs));
}
