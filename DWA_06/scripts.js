

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

const selectors = {
    listItems : document.querySelector('[data-list-items]'),
    searchGenres : document.querySelector('[data-search-genres]'),
    searchAuthors : document.querySelector('[data-search-authors]'),
    settingsTheme : document.querySelector('[data-settings-theme]'),
    listButton : document.querySelector('[data-list-button]'),
    searchCancel : document.querySelector('[data-search-cancel]'),
    searchOverlay : document.querySelector('[data-search-overlay]'),
    headerSearch : document.querySelector('[data-header-search]'),
    headerSettings : document.querySelector('[data-header-settings]'),
    searchTitle : document.querySelector('[data-search-title]'),
    settingsOverlay : document.querySelector('[data-settings-overlay]'),
    listClose : document.querySelector('[data-list-close]'),
    listActive : document.querySelector('[data-list-active]'),
    searchForm : document.querySelector('[data-search-form]'),
    settingsForm : document.querySelector('[data-settings-form]'),
    settingsCancel: document.querySelector('[data-settings-cancel]'),
    listMessage : document.querySelector('[data-list-message]'),
    listDescription : document.querySelector('[data-list-description]'),
    listBlur : document.querySelector('[data-list-blur]'),
    listImage : document.querySelector('[data-list-image]'),
    listSubtitle : document.querySelector('[data-list-subtitle]'),
    listTitle : document.querySelector('[data-list-title]'),

}

//const starting = document.createDocumentFragment()

// for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)){
    function createBookPreview(book) {
    const { author, id, image, title }  = book;
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `
    return(element);
    // starting.appendChild(element)
}

const starting = document.createDocumentFragment()

for (const book of matches.slice(0, BOOKS_PER_PAGE)){
    const previewElement =createBookPreview(book);
    starting.appendChild(previewElement);
}

selectors.listItems.appendChild(starting)

const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    genreHtml.appendChild(element)
}

selectors.searchGenres.appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}

selectors.searchAuthors.appendChild(authorsHtml)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    selectors.settingsTheme.value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    selectors.settingsTheme.value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

selectors.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
selectors.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 0

selectors.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

selectors.searchCancel.addEventListener('click', () => {
    selectors.searchOverlay.open = false
})

selectors.settingsCancel.addEventListener('click', () => {
    selectors.settingsOverlay.open = false
})

selectors.headerSearch.addEventListener('click', () => {
    selectors.searchOverlay.open = true 
    selectors.searchTitle.focus()
})

selectors.headerSettings.addEventListener('click', () => {
    selectors.settingsOverlay.open = true 
})

selectors.listClose.addEventListener('click', () => {
    selectors.listActive.open = false
})

selectors.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    selectors.settingsOverlay.open = false
})

selectors.searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        selectors.listMessage.classList.add('list__message_show')
    } else {
        selectors.listMessage.classList.remove('list__message_show')
    }

    selectors.listItems.innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const book of result.slice(0, BOOKS_PER_PAGE)) {
        // const element = document.createElement('button')
        // element.classList = 'preview'
        // element.setAttribute('data-preview', id)
    
        // element.innerHTML = `
        //     <img
        //         class="preview__image"
        //         src="${image}"
        //     />
            
        //     <div class="preview__info">
        //         <h3 class="preview__title">${title}</h3>
        //         <div class="preview__author">${authors[author]}</div>
        //     </div>
        // `
        const previewElement1 = createBookPreview(book)
        newItems.appendChild(previewElement1)
    }

    selectors.listItems.appendChild(newItems)
    selectors.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    selectors.listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    selectors.searchOverlay.open = false
})

selectors.listButton.addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for ( const book of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        // // const element = document.createElement('button')
        // // element.classList = 'preview'
        // // element.setAttribute('data-preview', id)
    
        // // element.innerHTML = `
        // //     <img
        // //         class="preview__image"
        // //         src="${image}"
        // //     />
            
        // //     <div class="preview__info">
        // //         <h3 class="preview__title">${title}</h3>
        // //         <div class="preview__author">${authors[author]}</div>
        // //     </div>
        // `
        const previewElement2 = createBookPreview(book)
        fragment.appendChild(previewElement2)
    }

    selectors.listItems.appendChild(fragment)
    page += 1
})

selectors.listItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        selectors.listActive.open = true
        selectors.listBlur.src = active.image
        selectors.listImage.src = active.image
        selectors.listTitle.innerText = active.title
        selectors.listSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        selectors.listDescription.innerText = active.description
    }
})