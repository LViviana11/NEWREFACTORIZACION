'use strict'




const categories = [ //array de categorias
    { value: 'business', text: 'Negocios' }, //cada categ es un objeto que tiene 2 atributos 
    { value: 'entertainment', text: 'Entretenimiento' },
    { value: 'general', text: 'General' },
    { value: 'health', text: 'Salud' },
    { value: 'science', text: 'Ciencia' },
    { value: 'sports', text: 'Deportes' },
    { value: 'technology', text: 'Tecnología' }
]


document.addEventListener('DOMContentLoaded',async event => {
    const countries=await leerJSON('./data/countries.json');
    const initialIndex = 2 //para que se muestre General
    const initialIndexCountri = 0

    const categoryList = populateSelectList('#categories', categories, 'value', 'text')

    const countriesList = populateSelectList('#countries', countries, 'code', 'name') //recibe como 1er argumento el selector que me determina cual seleccionable voy a utilizar, el 2do corresponde a un array de elementos que pueden ser mostrados en el html, 3er damos el atributo el que va a servir de indice de lista
    categoryList.selectedIndex = initialIndex //hace que aparezca generales de primero
    countriesList.selectedIndex = initialIndexCountri //hace que aparezca colombia de primero
    filterNews(categoryList.value, countriesList.value)
    

    categoryList.addEventListener('change', e => { //me permite ver cuando estoy cambiando de opcion
        const list = e.target
        const item = list.options[list.selectedIndex]
        
        console.log(`selecciono el item [${list.selectedIndex}] - (${item.value} - ${item.text})`); //me dice q elemento es el que selecciono
        //PARA QUE VAYA CAMBIANDO LOS DIFERENTES TIPOS DE NOTICIAS
        console.log(categories[list.selectedIndex]);
        console.log(document.querySelector("#countries").value);
        filterNews(categories[list.selectedIndex].value, document.querySelector("#countries").value) // le mandamos la categoria la cual va a estar indicada por el indice y el indice de un elemento esta en el objeto list, referenciado por un atributo que se llama selectedIndex
    })
    countriesList.addEventListener('change', e => { //me permite ver cuando estoy cambiando de opcion
        const list = e.target
        const item = list.options[list.selectedIndex]
        console.log(`selecciono el item [${list.selectedIndex}] - (${item.value} - ${item.text})`); //me dice q elemento es el que selecciono
        //PARA QUE VAYA CAMBIANDO LOS DIFERENTES TIPOS DE NOTICIAS
        console.log(countries[list.selectedIndex]);
        console.log(document.querySelector("#categories").value);
        filterNews(document.querySelector("#categories").value, countries[list.selectedIndex].value) // le mandamos la categoria la cual va a estar indicada por el indice y el indice de un elemento esta en el objeto list, referenciado por un atributo que se llama selectedIndex
    })
    // showNews()


})

async function leerJSON(url) {
    let respuesta = await fetch(url);
    if (respuesta.ok) {
        return await respuesta.json();
    }
}

function populateSelectList(selector, items = [], value = '', text = '') {
    let list = document.querySelector(selector)
    list.options.length = 0
    items.forEach(item => list.add(new Option(item[text], item[value])))
    return list
}

function filterNews(category, country ){
    const apiKey = '6cb6c602597a491f9d6fbca641feda29'//reemplaceEstoPorSuAPIKey
    
    const language = 'es'
    const from = dayjs().format('YYYY-MM-DD') //desde que fecha 
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&language=${language}&category=${category}&from=${from}&apiKey=${apiKey}`
    
    const request = new Request(url)

    fetch (request)
        .then(response => response.json())
        .then(news => showNews(news)) // ESTOY CARGANDO LAS NOTICIAS QUE ME LLEGAN ------------- me permite ver que si estan llegando las noticias por consola
        .catch(error => console.log(error))
    
}

function showNews(news){ //para crear o mostrar una coleccion de articulos. MÉTODO CREADO PARA MOSTRAR LAS NOTICIAS
    if (news.status === 'ok'){
        document.querySelector('#news').innerHTML = '' // colocamos la capa en blanco para que se vuelvan a cargar las noticias de otro tipo
        //en otras palabras limpiamos la categoria existente
        news.articles.forEach(article => createArticle(article))
    }else{
        console.log("Tenemos Problemas");
    }

    

}
function createArticle(article) { //aqui esta creando las targetas 
    // article.urlToImage = null;
    // console.log(article.urlToImage);
    console.log(article);
    if (article.urlToImage == null || article.urlToImage == undefined){
        article.urlToImage = './resources/assets/images/noticias.png';
    }
    // article.author = null;
    if (article.author == null){
        article.author = "null";
    }
    const date = dayjs(article.publishedAt).format('YYYY-MM-DD hh:mm A') //para agregar fechas y horas

    const news = `
        <article class="rounded overflow-hidden shadow-lg">
            <a href="${article.urlToImage}" target="_blank" rel="noopener noreferrer">
                <div class="relative">
                    <img class="w-full" src="${article.urlToImage}">
                    <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                </div>
            </a>
        
            <div class=" px-1.5 py-4">
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out">
                    ${article.title}
                </a>
                <p class="text-gray-500 text-sm">
                    ${article.author}
                </p>
            </div>

            <div class="px-6 py-4 flex flex-row items-center">
                <span href="#" class="py-1 text-sm font-regular text-gray-900 mr-1 flex flex-row items-center">
                    <svg height="13px" width="13px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                        <g>
                            <g>
                                <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256
                                    c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128
                                    c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z"
                                />
                            </g>
                        </g>
                    </svg>
                    <span class="ml-1">${date}</span></span> 
            </div>
        </article>
    `
    document.querySelector('#news').insertAdjacentHTML('beforeend', news)//insertar antes del final de la capa news
}

