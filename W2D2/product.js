let products = [
    { id: 1, name: 'laptop1', price: 100, image: 'https://i.pinimg.com/1200x/fe/f7/b3/fef7b3cbaeb59afc974ab04dd20741e6.jpg' },
    { id: 2, name: 'laptop2', price: 200, image: 'https://i.pinimg.com/736x/bc/0d/cb/bc0dcbcb2c489e0105c1f8de3f34b717.jpg' },
    { id: 3, name: 'laptop3', price: 300, image: 'https://i.pinimg.com/736x/10/97/a3/1097a3ff0fedcbd9a85ed3f6789b26c1.jpg' },
    { id: 4, name: 'laptop4', price: 400, image: 'https://i.pinimg.com/736x/a3/1f/76/a31f765ea17fb44890d774b4f56373f6.jpg' },
    { id: 5, name: 'laptop5', price: 600, image: 'https://i.pinimg.com/736x/bc/0b/6d/bc0b6d86bd25e8512f0c9977f1f2d0ae.jpg' },
    { id: 6, name: 'laptop4', price: 700, image: 'https://i.pinimg.com/736x/a3/1f/76/a31f765ea17fb44890d774b4f56373f6.jpg' },
    { id: 7, name: 'laptop5', price: 800, image: 'https://i.pinimg.com/736x/bc/0b/6d/bc0b6d86bd25e8512f0c9977f1f2d0ae.jpg' },
    { id: 8, name: 'laptop5', price: 900, image: 'https://i.pinimg.com/736x/bc/0b/6d/bc0b6d86bd25e8512f0c9977f1f2d0ae.jpg' }
];

let nextId = 9;

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'w-70 bg-white rounded-lg shadow p-4 flex flex-col gap-3 hover:-translate-y-2 transition-transform duration-300 hover:shadow-lg mt-5';
    card.dataset.productId = product.id;

    const img = document.createElement('img');
    img.className = 'w-full h-60 object-cover rounded';
    img.src = product.image;
    img.alt = product.name;

    const name = document.createElement('h3');
    name.className = 'text-lg font-semibold';
    name.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'text-gray-700';

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'flex gap-2 mt-auto';

    const editBtn = document.createElement('button');
    editBtn.className = 'flex-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 hover:cursor-pointer';
    editBtn.addEventListener('click', () => {
        editProduct(product.id);
    })

    const removeBtn = document.createElement('button');
    removeBtn.className = 'flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 hover:cursor-pointer';
    removeBtn.textContent = 'Remove';

    removeBtn.addEventListener('click', () => {
        removeProduct(product.id);
    });

    price.textContent = `$${product.price}`;
    editBtn.textContent = 'Edit';
    removeBtn.textContent = 'Remove';

    buttonGroup.append(editBtn, removeBtn);
    card.append(img, name, price, buttonGroup);
    return card;
}

function displayProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });

    updateProductCount();
}
displayProducts();

function removeProduct(id) {
    products = products.filter(product => product.id !== id);
    displayProducts();
}


function addProduct() {
    const name = prompt('Enter product name:');
    if (!name || name.trim() === '') {
        alert('Product name is required!');
        return;
    }
    const priceStr = prompt('Enter product price:');
    const price = parseFloat(priceStr);
    
    if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price!');
        return;
    }

    const imageUrl = prompt('Enter image URL:');
    if (!imageUrl || imageUrl.trim() === '') {
        alert('Image URL is required!');
        return;
    }
    const newProduct = {
        id: nextId++,
        name: name.trim(),
        price: price,
        image: imageUrl,
    };

    products.push(newProduct);
    displayProducts();
}
document.getElementById('add-product').addEventListener('click', addProduct);



function editProduct(id) {
    const product = products.find(item => item.id === id);
    const newName = prompt('Edit product name:', product.name);
    if (!newName || newName.trim() === '') return;

    const newPriceStr = prompt('Edit product price:', product.price);
    const newPrice = parseFloat(newPriceStr);

    if (isNaN(newPrice) || newPrice <= 0) {
        alert('Invalid price!');
        return;
    }

    const newImage = prompt('Edit image URL:', product.image);
    if (!newImage || newImage.trim() === '') return;

    product.name = newName.trim();
    product.price = newPrice;
    product.image = newImage.trim();

    displayProducts();
}

const searchInput = document.getElementById('search-name');
searchInput.addEventListener('keydown',(event) => {
    if (event.key === 'Enter') {
        search();
    }
});
function search() {
    const keyword = searchInput.value.toLowerCase();
    const container = document.getElementById('products-container');
    const notFound = document.getElementById('notfound');

    container.innerHTML = '';
    notFound.textContent = '';

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    if (filteredProducts.length === 0) {
        notFound.textContent = 'Product not found!';
    } else {
        filteredProducts.forEach(product => {
            container.appendChild(createProductCard(product));
        });
    }
    searchInput.value = '';
    const counter = document.getElementById('product-count');
    counter.textContent = `Total Products: ${filteredProducts.length}`;
}

function updateProductCount() {
    const counter = document.getElementById('product-count');
    counter.textContent = `Total Products: ${products.length}`;
}

