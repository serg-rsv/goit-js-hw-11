import './sass/main.scss';
import imgCardTmpl from './templates/img-card.hbs';
import PixabayApiService from './js/api-pixabay';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const myPixabay = new PixabayApiService();
const simplelightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();

  myPixabay.query = e.currentTarget.elements.searchQuery.value;
  myPixabay.resetPage();
  refs.gallery.innerHTML = '';
  refs.searchForm.reset();

  fetchAndRenderImgs();
}

async function onLoadMore() {
  await fetchAndRenderImgs();
  smoothScroll();
}

function renderImgCards(imgs) {
  refs.gallery.insertAdjacentHTML('beforeend', imgCardTmpl(imgs));
}

async function fetchAndRenderImgs() {
  try {
    const imgs = await myPixabay.fetchImgs();

    if (myPixabay.numOfResults === 0) {
      refs.gallery.innerHTML = '';
      refs.loadMoreBtn.classList.add('is-hidden');
      throw new Error('Sorry, there are no images matching your search query. Please try again.');
    }

    Notify.info(`Hooray! We found ${myPixabay.numOfResults} images.`);

    if (myPixabay.isLastPage()) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }

    renderImgCards(imgs);
    simplelightbox.refresh();
  } catch (error) {
    Notify.failure(error.message);
  }
}

function smoothScroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
