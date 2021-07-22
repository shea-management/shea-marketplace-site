const domain = 'http://localhost:4242/';
const productLimit = 5;

function loadPage() {

    // GET PRICE OPTIONS
    fetch(domain + 'prices')
        .then(response => response.json())
        .then(data => {
            form = document.getElementById('search-price');
            form.innerHTML = '';
            for(price of data) {
                input = document.createElement('input');
                input.type = 'radio';
                input.id = price[0];
                input.name = 'price';

                if (price[0] == 'price-any') { input.checked = true; }

                label = document.createElement('label');
                label.htmlFor = price[0];
                label.innerHTML = price[1];

                br = document.createElement('br');

                form.appendChild(input);
                form.appendChild(label);
                form.appendChild(br);
            }
        });

    // GET CATEGORY OPTIONS
    fetch(domain + 'categories')
        .then(response => response.json())
        .then(data => {

            // UPDATE DOM
            form = document.getElementById('search-category');
            form.innerHTML = '';
            for(category of data) {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.id = 'cat-' + category;
                input.name = 'category';
                input.checked = true;

                label = document.createElement('label');
                label.htmlFor = 'cat-' + category;
                label.innerHTML = category;

                br = document.createElement('br');

                form.appendChild(input);
                form.appendChild(label);
                form.appendChild(br);
            }

            // GET TOP PRODUCTS
            search();
        });
}

function createProductCards(data) {

    console.log(data);

    // ASSEMBLE VARIABLES
    productContainer = document.getElementById('product-container');
    
    // CLEAR EXISTING VIEW
    productContainer.innerHTML = '';

    // EMPTY STATE
    if (data.length == 0) {
        var p = document.createElement('p');
        p.innerHTML = "This search didn't return any results! Try something with broader search terms.";
        productContainer.appendChild(p);
        return;
    }

    // LOOP THROUGH OBJECTS
    for (product of data) {
        
        // CREATE DOM
        var productCard = document.createElement('a');
        var cardTop = document.createElement('div');
        var cardBottom = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.href = '/product.html?productid=' + product.id + '&itemid=0';
        cardTop.classList.add('product-card-top');
        cardBottom.classList.add('product-card-bottom');
        
        var img = document.createElement('img');
        img.src = domain + product.thumbnail_URL;
        cardTop.appendChild(img);

        var h2 = document.createElement('h2');
        h2.innerText = product.name;
        cardBottom.appendChild(h2);
        var h4 = document.createElement('h4');

        var price;
        if (product.items.length > 1) {
            price = 'From $';
        } else {
            price = '$'
        }
        price += product.items[0].price_AUD;

        h4.innerText = price + ' AUD | ' + product.type;
        cardBottom.appendChild(h4);
        var p = document.createElement('p');
        p.innerText = product.desc_short;
        cardBottom.appendChild(p);
        
        var cardChips = document.createElement('div');
        cardChips.classList.add('product-card-chips');

        for (cat of product.categories) {
            var chip = document.createElement('div');
            chip.innerText = cat;
            cardChips.appendChild(chip);
        }
        cardBottom.appendChild(cardChips);

        productCard.appendChild(cardTop);
        productCard.appendChild(cardBottom);
        productContainer.appendChild(productCard);
    }
}

function search() {

    // ASSEMBLE VARIABLES
    var searchQuery = {
        'sort_order' : '',
        'price' : '',
        'categories' : []
    }

    for (input of document.getElementById('search-sort').children) {
        if (input.name == 'sort' && input.checked) { searchQuery.sort_order = input.id }
    }

    for (input of document.getElementById('search-price').children) {
        if (input.name == 'price' && input.checked) { searchQuery.price = input.id }
    }

    for (input of document.getElementById('search-category').children) {
        if (input.name == 'category' && input.checked) { searchQuery.categories.push(input.id) }
    }

    console.log(searchQuery);

    fetch(domain + 'get-products/?limit=' + productLimit + '&query=' + JSON.stringify(searchQuery))
        .then(response => response.json())
        .then(data => createProductCards(data));
}