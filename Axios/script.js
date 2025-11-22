// --- 1. State Management ---
const API_URL = "https://jsonplaceholder.typicode.com/users";
let users = [];           // Lưu trữ toàn bộ user
let filteredUsers = [];   // Lưu trữ kết quả tìm kiếm
let currentPage = 1;
const rowsPerPage = 6;

// --- 2. Fetch & Read Data (Async/Await) ---
async function fetchUsers() {
    try {
        const response = await axios.get(API_URL);
        users = response.data;
        filteredUsers = [...users]; // Khởi tạo danh sách lọc
        renderTable();
    } catch (error) {
        showError("Failed to fetch users.");
        console.error(error);
    }
}

// --- 3. Create User (POST) ---
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address.street').value;
    const company = document.getElementById('company.name').value;
    
    const newUser = { name, email, phone, address: { street: address }, company: { name: company } };

    try {
        const response = await axios.post(API_URL, newUser);
        
        // Giả lập ID mới (vì API trả về ID 11 cho mọi item mới)
        const createdUser = { ...response.data, id: Date.now() }; 
        
        // Cập nhật UI thủ công
        users.unshift(createdUser); // Thêm vào đầu danh sách
        handleSearch(); // Chạy lại logic tìm kiếm để refresh bảng
        resetForm();
    } catch (error) {
        showError("Failed to create user.");
        console.error(error);
    }
});

// --- 4. Prepare Edit (Đổ dữ liệu vào form) ---
function prepareEdit(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    // Điền dữ liệu vào ô input
    document.getElementById('userId').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('address.street').value = user.address.street;
    document.getElementById('company.name').value = user.company.name;
    // Chuyển đổi nút bấm
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'inline-block';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    window.scrollTo(0,0); // Cuộn lên đầu trang
}

// --- 5. Update User (PUT) ---
async function handleUpdate() {
    const id = parseInt(document.getElementById('userId').value);
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address.street').value;
    const company = document.getElementById('company.name').value;

    try {
        // Kiểm tra ID trước khi gọi API
        // JSONPlaceholder chỉ cho phép sửa ID từ 1-10.
        // Với các user mới (ID lớn do Date.now() tạo), ta chỉ cập nhật giao diện cục bộ.
        if (id <= 10) {
            await axios.put(`${API_URL}/${id}`, { name, email, phone, address, company });
        } else {
            console.log("User mới tạo (local), bỏ qua API call để tránh lỗi server.");
        }

        // Cập nhật UI thủ công (áp dụng cho cả user cũ và mới)
        users = users.map(user => 
            user.id === id ? { ...user, name, email, phone, address: { street: address }, company: { name: company } } : user
        );

        handleSearch(); // Cập nhật lại bảng
        resetForm();    // Reset form về trạng thái thêm mới
    } catch (error) {
        showError("Failed to update user.");
        console.error(error);
    }
}

// --- 6. Delete User (DELETE) ---
async function deleteUser(id) {
    if(!confirm("Are you sure you want to delete this user?")) return;

    try {
        await axios.delete(`${API_URL}/${id}`);
        
        // Cập nhật UI thủ công
        users = users.filter(user => user.id !== id);
        handleSearch();
    } catch (error) {
        showError("Failed to delete user.");
        console.error(error);
    }
}

// --- 7. Search Logic ---
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(query)
    );
    
    currentPage = 1; // Reset về trang 1 khi tìm kiếm
    renderTable();
}

// --- 8. Rendering Logic (Table + Pagination) ---
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = "";
    document.getElementById('error-msg').style.display = 'none';

    // Logic phân trang
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    if (paginatedUsers.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center'>No users found</td></tr>";
        return;
    }

    // Tạo HTML cho từng dòng
    paginatedUsers.forEach(user => {
        const row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.address.street}</td>
                <td>${user.company.name}</td>
                <td>
                    <button class="btn-edit" onclick="prepareEdit(${user.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages || 1}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages || totalPages === 0;
}

function changePage(direction) {
    currentPage += direction;
    renderTable();
}

// --- Reset Form ---
function resetForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}

// --- Helper: Error Handling ---
function showError(message) {
    const errDiv = document.getElementById('error-msg');
    errDiv.textContent = message;
    errDiv.style.display = 'block';
    setTimeout(() => { errDiv.style.display = 'none'; }, 5000);
}

// Khởi tạo ứng dụng
fetchUsers();