// Verificar se o usuário está logado e tem permissão
function checkAuth() {
    const loggedIn = localStorage.getItem('loggedIn');
    const userType = localStorage.getItem('userType');
    
    if (loggedIn !== 'true') {
        window.location.href = 'index.html';
        return false;
    }

    if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('inventory')) {
        if (userType !== 'admin') {
            window.location.href = 'order.html';
            return false;
        }
    }

    return true;
}

// Chamar a função de verificação no início do script
if (!checkAuth()) {
    // Se a autenticação falhar, o script para aqui devido ao redirecionamento
    throw new Error('Autenticação falhou');
}

let products = JSON.parse(localStorage.getItem('products')) || [];
let currentPage = 1;
const itemsPerPage = 12;

// Função para gerar código do produto
function generateProductCode(category) {
    const categoryCode = category.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substr(0, 3);
    const existingProducts = products.filter(p => p.code.startsWith(categoryCode));
    const nextNumber = existingProducts.length + 1;
    return `${categoryCode}${nextNumber.toString().padStart(4, '0')}`;
}

// Função para formatar valor em Real brasileiro
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Função para adicionar produto
function addProduct(name, price, quantity, unit, category, image) {
    const code = generateProductCode(category);
    const product = { code, name, price, quantity, unit, category, image };
    products.push(product);
    saveProducts();
    updateProductGrid();
    showFeedback('Produto adicionado com sucesso!', 'success');
}

// Função para salvar produtos no localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Função para filtrar produtos
function filterProducts(products, searchTerm) {
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Função para obter categorias únicas
function getUniqueCategories() {
    return [...new Set(products.map(product => product.category))];
}

// Função para preencher o select de categorias
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const categories = getUniqueCategories();
    
    categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Função para atualizar a grade de produtos
function updateProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) {
        console.error('Elemento product-grid não encontrado');
        return;
    }
    grid.innerHTML = '';

    const searchTerm = document.getElementById('search-product').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;

    let filteredProducts = products.filter(product => 
        (product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)) &&
        (selectedCategory === '' || product.category === selectedCategory)
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image || "./img/no_image.jpg"}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>Código: ${product.code}</p>
            <p>Preço: ${formatCurrency(product.price)}</p>
            <p>Quantidade: ${product.quantity} ${product.unit}</p>
            <p>Categoria: ${product.category}</p>
            <button class="edit-product-button" data-code="${product.code}"><i class="fas fa-edit"></i> Editar</button>
            <button class="delete-product-button" data-code="${product.code}"><i class="fas fa-trash"></i> Excluir</button>
        `;
        grid.appendChild(productElement);
    });

    updatePagination(filteredProducts.length);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            updateProductGrid();
        });
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        paginationElement.appendChild(pageButton);
    }
}

function editProduct(code) {
    const product = products.find(p => p.code === code);
    
    if (product) {
        document.getElementById('edit-code').value = product.code;
        document.getElementById('edit-name').value = product.name;
        const priceInput = document.getElementById('edit-price');
        priceInput.value = product.price.toFixed(2);
        formatPriceInput(priceInput);
        document.getElementById('edit-quantity').value = product.quantity;
        document.getElementById('edit-unit').value = product.unit;
        document.getElementById('edit-category').value = product.category;

        const modal = document.getElementById('edit-modal');
        modal.style.display = 'block';

        // Adicionar evento para formatar o preço enquanto o usuário digita
        priceInput.addEventListener('input', function() {
            formatPriceInput(this);
        });
    }
}

function deleteProduct(code) {
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.style.display = 'block';

    document.getElementById('confirm-delete').onclick = function() {
        products = products.filter(p => p.code !== code);
        saveProducts();
        updateProductGrid();
        deleteModal.style.display = 'none';
        showFeedback('Produto excluído com sucesso!', 'success');
    };

    document.getElementById('cancel-delete').onclick = function() {
        deleteModal.style.display = 'none';
    };
}

function showFeedback(message, type) {
    const feedbackElement = document.getElementById('feedback-message');
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback ${type}`;
    feedbackElement.style.display = 'block';
    setTimeout(() => {
        feedbackElement.style.display = 'none';
    }, 3000);
}

