const STORAGE_KEY = "citsilaer-site-content";
const defaultContent = window.DEFAULT_SITE_CONTENT || {};
const savedContent = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {};
const siteContent = {
  ...defaultContent,
  ...savedContent,
  photos: defaultContent.photos || [],
  coverImage: defaultContent.coverImage || "./assets/film/cover.jpg"
};

const photoItems = siteContent.photos || [];
const writingItems = siteContent.writingItems || [];

const views = document.querySelectorAll(".view");
const photoLayout = document.getElementById("photo-layout");
const writingList = document.getElementById("writing-list");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const textModal = document.getElementById("text-modal");
const textModalBody = document.getElementById("text-modal-body");
const backgroundImage = document.querySelector(".background-image");
const aboutLine = document.querySelector(".about-line");
const socialList = document.querySelector(".social-list");

let currentPhotoIndex = 0;
let audioContext;
let filmNoiseBuffer;

function playClickSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const now = audioContext.currentTime;

  if (!filmNoiseBuffer) {
    filmNoiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.12, audioContext.sampleRate);
    const channelData = filmNoiseBuffer.getChannelData(0);

    for (let i = 0; i < channelData.length; i += 1) {
      channelData[i] = (Math.random() * 2 - 1) * (1 - i / channelData.length);
    }
  }

  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = filmNoiseBuffer;

  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(1300, now);
  noiseFilter.Q.setValueAtTime(0.8, now);

  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.038, now + 0.008);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

  const thump = audioContext.createOscillator();
  thump.type = "triangle";
  thump.frequency.setValueAtTime(92, now);
  thump.frequency.exponentialRampToValueAtTime(55, now + 0.07);

  const thumpGain = audioContext.createGain();
  thumpGain.gain.setValueAtTime(0.0001, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.032, now + 0.01);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioContext.destination);

  thump.connect(thumpGain);
  thumpGain.connect(audioContext.destination);

  noiseSource.start(now);
  noiseSource.stop(now + 0.1);
  thump.start(now);
  thump.stop(now + 0.09);
}

function bindSoundTargets() {
  document.querySelectorAll(".sound-target").forEach((element) => {
    element.addEventListener("click", playClickSound);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        playClickSound();
      }
    });
  });
}

function showView(viewId) {
  views.forEach((view) => {
    const isActive = view.id === viewId;
    view.classList.toggle("is-active", isActive);
    view.hidden = !isActive;
  });
}

function renderSiteMeta() {
  document.title = siteContent.siteTitle || "CITSILAER";

  if (siteContent.coverImage) {
    backgroundImage.style.backgroundImage = `url("${siteContent.coverImage}")`;
  }

  aboutLine.textContent = siteContent.aboutLine || "一个人";
  socialList.innerHTML = (siteContent.socials || [])
    .map(
      (item) => `
        <a class="social-link sound-target" href="${item.url}" target="_blank" rel="noreferrer">
          ${item.label}
        </a>
      `
    )
    .join("");
}

function renderPhotos() {
  const squareItems = photoItems.filter((item) => item.orientation === "square");
  const landscapeItems = photoItems.filter((item) => item.orientation === "landscape");

  const renderGroup = (items, className) =>
    `
      <div class="photo-strip ${className}">
        ${items
          .map((item) => {
            const index = photoItems.findIndex((photo) => photo.src === item.src);

            return `
              <button
                class="photo-card sound-target ${item.orientation === "landscape" ? "is-landscape" : ""}"
                type="button"
                data-photo-index="${index}"
                aria-label="open photo ${index + 1}"
              >
                <img src="${item.src}" alt="${item.alt}" loading="lazy" />
              </button>
            `;
          })
          .join("")}
      </div>
    `;

  photoLayout.innerHTML = `
    ${squareItems.length ? renderGroup(squareItems, "photo-strip-portrait") : ""}
    ${landscapeItems.length ? renderGroup(landscapeItems, "photo-strip-landscape") : ""}
  `;
}

function renderWriting() {
  writingList.innerHTML = writingItems
    .map(
      (item, index) => `
        <button class="writing-item sound-target" type="button" data-text-index="${index}">
          ${item.preview}
        </button>
      `
    )
    .join("");
}

function openLightbox(index) {
  currentPhotoIndex = index;
  const activeItem = photoItems[currentPhotoIndex];
  lightboxImage.src = activeItem.src;
  lightboxImage.alt = activeItem.alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

function stepLightbox(direction) {
  currentPhotoIndex = (currentPhotoIndex + direction + photoItems.length) % photoItems.length;
  openLightbox(currentPhotoIndex);
}

function openText(index) {
  textModalBody.textContent = writingItems[index].full;
  textModal.classList.add("is-open");
  textModal.setAttribute("aria-hidden", "false");
}

function closeText() {
  textModal.classList.remove("is-open");
  textModal.setAttribute("aria-hidden", "true");
}

renderSiteMeta();
renderPhotos();
renderWriting();
bindSoundTargets();

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.open);
  });
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => {
    showView("home");
  });
});

photoLayout.addEventListener("click", (event) => {
  const target = event.target.closest("[data-photo-index]");

  if (!target) {
    return;
  }

  openLightbox(Number(target.dataset.photoIndex));
});

writingList.addEventListener("click", (event) => {
  const target = event.target.closest("[data-text-index]");

  if (!target) {
    return;
  }

  openText(Number(target.dataset.textIndex));
});

document.querySelector("[data-close-lightbox]").addEventListener("click", closeLightbox);
document.querySelector("[data-lightbox-prev]").addEventListener("click", () => stepLightbox(-1));
document.querySelector("[data-lightbox-next]").addEventListener("click", () => stepLightbox(1));
document.querySelector("[data-close-text]").addEventListener("click", closeText);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

textModal.addEventListener("click", (event) => {
  if (event.target === textModal) {
    closeText();
  }
});

window.addEventListener("keydown", (event) => {
  if (lightbox.classList.contains("is-open")) {
    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  }

  if (textModal.classList.contains("is-open") && event.key === "Escape") {
    closeText();
  }
});
