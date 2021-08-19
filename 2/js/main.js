const API = 'goods.json';

let getRequest = function () {

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', API, true);
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

class galleryProductList extends ProductList {

  constructor(container = '.products') {

    super(container);
    this._fetchProducts();

  }

  _fetchProducts() {
    getRequest().then(data => {
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
      console.log(id);
      const x = this.allProducts;
      console.log(x);
      const product = this._getProductItem(id);
      console.log(product);

    });

  }



}

class galleryProductItem extends ProductItem {


  constructor(product, img = 'https://via.placeholder.com/150') {
    super(product, img);




  }
}


class cartProductList extends ProductList {

  constructor(container = '.cart') {

    super(container);

  }

  _render() {
    const block = document.querySelector(this.container);

    for (let product of this.goods) {
      const productObject = new cartProductItem(product);
      this.allProducts.push(productObject);
      block.insertAdjacentHTML('beforeend', productObject.render())
    }
  }
}


class cartProductItem extends ProductItem {


  constructor(product, img = 'https://via.placeholder.com/50') {

    super(product, img);


  }
}

const list = new galleryProductList();