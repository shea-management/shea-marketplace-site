// const domain = 'http://localhost:4242/';    // DEV
const domain = 'https://shea-marketplace-server.herokuapp.com/'     // PRODUCTION
var sessionID;

function loadPage() {

    // GET INFO FROM URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Check if URL contains info
    if(!urlParams.has('session_id')) {
        document.getElementById('page-loading').style.display = 'none';
        document.getElementById('page-fail').style.display = 'flex';
        document.getElementById('page-fail-message').innerHTML = "It looks like we couldn't find the information we needed. Have you arrived here from an email sent to you? <br><br> If you clicked on the 'Redeem Now' button on your email and this message persists, contact us by replying to that email.";
        return;
    }

    sessionID = urlParams.get('session_id');

    // AUTHENTICATE WITH SERVER & GET CART
    fetch(domain + 'auth-order/?session_id=' + sessionID)
        .then(response => {
            if (response.status != 200) {
                document.getElementById('page-loading').style.display = 'none';
                document.getElementById('page-fail').style.display = 'flex';
                document.getElementById('page-fail-message').innerHTML = "Your order couldn't be authenticated properly. Have you arrived here from an email sent to you?";
                return;
            }

            // INTERPRET RESPONSE
            response.json().then(data => {
                    
                    console.log(data);

                    // Remove Existing Cart Items
                    var cartContents = document.getElementById('cart-contents');
                    cartContents.innerHTML = '';

                    // GENERATE FINALISED CART
                    fetch(domain + 'assemblecart/?cart=' + JSON.stringify(data))
                        .then(response => {
                            if (response.status != 200) {
                                // SHOW EMPTY STATE
                                document.getElementById('page-loading').style.display = 'none';
                                document.getElementById('page-fail').style.display = 'flex';
                                document.getElementById('page-fail-message').innerHTML = "Your order's cart failed to generate properly. Have you arrived here from an email sent to you?";
                                return;
                            }

                            response.json().then(data => {
                                console.log(data);

                                // LOOP THROUGH PRODUCTS
                                for (product of data.items) {
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
                                    h4.innerText = '$' + product.price_AUD + ' AUD';
                                    itemInfo.appendChild(h4);

                                    var button = document.createElement('button');
                                    button.classList.add('button', 'icon');
                                    button.setAttribute( 'onClick', 'javascript: downloadProduct("' + product.id + ', ' + product.item.id + '");');
                                    var icon = document.createElement('span');
                                    icon.classList.add('material-icons-round');
                                    icon.innerHTML = 'download';
                                    button.appendChild(icon);

                                    item.appendChild(img);
                                    item.appendChild(itemInfo);
                                    item.appendChild(button);

                                    cartContents.appendChild(item);
                                }
                            })
                        });
                });
        });
}

function downloadProduct(product) {

    product = product.split(', ');

    productID = product[0];
    itemID = product[1];

    console.log('downloading product', productID, itemID);

    // SEND REQUEST TO SERVER
    url = domain + 'redeem-order/?session_id=' + sessionID + '&product_id=' + productID + '&item_id=' + itemID
    window.open(url, '_blank');
}