// Event Listeners
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseFloat(document.getElementById('product-quantity').value);
    const unit = document.getElementById('product-unit').value;
    const category = document.getElementById('product-category').value;
    const imageFile = document.getElementById('product-image').files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            addProduct(name, price, quantity, unit, category, event.target.result);
            clearImagePreview();
        };
        reader.readAsDataURL(imageFile);
    } else {
        addProduct(name, price, quantity, unit, category);
    }

    this.reset();
    clearImagePreview();
});

document.getElementById('edit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveProductChanges();
});

document.getElementById('search-product').addEventListener('input', updateProductGrid);

document.getElementById('category-filter').addEventListener('change', updateProductGrid);

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-product-button')) {
        const code = event.target.getAttribute('data-code');
        editProduct(code);
    }
    if (event.target.classList.contains('delete-product-button')) {
        const code = event.target.getAttribute('data-code');
        deleteProduct(code);
    }
    if (event.target.classList.contains('product-image')) {
        showEnlargedImage(event.target.src);
    }
});

function formatPriceInput(input) {
    let value = input.value.replace(/\D/g, '');
    value = (parseFloat(value) / 100).toFixed(2) + '';
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    input.value = 'R$ ' + value;
}

function parsePriceInput(input) {
    return parseFloat(input.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
}

function saveProductChanges() {
    const editedCode = document.getElementById('edit-code').value;
    const editedName = document.getElementById('edit-name').value;
    const editedPrice = parsePriceInput(document.getElementById('edit-price'));
    const editedQuantity = parseFloat(document.getElementById('edit-quantity').value);
    const editedUnit = document.getElementById('edit-unit').value;
    const editedCategory = document.getElementById('edit-category').value;

    const productIndex = products.findIndex(p => p.code === editedCode);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name: editedName,
            price: editedPrice,
            quantity: editedQuantity,
            unit: editedUnit,
            category: editedCategory
        };

        saveProducts();
        updateProductGrid();
        closeModal('edit-modal');
        showFeedback('Produto atualizado com sucesso!', 'success');
    }
}

function showEnlargedImage(src) {
    const modal = document.getElementById('image-modal');
    const enlargedImage = document.getElementById('enlarged-image');
    enlargedImage.src = src;
    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Fechar modais
document.querySelectorAll('.close').forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        closeButton.closest('.modal').style.display = 'none';
    });
});

// Fechar modal se clicar fora dele
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Função de logout
document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
});

// Inicialização
function initializeInventory() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    populateCategoryFilter();
    updateProductGrid();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeInventory();

    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    const inputText = document.querySelector('.add-product-in .input-text');
    const addProductIn = document.querySelector('.add-product-in');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Criar e exibir a miniatura
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100px; max-height: 100px;">`;
                imagePreview.style.display = 'block';
                
                // Remover o texto de input
                if (inputText) {
                    inputText.style.display = 'none';
                }
                
                // Opcional: Ajustar o estilo do container para acomodar a miniatura
                addProductIn.style.alignItems = 'center';
                addProductIn.style.justifyContent = 'space-between';
            }
            reader.readAsDataURL(file);
        } else {
            // Se nenhum arquivo for selecionado, reverter para o estado original
            imagePreview.innerHTML = '';
            imagePreview.style.display = 'none';
            if (inputText) {
                inputText.style.display = 'block';
            }
            addProductIn.style.alignItems = '';
            addProductIn.style.justifyContent = '';
        }
    });

});

// Função para limpar a prévia da imagem e restaurar o texto original
function clearImagePreview() {
    const imagePreview = document.getElementById('image-preview');
    const inputText = document.querySelector('.add-product-in .input-text');
    const addProductIn = document.querySelector('.add-product-in');

    imagePreview.innerHTML = '';
    imagePreview.style.display = 'none';
    if (inputText) {
        inputText.style.display = 'block';
    }
    addProductIn.style.alignItems = '';
    addProductIn.style.justifyContent = '';
    document.getElementById('product-image').value = ''; // Limpar o input file
}