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
  constructor(container = '.products') {
    this.container = container;
    this.goods = [];
    this.allProducts = [];
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
      const productObject = new ProductItem(product);
      this.allProducts.push(productObject);
      block.insertAdjacentHTML('beforeend', productObject.render())
    }
  }
}

class ProductItem {
  constructor(product, img = 'https://via.placeholder.com/150') {
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

const list = new ProductList();