// ====== Lấy phần tử cần dùng ======
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productList = document.getElementById("product-list");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");

// ====== 1. Tìm kiếm sản phẩm ======
searchBtn.addEventListener("click", function () {
  const keyword = searchInput.value.toLowerCase();
  const products = document.querySelectorAll(".product-item"); // lấy lại mỗi lần để cập nhật

  products.forEach(product => {
    const name = product.querySelector("h3").textContent.toLowerCase();
    product.style.display = name.includes(keyword) ? "" : "none";
  });
});

// Cho phép tìm khi gõ phím
searchInput.addEventListener("keyup", () => searchBtn.click());

// ====== 2. Ẩn / Hiện form thêm sản phẩm ======
addProductBtn.addEventListener("click", function () {
  addProductForm.classList.toggle("hidden");
});

// ====== 3. Nút Hủy ======
cancelBtn.addEventListener("click", function () {
  addProductForm.reset();
  errorMsg.textContent = "";
  addProductForm.classList.add("hidden");
});

// ====== 4. Xử lý thêm sản phẩm mới ======
addProductForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Lấy giá trị từ form
  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const desc = document.getElementById("newDesc").value.trim();
  const img = document.getElementById("newImage").value.trim();

  // ====== Kiểm tra hợp lệ ======
  if (name === "" || price === "" || isNaN(price) || Number(price) <= 0) {
    errorMsg.textContent = "⚠️ Vui lòng nhập tên và giá hợp lệ (giá > 0).";
    return;
  }

  if (desc.length < 5) {
    errorMsg.textContent = "⚠️ Mô tả quá ngắn (ít nhất 5 ký tự).";
    return;
  }

  errorMsg.textContent = "";

  // ====== Tạo phần tử sản phẩm mới ======
  const newItem = document.createElement("article");
  newItem.className = "product-item";

  // Nếu người dùng không nhập ảnh thì dùng ảnh mặc định
  const imgSrc = img !== "" 
    ? img 
    : "https://cdn-icons-png.flaticon.com/512/29/29302.png";

  newItem.innerHTML = `
    <h3>${name}</h3>
    <img src="${imgSrc}" alt="${name}">
    <p>${desc}</p>
    <p><span class="price">${Number(price).toLocaleString()}đ</span></p>
  `;

  // ====== Chèn vào đầu danh sách ======
  productList.prepend(newItem);

  // Reset form và ẩn đi
  addProductForm.reset();
  addProductForm.classList.add("hidden");
});
