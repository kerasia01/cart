const API = 'goods.json';
const CART = 'cart.json';

let getRequest = function (url) {

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          reject('Error');
        } else {
          resolve(xhr.responseText);
        }
      }
    };
    xhr.send();
  });
};

class ProductList {
  constructor(container) {
    this.container = container;
    this.goods = [];
    this.allProducts = [];


  }
  _getProductId(target) {

    return target.dataset.id;

  }

  _getProductItem(id) {


    let productItem;
    let allproducts = this.allProducts;
    for (let product of allproducts) {
      if (product.id == id) {
        productItem = Object.assign({}, product);
      }

    }
    return productItem;
  }



}

class ProductItem {
  constructor(product, img) {
    this.title = product.title;
    this.price = product.price;
    this.id = product.id;
    this.img = img;
  }


}

class galleryProductList extends ProductList {

  constructor(container = '.products', cart = cartProductList) {

    super(container);
    this._fetchProducts();
    this.cart = new cart();

  }

  _fetchProducts() {
    getRequest(API).then(data => {
      this.goods = JSON.parse(data);
      this._render();

    });
  }

  _render() {
    const block = document.querySelector(this.container);

    for (let product of this.goods) {
      const productObject = new galleryProductItem(product);
      this.allProducts.push(productObject);
      block.insertAdjacentHTML('beforeend', productObject.render());

    }

    block.addEventListener("click", (Event) => {

      const target = Event.target;
      if (target.className != "cart-img") {
        return;
      }
      const id = this._getProductId(target);
      const product = this._getProductItem(id);
      this.addToCart(product);


    });

  }

  addToCart(product) {
    const cartList = this.cart;
    
    cartList._render(product);
    cartList._setCartList(product);
    document.querySelector(".cart").addEventListener('click', (e) => {

      const target = e.target;
      if (target.tagName != "INPUT") {
        return;
      }
      const id = cartList._getProductId(target);
      // cartList._removeCartItem(id);
      cartList._removeFromList(id);
      cartList._renderAllProducts();
      console.log(cartList.allProducts);

    });
  }

}

class galleryProductItem extends ProductItem {


  constructor(product, img = 'https://via.placeholder.com/150') {
    super(product, img);


  }

  render() {
    return `<div class="product-item" data-id="${this.id}">
    <img src="${this.img}" alt="Some img">
    
        <h3>${this.title}</h3>
        <p>${this.price} \u20bd</p>
        <button class="buy-btn">Купить</button>
        <button class = "cart-img"  data-id="${this.id}" ></button>
        <div class="desc"></div >
    <div/`;
  }
}


class cartProductList extends ProductList {

  constructor(container = '.cart-list') {

    super(container);
    // this._setCartList ();
    this._fetchProducts();

  }

  _fetchProducts() { //получить  список товаров корзины с сервера


    getRequest(CART).then(data => {
      this.goods = JSON.parse(data);


    });


  }


  _render(product) {

    const block = document.querySelector(this.container);


    const productObject = new cartProductItem(product);

    block.insertAdjacentHTML('beforeend', productObject.render());




  }

  _renderAllProducts() {

    const cartItems = document.querySelectorAll(".cart-item");
    for(let good of cartItems) {
      document.querySelector(".cart-list").removeChild(good);
    }
    
    for (let product of this.allProducts) {
      this._render(product);
    }

  }

  _setCartList(product) {
    this.allProducts.push(product);
  }

  _getCartList() { // получить список товаров 
    return this.allProducts;

  }

  _removeCartItem(idt) {

    const cartItems = document.querySelectorAll(".cart-item");
    for (let cartItem of cartItems) {
      if (cartItem.dataset.id == idt) {
        document.querySelector(".cart-list").removeChild(cartItem);
        
      }
      
    }
    

  }



  _removeFromList(idt ) {

    this.allProducts = this.allProducts.filter(el => el.id != idt );
    
  
  
  }



}


class cartProductItem extends ProductItem {


  constructor(product, img = 'https://via.placeholder.com/50') {

    super(product, img);


  }

  render() {

    return `<div class="cart-item" data-id="${this.id}" >
  <img src="${this.img}" alt=""><p>${this.title}</p>
  <p><span>${this.price}</span></p>
  <input type="button" data-id="${this.id}" class="remove-item" value="Убрать из корзины">
  </div>`;

  }

}

const list = new galleryProductList();
document.querySelector('.btn-cart').addEventListener("click", ()=> {
document.querySelector(".cart-list").classList.toggle("visible");


});