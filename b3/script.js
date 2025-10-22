// ====== Lấy phần tử cần dùng ======
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productList = document.getElementById("product-list");

// ====== 1. Tìm kiếm sản phẩm ======
searchBtn.addEventListener("click", function () {
  const keyword = searchInput.value.toLowerCase();
  const products = document.querySelectorAll(".product-item");

  products.forEach(product => {
    const name = product.querySelector("h3").textContent.toLowerCase();
    // So sánh từ khóa, nếu có thì hiện, không có thì ẩn
    product.style.display = name.includes(keyword) ? "" : "none";
  });
});

// Cho phép tìm ngay khi người dùng gõ phím (Enter hoặc mỗi lần nhập)
searchInput.addEventListener("keyup", () => {
  searchBtn.click();
});

// ====== 2. Ẩn / Hiện form thêm sản phẩm ======
addProductBtn.addEventListener("click", function () {
  addProductForm.classList.toggle("hidden");
});

// ====== 3. Xử lý thêm sản phẩm mới ======
addProductForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Ngăn load lại trang

  const name = document.getElementById("newName").value;
  const price = document.getElementById("newPrice").value;
  const img = document.getElementById("newImage").value;

  // Tạo phần tử sản phẩm mới
  const newProduct = document.createElement("article");
  newProduct.classList.add("product-item");
  newProduct.innerHTML = `
    <h3>${name}</h3>
    <img src="${img}" alt="${name}">
    <p><span class="price">${price}</span></p>
  `;

  // Thêm vào danh sách
  productList.appendChild(newProduct);

  // Reset form và ẩn đi
  addProductForm.reset();
  addProductForm.classList.add("hidden");
});
