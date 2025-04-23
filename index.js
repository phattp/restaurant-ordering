import menuArray from "/data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// ============ State ============
let orderArr = [];

// ============ Setup ============
/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.dataset.product) {
      handleOrderClick(e.target.dataset.product);
    } else if (e.target.dataset.remove) {
      handleRemoveClick(e.target.dataset.remove);
    } else if (e.target.id === "complete-order-btn") {
      handleCompleteOrderClick();
    }
  });

  document.addEventListener("click", closeModalFromOutside);
  document
    .getElementById("payment-form")
    .addEventListener("submit", handlePaymentSubmit);
}

// ============ Event Handlers ============
/**
 * Handle click on the product order button
 * @param {string} productId - ID of the product being ordered
 */
function handleOrderClick(productId) {
  const targetProductObject = menuArray.find(
    (product) => product.id === Number(productId)
  );

  orderArr.push({
    id: uuidv4(),
    name: targetProductObject.name,
    price: targetProductObject.price,
  });

  renderOrder();
}

/**
 * Handle removal of a product from the order list
 * @param {string} productId - ID of the product to remove
 */
function handleRemoveClick(productId) {
  orderArr = orderArr.filter((product) => product.id !== productId);
  renderOrder();
}

/**
 * Handle click on the Complete Order button
 */
function handleCompleteOrderClick() {
  renderPaymentModal();
}

/**
 * Handle payment form submission
 * @param {Event} e - Event object
 */
function handlePaymentSubmit(e) {
  e.preventDefault();

  const paymentForm = document.getElementById("payment-form");
  const paymentFormData = new FormData(paymentForm);
  const name = paymentFormData.get("name");

  orderArr = [];
  paymentForm.reset();
  closeModal();
  renderOrder();
  renderThankYouMessage(name);
}

// ============ Modal Functions ============
/**
 * Display the payment modal
 */
function renderPaymentModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
}

/**
 * Close the payment modal
 */
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

/**
 * Close the modal when clicking outside the modal content
 * @param {Event} e - Event object
 */
function closeModalFromOutside(e) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");

  if (
    modal.style.display === "block" &&
    modal.contains(e.target) &&
    !modalContent.contains(e.target)
  ) {
    closeModal();
  }
}

// ============= Render Functions =============
/**
 * Display thank you message after order completion
 * @param {string} name - Customer's name
 */
function renderThankYouMessage(name) {
  const thankYouMessage = document.createElement("h5");
  thankYouMessage.textContent = `Thanks, ${name}! Your order is on its way!`;

  const yourOrderSection = document.getElementById("your-order-section");
  yourOrderSection.appendChild(thankYouMessage);
}

/**
 * Render the complete order section
 */
function renderOrder() {
  const yourOrderSection = document.getElementById("your-order-section");
  yourOrderSection.innerHTML = "";

  if (orderArr.length > 0) {
    // Create "Your Order" heading
    const yourOrderH2 = document.createElement("h2");
    yourOrderH2.classList.add("your-order-h2");
    yourOrderH2.textContent = "Your Order";
    yourOrderSection.appendChild(yourOrderH2);

    // Create each order item
    orderArr.forEach((item) => {
      const orderItem = document.createElement("div");
      orderItem.classList.add("order-item");

      const orderItemH3 = document.createElement("h3");
      orderItemH3.classList.add("order-item-h3");
      orderItemH3.textContent = item.name;

      const removeItemBtn = document.createElement("button");
      removeItemBtn.classList.add("remove-item-btn");
      removeItemBtn.textContent = "remove";
      removeItemBtn.dataset.remove = item.id;

      const priceH4 = document.createElement("h4");
      priceH4.textContent = `$${item.price}`;

      orderItem.appendChild(orderItemH3);
      orderItem.appendChild(removeItemBtn);
      orderItem.appendChild(priceH4);

      yourOrderSection.appendChild(orderItem);
    });

    // Calculate total price
    const totalPrice = orderArr.reduce(
      (total, currentProduct) => total + currentProduct.price,
      0
    );

    // Create total price section
    const totalContainer = document.createElement("div");
    totalContainer.classList.add("total");

    const totalPriceH2 = document.createElement("h2");
    totalPriceH2.classList.add("total-price-h2");
    totalPriceH2.textContent = "Total Price:";

    const totalPriceDetail = document.createElement("h4");
    totalPriceDetail.textContent = `$${totalPrice}`;

    totalContainer.appendChild(totalPriceH2);
    totalContainer.appendChild(totalPriceDetail);
    yourOrderSection.appendChild(totalContainer);

    // Create Complete order button
    const completeOrderBtn = document.createElement("button");
    completeOrderBtn.classList.add("complete-order-btn");
    completeOrderBtn.id = "complete-order-btn";
    completeOrderBtn.textContent = "Complete order";

    yourOrderSection.appendChild(completeOrderBtn);
  }
}

/**
 * Render the menu with all available food items
 */
function renderMenu() {
  const menuSection = document.getElementById("menu-section");
  menuSection.innerHTML = "";

  menuArray.forEach((menu) => {
    const menuItem = document.createElement("article");
    menuItem.classList.add("menu-item");

    const emoji = document.createElement("p");
    emoji.classList.add("emoji");
    emoji.textContent = menu.emoji;

    const product = document.createElement("div");
    product.classList.add("product");

    const productName = document.createElement("h2");
    productName.textContent = menu.name;

    const productDesc = document.createElement("p");
    productDesc.textContent = menu.ingredients.join(", ");

    const price = document.createElement("h3");
    price.textContent = `$${menu.price}`;

    const orderBtn = document.createElement("button");
    orderBtn.classList.add("order-btn");
    orderBtn.dataset.product = menu.id;
    orderBtn.textContent = "+";

    product.appendChild(productName);
    product.appendChild(productDesc);
    product.appendChild(price);

    menuItem.appendChild(emoji);
    menuItem.appendChild(product);
    menuItem.appendChild(orderBtn);

    menuSection.appendChild(menuItem);
  });
}

// ============ Initialize Application ============
/**
 * Initialize the application
 */
function init() {
  setupEventListeners();
  renderMenu();
}

// Start the application
init();
