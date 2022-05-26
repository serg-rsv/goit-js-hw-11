import './sass/main.scss';
import imgCardTmpl from './templates/img-card.hbs';
import PixabayApiService from './js/api-pixabay';
import { Notify } from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const myPixabay = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  myPixabay.query = e.currentTarget.elements.searchQuery.value;
  myPixabay.resetPage();
  myPixabay.fetchImgs().then(renderImgCards);
}

function renderImgCards(imgs) {
  refs.gallery.insertAdjacentHTML('beforeend', imgCardTmpl(imgs));
}
