document.addEventListener('DOMContentLoaded', function () {
  let cart = [];
  const cartCounter = document.querySelector('.badge');
  const addToCartButtons = document.querySelectorAll('.btn-outline-dark');
  const cartButton = document.querySelector(".btn-outline-dark[type='submit']");

  const cartMenu = document.createElement('div');
  cartMenu.classList.add('cart-menu');
  cartMenu.innerHTML = `
        <div class='cart-header'>
            <h3>Your Shopping Cart</h3>
        </div>
        <div class='cart-items'></div>
        <div class='cart-total'>Total: $0.00</div>
        <button class='close-cart'>Close</button>
    `;
  document.body.appendChild(cartMenu);

  const closeCartButton = cartMenu.querySelector('.close-cart');
  closeCartButton.addEventListener('click', function () {
    cartMenu.classList.remove('cart-open');
  });

  cartButton.addEventListener('click', function (event) {
    event.preventDefault();
    cartMenu.classList.toggle('cart-open');
  });

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      let productCard = button.closest('.card');
      let productName = productCard.querySelector('h5').textContent;
      let priceText = productCard.querySelector('.text-center').textContent;
      let price = extractPrice(priceText);

      addToCart(productName, price);
      alert(`${productName} added to cart!`);
    });
  });

  function extractPrice(text) {
    let match = text.match(/\$(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  function addToCart(name, price) {
    let existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
      existingItem.totalPrice += price;
    } else {
      cart.push({ name, price, quantity: 1, totalPrice: price });
    }
    updateCartUI();
  }

  function removeFromCart(name) {
    cart = cart.filter((item) => item.name !== name);
    updateCartUI();
  }

  function updateCartUI() {
    cartCounter.textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const cartItemsContainer = cartMenu.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';
    let totalCost = 0;

    cart.forEach((item) => {
      let cartItem = document.createElement('div');
      cartItem.innerHTML = `
                <p>${item.name} - $${item.price.toFixed(2)} x ${
        item.quantity
      } = $${item.totalPrice.toFixed(2)}</p>
                <button class="decrease" data-name="${item.name}">-</button>
                <button class="increase" data-name="${item.name}">+</button>
                <button class="remove" data-name="${item.name}">Remove</button>
            `;
      cartItemsContainer.appendChild(cartItem);
      totalCost += item.totalPrice;
    });

    document.querySelector(
      '.cart-total'
    ).textContent = `Total: $${totalCost.toFixed(2)}`;

    document.querySelectorAll('.increase').forEach((button) => {
      button.addEventListener('click', function () {
        updateQuantity(this.dataset.name, 1);
      });
    });

    document.querySelectorAll('.decrease').forEach((button) => {
      button.addEventListener('click', function () {
        updateQuantity(this.dataset.name, -1);
      });
    });

    document.querySelectorAll('.remove').forEach((button) => {
      button.addEventListener('click', function () {
        removeFromCart(this.dataset.name);
      });
    });
  }

  function updateQuantity(name, change) {
    let item = cart.find((item) => item.name === name);
    if (item) {
      item.quantity += change;
      item.totalPrice = item.price * item.quantity;
      if (item.quantity <= 0) removeFromCart(name);
      updateCartUI();
    }
  }

  // Add styles for sliding effect
  const style = document.createElement('style');
  style.innerHTML = `
        .cart-menu {
            position: fixed;
            top: 0;
            left: -300px;
            width: 300px;
            height: 100%;
            background: white;
            box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
            padding: 20px;
            transition: left 0.3s ease-in-out;
            overflow-y: auto;
        }
        .cart-menu.cart-open {
            left: 0;
        }
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .close-cart {
            background: red;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            display: block;
            width: 100%;
            margin-top: 10px;
        }
        .cart-total {
            font-weight: bold;
            margin-top: 10px;
        }
    `;
  document.head.appendChild(style);
});
