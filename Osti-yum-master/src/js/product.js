let stored_product_id = getParameter("Id");
const product_Section = document.getElementById('product_section');
//products part's to fill
const product_segments = {
    "title": document.getElementById('product_title'),
    "image": {
       bigImg: document.getElementById('big_img'),
       short_imgs: document.querySelectorAll('.short_imgs button img')
    }
    ,
    "compared_price": document.getElementById('compared_price'),
    "price": document.getElementById('price'),
    "description": document.getElementById('product_description'),
    "buyNowBtn":document.getElementById('buy-now-link'),
    "cartBtn":document.getElementById('cta-product-cart')
}

//checking whether we have url param or localstorage
if(stored_product_id ==null || stored_product_id == undefined){
    setParameter("Id",localStorage.getItem("current_product_id"))
    stored_product_id = getParameter("Id")
}else{
    localStorage.setItem("current_product_id",getParameter("Id"))
}
//then getting the product id from localstroage or url
function getProductId(){
    if(stored_product_id !== null){
        setParameter("Id",stored_product_id);

    }else if(getParameter("Id") !== null || stored_product_id == null){
       localStorage.setItem("current_product_id",getParameter("Id"));

       stored_product_id == getParameter("Id");
    }
}

//functions to get and set parameters
function getParameter(key) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
}
function setParameter(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
}
// fethcingt he items from json to load
async function fecther(){
    await fetch('../src/json/products.json')
    .then(response => response.json())
    .then(response => {
        loadInDom(response)
    })
       
}
const loadInDom = function(data){
    productSearher(stored_product_id,data.all_products)
}

//searching for prorduct in response after fetching
const productSearher = function(query, data){

    for(let i=0; i<data.length; i++){
        if(data[i].product_Id == query){
            loadProduct(data[i])
        }
    }
}

//sending back to home if we don't have localstorage or url
function sendToHomePage(){
    window.location = window.location.origin;
}

//loading the product in dom after specifying
const loadProduct = function(product){
   product_segments.title.innerText = product.title;
   product_segments.description.innerText = product.description;
   product_segments.compared_price.innerText = product.compared_price;
   product_segments.price.innerText = product.price;
   product_segments.image.bigImg.src = product.image[0];
   document.head.innerHTML += `    <title>${product.title}</title>
   <meta name="description" content="${product.description}">`

product_segments.cartBtn.addEventListener("click",()=>{
    addToCart(product.product_Id)
})
 product_segments.buyNowBtn.addEventListener("click",()=>{
    checkoutSeter(product.product_Id,quantityInput.value)
 })
}
//seting things ready for checkout
function checkoutSeter(elemId,quantity){
    const product = [elemId, quantity]
    localStorage.setItem("checkout_product",JSON.stringify(product))
}
getProductId()
fecther()