import Notiflix from "notiflix";
const axios = require("axios");
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import "./css/styles.css";

console.log("Hi, you there!");
const API_KEY = "33411326-e3b74484d09501fb125cb8795";
let pageNumber = 1;
let perPage = 40;

const searchForm = document.querySelector(".search-form");
const searchBtn = document.querySelector(".search-btn");
const imagesBox = document.querySelector(".gallery");
const loadMoreBox = document.querySelector(".loadmore-box");
const loadMoreBtn = document.querySelector(".load-more");
loadMoreBox.style.display = "none";

searchBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  imagesBox.innerHTML = "";

  pageNumber = 1;
  console.log("Searching...");

  fetchImages()
    .then((images) => {
      renderImagesList(images);
      pageNumber += 1;
      const totalHits = parseInt(images.totalHits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
      if (pageNumber > 1 && totalHits > perPage) {
        loadMoreBox.style.display = "flex";
      } else {
        loadMoreBox.style.display = "none";
      }
    })
    .catch((error) => console.log(error));
});

loadMoreBtn.addEventListener("click", () => {
  fetchImages()
    .then((images) => {
      pageNumber += 1;
      renderImagesList(images);

      const { height: cardHeight } =
        imagesBox.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
      let totalHits = parseInt(images.totalHits);
      let limitPage = totalHits / perPage;
      if (pageNumber >= Math.ceil(limitPage) + 1) {
        console.log(Math.ceil(limitPage));
        loadMoreBox.style.display = "none";
      }
    })
    .catch((error) => console.log(error));
});

const fetchImages = async () => {
  let inputQuery = searchForm.searchQuery.value.trim();
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: inputQuery,
    per_page: perPage,
    page: pageNumber,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
  });
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );
    return response.data;
  } catch (err) {
    Notiflix.Notify.failure("Someting happened...");
    console.error(err);
  }
};

function renderImagesList(images) {
  const totalHits = parseInt(images.totalHits);
  if (totalHits > 0) {
    const markup = images.hits
      .map((image) => {
        return `
          <div class="photo-card">
            <a class="gallery__item" href="${image.largeImageURL}">
              <img class="image" src="${image.webformatURL}"
            
              alt="${image.tags}"
              loading="lazy" />
              </a>
              <div class="info">
              <p class="info-item">
                <b>Likes</b>
               <b>${image.likes}</b>
              </p>
              <p class="info-item">
                <b>Views</b>
                <b>${image.views}</b>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <b>${image.comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads</b>
              <b>${image.downloads}</b>
              </p>
        </div>
      </div>
              `;
      })
      .join("");
    // imagesBox.innerHTML = markup;
    imagesBox.insertAdjacentHTML("beforeend", markup);

    let simpleLBoxItem = new SimpleLightbox(".photo-card a", {
      // captionsData: "alt",
      // captionDelay: 400,
    });
    simpleLBoxItem.on("show.simplelightbox", function (event) {});
  } else {
    Notiflix.Notify.info(
      "Sorry, there are no images matching your search query. Please try again."
    );
  }
}

// blue red light night summer flower
