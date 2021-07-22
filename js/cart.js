const domain = 'http://localhost:4242/';
var cart;

// -- LOAD THE PAGE -- 
function loadPage() {

    // GET ITEMS IN CART
    var loadedCart = window.localStorage.getItem('cart');

    // Remove Existing Cart Items
    var cartContents = document.getElementById('cart-contents');
    cartContents.innerHTML = '';

    // DISPLAY EMPTY STATE
    if (loadedCart == null || loadedCart == '[]' || loadedCart == []) {
        
        // Cart Items
        var p = document.createElement('p');
        p.innerHTML = '<b>Your cart is empty!</b> Return to the store to add items.';
        cartContents.appendChild(p);

        // Cart Info
        document.getElementById('total').innerHTML = '$--.--';

        document.getElementById('checkout-button').classList.add('disabled');
        document.getElementById('checkout-button').href = '';

        return;
    }

    cart = JSON.parse(loadedCart);

    console.log(cart);

    fetch(domain + 'assemblecart/?cart=' + JSON.stringify(cart))
        .then(response => {
            
            // CHECK IF CART RETURNED ANYTHING
            if (response.status == 404) {
                // SHOW EMPTY STATE

                // Cart Items
                var p = document.createElement('p');
                p.innerHTML = '<b>Your cart is empty!</b> Return to the store to add items.';
                cartContents.appendChild(p);

                // Cart Info
                document.getElementById('subtotal').innerHTML = '$--.--';
                document.getElementById('tax').innerHTML = '+$-.--';
                document.getElementById('total').innerHTML = '$--.--';

                document.getElementById('checkout-button').classList.add('disabled');
                document.getElementById('checkout-button').href = '';

                return;
            }

            // PARSE RESPONSE
            response.json().then(data => {

                console.log(data);

                // LOOP THROUGH PRODUCTS
                for (product of data.items) {
                    console.log(product)

                    // DISPLAY INFO
                    var item = document.createElement('div');
                    item.classList.add('cart-item');

                    var img = document.createElement('img');
                    img.src = domain + product.thumbnail_URL;

                    var itemInfo = document.createElement('item-info');
                    itemInfo.classList.add('item-info');
                    var h3 = document.createElement('h3');
                    h3.innerText = product.name;
                    itemInfo.appendChild(h3);
                    var h4 = document.createElement('h4');
                    h4.innerText = '$' + product.price_AUD + ' AUD | ' + product.item.item_name;
                    itemInfo.appendChild(h4);

                    var button = document.createElement('button');
                    button.classList.add('button', 'icon');
                    button.setAttribute( 'onClick', 'javascript: removeCartItem("' + product.id + '");');
                    var icon = document.createElement('span');
                    icon.classList.add('material-icons-round');
                    icon.innerHTML = 'delete';
                    button.appendChild(icon);

                    item.appendChild(img);
                    item.appendChild(itemInfo);
                    item.appendChild(button);

                    cartContents.appendChild(item);
                }

                // DISPLAY PRICING, ETC.
                document.getElementById('total').innerText = '$' +  data.total + ' AUD';

            });
        });
}



// -- REMOVE ITEM FROM CART --
function removeCartItem(cartID) {
    
    for (product of cart) {
        if (product.product_id == cartID) {
            cart.splice(cart.indexOf(product), 1);
            break;
        }
    }

    // SAVE CART
    window.localStorage.setItem('cart', JSON.stringify(cart));

    // RELOAD PAGE
    location.reload();
}



// -- BEGIN CHECKOUT PROCESS -- 
function checkout() {
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