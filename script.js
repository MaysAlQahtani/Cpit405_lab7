
const ACCESS_KEY = 'lC8yelpfZcMnkq-DM9YX_1DFvUT4zqjhzpGE_DfBNRE'; 

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const methodSelect = document.getElementById('methodSelect');
const imageContainer = document.getElementById('imageContainer');


searchBtn.addEventListener('click', triggerSearch);

searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        triggerSearch();
    }
});





function triggerSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    const selectedMethod = methodSelect.value;
    imageContainer.innerHTML = '<p class="message">Loading images...</p>';

    if (selectedMethod === 'xhr') {
        fetchWithXHR(query);
    } else if (selectedMethod === 'promise') {
        fetchWithPromise(query);
    } else if (selectedMethod === 'async') {
        fetchWithAsyncAwait(query);
    }
}





function displayImages(images) {
    imageContainer.innerHTML = ''; 

    if (images.length === 0) {
        imageContainer.innerHTML = '<p class="message">No images found for this search.</p>';
        return;
    }

    images.forEach(image => {
        const imgElement = document.createElement('img');
        
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Unsplash Image';
        imgElement.className = 'grid-item'; 
        
        imageContainer.appendChild(imgElement);
    });
}






function fetchWithXHR(query) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.unsplash.com/search/photos?query=${query}`;
    
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', `Client-ID ${ACCESS_KEY}`);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            displayImages(responseData.results);
        } else {
            imageContainer.innerHTML = '<p class="message">XHR Request failed.</p>';
            console.error('XHR Error:', xhr.status);
        }
    };
    
    xhr.onerror = function() {
        imageContainer.innerHTML = '<p class="message">Network error occurred.</p>';
    };

    xhr.send();
}






function fetchWithPromise(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Client-ID ${ACCESS_KEY}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayImages(data.results);
    })
    .catch(error => {
        imageContainer.innerHTML = '<p class="message">Promise Fetch failed.</p>';
        console.error('Promise Error:', error);
    });
}






async function fetchWithAsyncAwait(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Client-ID ${ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayImages(data.results);

    } catch (error) {
        imageContainer.innerHTML = '<p class="message">Async/Await Fetch failed.</p>';
        console.error('Async/Await Error:', error);
    }
}
