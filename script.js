let cart = JSON.parse(localStorage.getItem('cart')) || [];

let products = [
    { name: "상품1", basePrice: 10000, category: "category1", options: [{ name: "1kg", weight: 1, price: 10000 }, { name: "3kg", weight: 3, price: 25000 }], imageUrl: "https://picsum.photos/300/200?random=1" },
    { name: "상품2", basePrice: 15000, category: "category1", options: [{ name: "1kg", weight: 1, price: 15000 }, { name: "5kg", weight: 5, price: 40000 }], imageUrl: "https://picsum.photos/300/200?random=2" },
    { name: "상품3", basePrice: 20000, category: "category2", options: [{ name: "2kg", weight: 2, price: 20000 }, { name: "4kg", weight: 4, price: 35000 }], imageUrl: "https://picsum.photos/300/200?random=3" },
    { name: "상품4", basePrice: 25000, category: "category2", options: [{ name: "3kg", weight: 3, price: 25000 }, { name: "6kg", weight: 6, price: 45000 }], imageUrl: "https://picsum.photos/300/200?random=4" },
    { name: "상품5", basePrice: 30000, category: "category3", options: [{ name: "1kg", weight: 1, price: 30000 }, { name: "2kg", weight: 2, price: 50000 }], imageUrl: "https://picsum.photos/300/200?random=5" },
    { name: "상품6", basePrice: 35000, category: "category3", options: [{ name: "2kg", weight: 2, price: 35000 }, { name: "4kg", weight: 4, price: 55000 }], imageUrl: "https://picsum.photos/300/200?random=6" },
    // ... 10개 이하로 제품 목록을 추가
];

// 상품 필터링
function filterCategory(category) {
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// 상품 표시
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>기본 가격: ${product.basePrice}원</p>
            <button onclick="openOptionModal('${product.name}')">장바구니에 담기</button>
        `;
        productList.appendChild(productDiv);
    });
}

function openOptionModal(productName) {
    const product = products.find(p => p.name === productName);
    const optionSelect = document.getElementById('option');
    optionSelect.innerHTML = '';

    product.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = `${option.name} (추가 금액: ${option.price}원)`;
        optionSelect.appendChild(optionElement);
    });

    // 🔥 이미지 설정 추가
    const modalImage = document.getElementById('option-modal-image');
    modalImage.src = product.imageUrl;
    modalImage.alt = product.name;

    document.getElementById('price').innerText = product.basePrice;
    document.getElementById('option-modal').style.display = 'block';
    document.getElementById('quantity').value = 1;
    document.getElementById('option-modal').setAttribute('data-product-name', productName);
}


// 옵션 선택 모달 닫기
function closeOptionModal() {
    document.getElementById('option-modal').style.display = 'none';
}

// 장바구니에 상품 담기
function addToCartWithOptions() {
    const productName = document.getElementById('option-modal').getAttribute('data-product-name');
    const product = products.find(p => p.name === productName);
    const quantity = parseInt(document.getElementById('quantity').value);
    const selectedOptionName = document.getElementById('option').value;
    const selectedOption = product.options.find(option => option.name === selectedOptionName);

    const cartItem = {
        name: product.name,
        optionWeight: selectedOption.weight,
        quantity: quantity,
        price: product.basePrice,
        optionPrice: selectedOption.price,
        totalPrice: (product.basePrice + selectedOption.price) * quantity,
        option: selectedOptionName
    };

    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    closeOptionModal();
    alert(`${product.name}이(가) 장바구니에 담겼습니다!`);
}

// 장바구니 아이템 표시 함수
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // 기존 내용 초기화

    cart.forEach((item, index) => {
        const product = products.find(p => p.name === item.name);
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        
        // 상품 이미지 추가
        const productImage = document.createElement('img');
        productImage.src = product.imageUrl; // 상품 이미지 URL
        productImage.alt = product.name; // 상품 이름
        productImage.classList.add('cart-item-image');
        
        // 상품 이름과 수량 등 표시
        const itemDetails = document.createElement('div');
        itemDetails.classList.add('item-details');
        itemDetails.innerHTML = `
            <h4>${product.name}</h4>
            <p>수량: ${item.quantity}</p>
            <p>가격: ${item.totalPrice}원</p>
            <button onclick="openEditModal(${index})">수정</button>
        `;
        
        cartItemDiv.appendChild(productImage); // 이미지 요소 추가
        cartItemDiv.appendChild(itemDetails);  // 상품 정보 추가
        cartContainer.appendChild(cartItemDiv);
    });
}


// 장바구니 수정 모달 열기
function openEditModal(index) {
    const item = cart[index]; // cart 배열에서 item을 가져옴
    const product = products.find(p => p.name === item.name); // products 배열에서 해당 상품 찾기
    const editOptionSelect = document.getElementById('edit-option');
    editOptionSelect.innerHTML = '';

    // 모달에 상품 이미지 추가
    const modalImage = document.getElementById('edit-modal-image');
    modalImage.src = product.imageUrl; // 상품 이미지 URL
    modalImage.alt = product.name; // 상품 이름

    // 옵션 동적으로 추가
    product.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = `${option.name} (추가 금액: ${option.price}원)`;
        editOptionSelect.appendChild(optionElement);
    });

    document.getElementById('edit-quantity').value = item.quantity; // 기존 수량 반영
    document.getElementById('edit-price').innerText = item.totalPrice; // 기존 가격 반영

    document.getElementById('edit-modal').style.display = 'block'; // 모달 열기
    document.getElementById('edit-modal').setAttribute('data-item-index', index); // 수정할 항목의 인덱스 저장
}



// 장바구니 수정 모달 닫기
function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// 장바구니 수정 완료
function updateCartItem() {
    const itemIndex = document.getElementById('edit-modal').getAttribute('data-item-index');
    const item = cart[itemIndex];
    const quantity = parseInt(document.getElementById('edit-quantity').value);
    const optionName = document.getElementById('edit-option').value;

    const product = products.find(p => p.name === item.name);
    const selectedOption = product.options.find(option => option.name === optionName);

    item.quantity = quantity;
    item.option = optionName;
    item.optionWeight = selectedOption.weight;
    item.totalPrice = (product.basePrice + selectedOption.price) * quantity;

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    closeEditModal();
    alert('장바구니가 업데이트되었습니다!');
}

// 장바구니 비우기
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// 구매 진행
function checkout() {
    alert('구매 진행');
}

// 검색 기능 추가
function searchProducts() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
}

// 상품 필터링 및 표시
function filterCategory(category) {
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>기본 가격: ${product.basePrice}원</p>
            <button onclick="openOptionModal('${product.name}')">장바구니에 담기</button>
        `;
        productList.appendChild(productDiv);
    });
}

// 초기화
displayCartItems();
