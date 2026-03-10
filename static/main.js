// Retrieve the API key from Flask (injected via window object) or fallback to DEMO_KEY.
const API_KEY = window.NASA_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// DOM Elements
const datePicker = document.getElementById('date-picker');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnToday = document.getElementById('btn-today');

const heroSection = document.getElementById('hero');
const mediaContainer = document.getElementById('media-container');
const apodTitle = document.getElementById('apod-title');
const apodDateDisplay = document.getElementById('apod-date');

const apodExplanation = document.getElementById('apod-explanation');
const hdLink = document.getElementById('hd-link');

const galleryGrid = document.getElementById('gallery-grid');

// Minimum date allowed by APOD API
const MIN_DATE = new Date('1995-06-16');

// Utilities
const formatDateForAPI = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

// Application State
let currentDate = new Date(); // Start with today
let isFetching = false;
const apodCache = new Map(); // Cache to store fetched APOD data

// Initialize
function init() {
    // Set max date for picker to today
    const todayStr = formatDateForAPI(new Date());
    datePicker.max = todayStr;

    // Event Listeners
    datePicker.addEventListener('change', (e) => {
        if (e.target.value) {
            changeDate(new Date(e.target.value));
        }
    });

    btnPrev.addEventListener('click', () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        changeDate(newDate);
    });

    btnNext.addEventListener('click', () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        changeDate(newDate);
    });

    btnToday.addEventListener('click', () => {
        changeDate(new Date());
    });

    // Initial load
    changeDate(currentDate);
    fetchGallery();
}

async function fetchAPOD(date) {
    try {
        const dateStr = formatDateForAPI(date);

        // Return from cache if available
        if (apodCache.has(dateStr)) {
            return apodCache.get(dateStr);
        }

        const url = `${BASE_URL}?api_key=${API_KEY}&date=${dateStr}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        apodCache.set(dateStr, data); // Store in cache
        return data;
    } catch (error) {
        console.error("Failed to fetch APOD data", error);
        return null;
    }
}

async function changeDate(newDate) {
    if (isFetching) return;

    // Validate bounds
    if (newDate < MIN_DATE) newDate = new Date(MIN_DATE);
    if (newDate > new Date()) newDate = new Date();

    currentDate = newDate;

    // Update controls
    const dateStr = formatDateForAPI(currentDate);
    datePicker.value = dateStr;

    const todayStr = formatDateForAPI(new Date());
    btnNext.disabled = dateStr === todayStr;
    btnPrev.disabled = newDate.getTime() === MIN_DATE.getTime();

    // Fetch new data
    updateUIForLoading(true);
    const data = await fetchAPOD(currentDate);
    renderAPOD(data);
    updateUIForLoading(false);
}

function updateUIForLoading(isLoading) {
    isFetching = isLoading;
    if (isLoading) {
        heroSection.classList.add('loading');
    } else {
        heroSection.classList.remove('loading');
    }
}

function renderAPOD(data) {
    if (!data) {
        apodTitle.textContent = "Error al Cargar Datos";
        apodDateDisplay.textContent = "";
        apodExplanation.textContent = "Por favor, inténtalo de nuevo más tarde. Si estás usando la clave por defecto DEMO_KEY, podrían aplicarse límites de velocidad de petición.";
        return;
    }

    // Handle Media: Image vs Video
    mediaContainer.innerHTML = '';
    if (data.media_type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.allowFullscreen = true;
        iframe.title = data.title;
        mediaContainer.appendChild(iframe);
    } else {
        const img = document.createElement('img');
        img.src = data.url;
        img.alt = data.title;
        mediaContainer.appendChild(img);
    }

    // Reset animations by triggering a reflow
    apodTitle.style.animation = 'none';
    apodDateDisplay.style.animation = 'none';
    void apodTitle.offsetWidth; /* trigger reflow */
    apodTitle.style.animation = null;
    apodDateDisplay.style.animation = null;

    apodTitle.textContent = data.title;
    apodDateDisplay.textContent = formatDateDisplay(data.date);
    apodExplanation.textContent = data.explanation;

    if (data.hdurl) {
        hdLink.href = data.hdurl;
        hdLink.classList.remove('hidden');
    } else {
        hdLink.classList.add('hidden');
    }
}

function formatDateDisplay(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
}

// Gallery specific code
async function fetchGallery() {
    galleryGrid.innerHTML = '<p class="loading-text">Cargando imágenes recientes...</p>';
    try {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        const startStr = formatDateForAPI(start);
        const endStr = formatDateForAPI(end);

        // The API supports start_date and end_date param!
        const url = `${BASE_URL}?api_key=${API_KEY}&start_date=${startStr}&end_date=${endStr}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch gallery");

        const data = await response.json();

        // Seed the cache with gallery items
        data.forEach(item => {
            if (item && item.date) {
                apodCache.set(item.date, item);
            }
        });

        renderGallery(data.reverse()); // Reverse to show latest first
    } catch (error) {
        console.error(error);
        galleryGrid.innerHTML = '<p class="error-text">Fallo al cargar la galería.</p>';
    }
}

function renderGallery(items) {
    galleryGrid.innerHTML = '';

    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'gallery-item';

        if (item.media_type === 'video') {
            itemEl.classList.add('video-item');
            itemEl.innerHTML = `
        <svg class="video-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        <div class="gallery-item-overlay">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-date">${formatDateDisplay(item.date)}</div>
        </div>
      `;
        } else {
            itemEl.innerHTML = `
        <img src="${item.url}" alt="${item.title}" loading="lazy">
        <div class="gallery-item-overlay">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-date">${formatDateDisplay(item.date)}</div>
        </div>
      `;
        }

        itemEl.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            changeDate(new Date(item.date));
        });

        galleryGrid.appendChild(itemEl);
    });
}

// Start application
init();
