import { updateProductList } from './products.js';
import { renderOrders } from './orders.js';
import * as Utils from './utils.js';

function openNewOrderModal() {
    console.log('Abrindo modal de novo pedido');
    const modal = document.getElementById('new-order-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Carregar e exibir os produtos
        updateProductList();
        
        // Atualizar o filtro de categorias
        updateCategoryFilter();
    } else {
        console.error('Modal de novo pedido não encontrado');
    }
}

function updateCategoryFilter() {
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            updateProductList(this.value);
        });
    } else {
        console.error('Elemento de seleção de categoria não encontrado');
    }
}

function closeNewOrderModal() {
    const modal = document.getElementById('new-order-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showOrderDetails(orderNumber) {
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const order = salesHistory.find(sale => sale.orderNumber === orderNumber);

    if (!order) {
        alert('Pedido não encontrado');
        return;
    }

    const detailsContainer = document.getElementById('order-details');
    if (!detailsContainer) {
        console.error('Elemento order-details não encontrado');
        return;
    }

    let detailsHTML = `
        <div style="background-color: #2c3e50; color: #f5f7fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #3498db; margin-bottom: 20px;">Pedido ${order.orderNumber}</h3>
            <div style="background-color: #34495e; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Data:</strong> ${order.date}</p>
                <p style="margin: 5px 0;"><strong>Cliente:</strong> ${order.client}</p>
                <p style="margin: 5px 0;"><strong>Método de Pagamento:</strong> ${order.paymentMethod}</p>
            </div>
            <h4 style="color: #3498db; margin-bottom: 10px;">Itens do Pedido:</h4>
            <ul style="list-style-type: none; padding: 0; background-color: #34495e; border-radius: 5px; overflow: hidden;">
    `;

    order.items.forEach(item => {
        detailsHTML += `
            <li style="padding: 10px 15px; border-bottom: 1px solid #4a5868; display: flex; justify-content: space-between;">
                <span style="flex: 2;">${item.name}</span>
                <span style="flex: 1; text-align: center;">${Utils.formatQuantity(item.quantity, item.unit)} ${item.unit}</span>
                <span style="flex: 1; text-align: right;">${Utils.formatCurrency(item.price)}</span>
                <span style="flex: 1; text-align: right;">${Utils.formatCurrency(item.price * item.quantity)}</span>
            </li>
        `;
    });

    detailsHTML += `
            </ul>
            <div style="background-color: #34495e; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 5px 0;"><strong>Subtotal:</strong> ${Utils.formatCurrency(order.subtotal)}</p>
                <p style="margin: 5px 0;"><strong>Desconto:</strong> ${order.discountPercentage}%</p>
                <p style="margin: 10px 0; font-size: 1.2em; font-weight: bold;"><strong>Total:</strong> ${Utils.formatCurrency(order.total)}</p>
            </div>
    `;

    if (order.paymentMethod === 'Dinheiro' && order.change > 0) {
        detailsHTML += `
            <p style="margin-top: 15px;"><strong>Troco:</strong> ${Utils.formatCurrency(order.change)}</p>
        `;
    }

    detailsHTML += `</div>`;

    detailsContainer.innerHTML = detailsHTML;

    const modal = document.getElementById('order-details-modal');
    if (modal) {
        modal.style.display = 'block';
        modal.style.backgroundColor = '#1a2635';
        modal.style.color = '#f5f7fa';
        modal.style.padding = '20px';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
}

function showSuccessModal(orderNumber, total, discountPercentage, paymentMethod) {
    const modal = document.getElementById('successModal');
    const orderNumberSpan = document.getElementById('successOrderNumber');
    const orderTotalSpan = document.getElementById('successOrderTotal');
    const orderDiscountSpan = document.getElementById('successOrderDiscount');
    const orderPaymentSpan = document.getElementById('successOrderPayment');

    orderNumberSpan.textContent = orderNumber;
    orderTotalSpan.textContent = Utils.formatCurrency(total);
    orderDiscountSpan.textContent = discountPercentage + '%';
    orderPaymentSpan.textContent = paymentMethod;

    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close');
    const closeModalBtn = document.getElementById('closeSuccessModal');
    
    const closeModal = function() {
        modal.style.display = 'none';
    };

    closeBtn.onclick = closeModal;
    closeModalBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showEditOrderModal(orderNumber) {
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const order = salesHistory.find(order => order.orderNumber === orderNumber);

    if (!order) {
        alert('Pedido não encontrado.');
        return;
    }

    const editOrderNumber = document.getElementById('editOrderNumber');
    const editOrderDate = document.getElementById('editOrderDate');
    const editClientName = document.getElementById('editClientName');
    const editDiscount = document.getElementById('editDiscount');
    const editPaymentMethod = document.getElementById('editPaymentMethod');

    if (editOrderNumber) editOrderNumber.textContent = order.orderNumber;
    if (editOrderDate) editOrderDate.textContent = order.date;
    if (editClientName) editClientName.value = order.client;
    if (editDiscount) editDiscount.value = order.discountPercentage;
    if (editPaymentMethod) editPaymentMethod.value = order.paymentMethod;

    const modal = document.getElementById('editOrderModal');
    if (modal) {
        modal.style.display = 'block';
        applyDarkThemeToEditModal(modal);
    } else {
        console.error('Modal de edição não encontrado');
    }
}

// Certifique-se de que esta função esteja definida no arquivo modals.js
function applyDarkThemeToEditModal(modal) {
    modal.style.setProperty('background-color', '#2c3e50', 'important');
    modal.style.setProperty('color', '#f5f7fa', 'important');

    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.setProperty('background-color', '#34495e', 'important');
        modalContent.style.setProperty('color', '#f5f7fa', 'important');
    }

    const modalHeader = modal.querySelector('.modal-header');
    if (modalHeader) {
        modalHeader.style.setProperty('border-bottom', '1px solid #4a5868', 'important');
        modalHeader.style.setProperty('color', '#3498db', 'important');
    }

    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.style.setProperty('background-color', '#2c3e50', 'important');
    }

    const inputs = modal.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.style.setProperty('background-color', '#34495e', 'important');
        input.style.setProperty('color', '#f5f7fa', 'important');
        input.style.setProperty('border', '1px solid #4a5868', 'important');
    });

    const labels = modal.querySelectorAll('label');
    labels.forEach(label => {
        label.style.setProperty('color', '#f5f7fa', 'important');
    });

    const saveButton = modal.querySelector('button[type="submit"]');
    if (saveButton) {
        saveButton.style.setProperty('background-color', '#3498db', 'important');
        saveButton.style.setProperty('color', '#ffffff', 'important');
        saveButton.style.setProperty('border', 'none', 'important');
    }

    // Adicionar este estilo para o fundo branco que está aparecendo
    const whiteBackground = modal.querySelector('div[style*="background-color: rgb(255, 255, 255)"]');
    if (whiteBackground) {
        whiteBackground.style.setProperty('background-color', '#34495e', 'important');
    }
}

function closeEditOrderModal() {
    const modal = document.getElementById('editOrderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Exportar todas as funções que precisam ser acessíveis de outros arquivos
export {
    openNewOrderModal,
    closeNewOrderModal,
    showOrderDetails,
    showSuccessModal,
    closeSuccessModal,
    showEditOrderModal,
    closeEditOrderModal,
    closeAllModals
};