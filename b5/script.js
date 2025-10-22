// ====== Lấy phần tử cần dùng ======
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productList = document.getElementById("product-list");

// ====== Thêm phần tử hiển thị lỗi và nút Hủy ======
const errorMsg = document.createElement("p");
errorMsg.id = "errorMsg";
errorMsg.style.color = "red";
addProductForm.appendChild(errorMsg);

const cancelBtn = document.createElement("button");
cancelBtn.type = "button";
cancelBtn.textContent = "Hủy";
cancelBtn.id = "cancelBtn";
addProductForm.appendChild(cancelBtn);

// ====== 1. Hàm hiển thị danh sách sản phẩm ======
function renderProducts(products) {
  productList.innerHTML = ""; // Xóa danh sách cũ
  products.forEach(p => {
    const newProduct = document.createElement("article");
    newProduct.classList.add("product-item");
    newProduct.innerHTML = `
      <h3>${p.name}</h3>
      <img src="${p.image}" alt="${p.name}">
      <p>${p.desc || "Sản phẩm mới được thêm."}</p>
      <p><span class="price">${Number(p.price).toLocaleString()}đ</span></p>
    `;
    productList.appendChild(newProduct);
  });
}

// ====== 2. Lấy dữ liệu từ LocalStorage hoặc khởi tạo mẫu ======
let products = JSON.parse(localStorage.getItem("products"));

if (!products) {
  // Nếu chưa có dữ liệu, khởi tạo mặc định
  products = [
    {
      name: "Sách Tiếng Anh Giao Tiếp",
      price: 110000,
      image: "https://cms.prepedu.com/uploads/sach_word_power_made_easy_norman_lewis_54f8800c3b.jpg",
      desc: "Luyện tập tiếng Anh thực tế cho mọi lứa tuổi."
    },
    {
      name: "Sách Từ Vựng TOEIC",
      price: 120000,
      image: "https://cms.prepedu.com/uploads/sach_word_power_made_easy_norman_lewis_54f8800c3b.jpg",
      desc: "Bí quyết học từ vựng nhanh và nhớ lâu."
    },
    {
      name: "Sách Ngữ Pháp Căn Bản",
      price: 95000,
      image: "https://cms.prepedu.com/uploads/sach_word_power_made_easy_norman_lewis_54f8800c3b.jpg",
      desc: "Dành cho người mới bắt đầu học tiếng Anh."
    }
  ];
  localStorage.setItem("products", JSON.stringify(products));
}

// Hiển thị danh sách khi tải trang
renderProducts(products);

// ====== 3. Tìm kiếm sản phẩm ======
searchBtn.addEventListener("click", function () {
  const keyword = searchInput.value.toLowerCase();
  const items = document.querySelectorAll(".product-item");

  items.forEach(item => {
    const name = item.querySelector("h3").textContent.toLowerCase();
    item.style.display = name.includes(keyword) ? "" : "none";
  });
});

searchInput.addEventListener("keyup", () => searchBtn.click());

// ====== 4. Ẩn / Hiện form thêm sản phẩm ======
addProductBtn.addEventListener("click", function () {
  addProductForm.classList.toggle("hidden");
  errorMsg.textContent = "";
});

// ====== 5. Xử lý thêm sản phẩm mới ======
addProductForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const img = document.getElementById("newImage").value.trim();

  // Validation
  if (name === "") {
    errorMsg.textContent = "Vui lòng nhập tên sản phẩm!";
    return;
  }
  const priceNumber = Number(price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    errorMsg.textContent = "Giá phải là số hợp lệ và lớn hơn 0!";
    return;
  }
  if (img === "") {
    errorMsg.textContent = " Vui lòng nhập link ảnh sản phẩm!";
    return;
  }
  errorMsg.textContent = "";

  // Tạo đối tượng sản phẩm mới
  const newProduct = {
    name,
    price: priceNumber,
    image: img,
    desc: "Sản phẩm mới được thêm."
  };

  // Thêm vào mảng và lưu vào LocalStorage
  products.unshift(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  // Hiển thị lại danh sách
  renderProducts(products);

  // Reset & ẩn form
  addProductForm.reset();
  addProductForm.classList.add("hidden");
});

// ====== 6. Nút Hủy ======
cancelBtn.addEventListener("click", function () {
  addProductForm.reset();
  errorMsg.textContent = "";
  addProductForm.classList.add("hidden");
});
