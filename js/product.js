// const domain = 'http://localhost:4242/';    // DEV
const domain = 'https://shea-marketplace-server.herokuapp.com/'     // PRODUCTION
var productID;
var itemID;

function loadPage() {

    // GET PRODUCT INFO
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // CHECK IF HAS ID PARAM
    if(!urlParams.has('productid') || !urlParams.has('itemid')) {
        document.getElementById('loading-content').style.display = 'none';
        document.getElementById('loading-error').style.display = 'flex';
        return;
    }

    // STORE ID IN PAGE
    productID = urlParams.get(('productid'));
    itemID = urlParams.get(('itemid'));

    // SEND REQUEST TO SERVER
    fetch(domain + 'productinfo/?product_id=' + productID)
        .then(response => {
            
            // CHECK IF ANYTHING WAS RETURNED
            if (response.status != 200) {
                document.getElementById('loading-content').style.display = 'none';
                document.getElementById('loading-error').style.display = 'flex';
                return;
            }

            // INTERPRET RESPONSE
            response.json()
                .then(res => {
                    console.log(res);

                    // GET EXISTING ITEMS
                    var storedCart = window.localStorage.getItem('cart');

                    // SETUP CART
                    var cart = [];
                    if (storedCart == null || storedCart == '') {
                        cart = [];
                    } else {
                        cart = JSON.parse(storedCart);
                    }

                    // CHECK IF IN CART
                    for (item of cart) {
                        console.log(item);
                        if (item.product_id == productID && item.item_id == itemID) { 
                            cartButton = document.getElementById('product-cart');
                            cartButton.classList.add('disabled');
                            cartButton.onclick = '';
                            break;
                        }
                    }

                    // PRODUCT VIEW
                    document.getElementById('product-name').innerText = res.name;
                    document.getElementById('product-price').innerText = '$' + res.items[itemID].price_AUD + ' AUD | ' + res.items[itemID].item_name;
                    document.getElementById('product-desc-verbose').innerHTML = res.desc_verbose;
                    document.getElementById('product-img').src = domain + res.items[itemID].image_URL;

                    // ITEMS
                    var itemSelect = document.getElementById('item-select');

                    if (res.items.length != 1) {
                        document.getElementById('item-desc').innerHTML = res.items[itemID].desc;
                        itemSelect.innerHTML = '';
                        for (item of res.items) {
                            var row = document.createElement('a');
                            row.classList.add('row');
                            if (item.id == itemID) { row.classList.add('highlight'); }
                            if (item.suggested == true) { row.classList.add('suggested'); }
                            row.href = 'http://127.0.0.1:5500/product.html?productid=' + productID + '&itemid=' + item.id;
                            
                            var img = document.createElement('img');
                            img.src = domain + item.thumbnail_URL;

                            row.appendChild(img);
                            itemSelect.appendChild(row);
                        }
                    } else {
                        itemSelect.style.display = 'none';
                        document.getElementById('item-desc-head').style.display = 'none';
                        document.getElementById('item-desc').style.display = 'none';
                    }

                    // PRODUCT INFO
                    for (info of res.info) {
                        var row = document.createElement('div');
                        row.classList.add('info-row');
                        
                        var h3 = document.createElement('h3');
                        h3.innerText = info[0];
                        
                        var p = document.createElement('p');
                        p.innerText = info[1];

                        row.appendChild(h3);
                        row.appendChild(p);
                        document.getElementById('product-info').appendChild(row);
                    }

                    // MERCHANT INFO
                    fetch(domain + 'merchantinfo/?id=' + res.merchant_id)
                        .then(merchantInfo => {
                            merchantInfo.json() 
                                .then(mI => {

                                    console.log(mI);
                                    document.getElementById('merchant-img').src = domain + mI.image_URL
                                    document.getElementById('merchant-info').innerHTML = mI.bio;
                                    document.getElementById('merchant-website').href = mI.website_URL;

                                    
                                });
                        });

                    
                    // SHOW PAGE
                    document.getElementById('loading-content').style.display = 'none';
                    document.getElementById('loading-error').style.display = 'none';
                    document.getElementById('loaded-content').style.display = 'unset';
                });
        });
}



// -- ADD ITEM TO CART -- 
function addToCart() {

    // GET EXISTING ITEMS
    var storedCart = window.localStorage.getItem('cart');

    // SETUP CART
    var cart = [];
    if (storedCart == null || storedCart == '') {
        cart = [];
    } else {
        cart = JSON.parse(storedCart);
    }

    // ADD ITEM ID TO BAG & SAVE
    payload = {
        'product_id' : productID,
        'item_id' : itemID
    }
    cart.push(payload);
    window.localStorage.setItem('cart', JSON.stringify(cart));

    // RELOAD PAGE
    location.reload();
}



// -- PURCHASE IMMEDIATELY
function purchaseNow() {

    // ASSEMBLE CART WITH ONE ITEM
    cart = [{'product_id' : productID, 'item_id' : itemID}];

    // CREATE CHECKOUT SESSION
    fetch(domain + 'create-checkout-session/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.href = data;
        });
}