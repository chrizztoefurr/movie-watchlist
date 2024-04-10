const textInput = document.getElementById("text-input");
const btnEl = document.getElementById("btn");
const movieList = document.getElementById("movie-list");
const pulledList = document.getElementById("pulled-list")
const savedPulledList = document.getElementById("saved-pulled-list")
const savedNoList = document.getElementById("saved-no-list");
const savedMovieList = JSON.parse(localStorage.getItem("movie"));
let movieArray = []

function render(item) {
    movieList.innerHTML = item
}

function showMovieList() {
    showView(movieList)
    hideView(pulledList)
}

function hideMovieList() {
    showView(movieList)
    hideView(pulledList)
}

function showView(view) {
    view.style.display = 'flex'
}

function hideView(view) {
    view.style.display = 'disappear'
}

document.addEventListener("click", (e) => {
    if(e.target.id == "btn") {
        let movies = ""
        showMovieList()
        if(textInput.value) {
            fetch(`https://www.omdbapi.com/?s=${textInput.value}&apikey=c41ab2c0`)
                .then(res => res.json())
                .then(data => {
                    for(let item of data.Search) {
                        fetch(`https://www.omdbapi.com/?i=${item.imdbID}&apikey=c41ab2c0`)
                            .then(res => res.json())
                            .then(data => {
                                movies += `
                                    <div class="movie">
                                        <img src="${data.Poster}">
                                        <div class="section">
                                            <span>
                                                <h1>${data.Title}</h1>
                                                <p>Rating: ${data.imdbRating}</p>
                                            </span>
                                        <div class="section-two">
                                            <p>${data.Runtime}</p>
                                            <p>Genre: ${data.Genre}</p>
                                            <button class="Watchlist" id="Watchlist">
                                                Watchlist
                                            </button>
                                        </div>
                                        <span>
                                            <p class='summary'>${data.Plot}</p>
                                        </span>
                                        </div>
                                    </div>`
                                render(movies)                             
                            })
                     }
                })
        }
    } else if(e.target.id == 'Watchlist') {
        let parent = e.target.parentNode.parentNode.parentNode;
        let subparent = e.target.parentNode.parentNode;
        let subMoreParent = e.target.parentNode;
        
        const movieDetails = {
            'Poster':`${parent.children[0].src}`,
            'Title':`${subparent.children[0].children[0].textContent}`,
            'imdbRating':`${subparent.children[0].children[1].textContent}`,
            'Runtime':`${subMoreParent.children[0].textContent}`,
            'Genre':`${subMoreParent.children[1].textContent}`,
            'Plot':`${subparent.children[2].children[0].textContent}`
        }
        movieArray.push(movieDetails)
        localStorage.setItem("movie", JSON.stringify(movieArray))
    } else if(e.target.id == "Remove") {
        const movieIndex = Array.from(savedPulledList.children).findIndex(movie => movie.contains(e.target.closest(".movie")))
        if(movieIndex !== -1) {
            movieArray.splice(movieIndex, 1)
            localStorage.setItem("movie", JSON.stringify(movieArray))
            renderMovieList(movieArray)
        }
    }
})

function renderMovieList(movies) {
    let renderMovies = ''
    for(let data of movies) {
        renderMovies += `
            <div class="movie">
                <img src="${data.Poster}" alt="poster">
                <div class="section">
                    <span>
                        <h1>${data.Title}</h1>
                        <p>Rating: ${data.imdbRating}</p>
                    </span>
                    <div class="section-two">
                        <p>${data.Runtime}</p>
                        <p>Genre: ${data.Genre}</p>
                        <button class="Watchlist" id="Remove">
                            Remove
                        </button>
                    </div>
                    <span>
                        <p class='summary'>${data.Plot}</p>
                    </span>
                </div>
            </div>`
    }
    savedPulledList.innerHTML = renderMovies
}

function renderSavedMovies() {
    movieArray = savedMovieList
    renderMovieList(movieArray)
}