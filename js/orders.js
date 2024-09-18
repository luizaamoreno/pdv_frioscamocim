import * as Utils from './utils.js';
import { cart, clearCart, updateCartDisplay, saveCart } from './cart.js';
import { products, updateProductList } from './products.js';
import { showSuccessModal } from './modals.js';

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

function updateOrderDetailsColors() {
    const modal = document.getElementById('order-details-modal');
    if (modal && modal.style.display === 'block') {
        modal.style.backgroundColor = '#2c3e50';
        modal.style.color = '#f5f7fa';

        const headerTitle = modal.querySelector('h3');
        if (headerTitle) {
            headerTitle.style.color = '#3498db';
        }

        const orderInfo = modal.querySelector('.order-info');
        if (orderInfo) {
            orderInfo.style.backgroundColor = '#34495e';
        }

        const itemsList = modal.querySelector('.items-list');
        if (itemsList) {
            itemsList.style.backgroundColor = '#34495e';
            const items = itemsList.querySelectorAll('li');
            items.forEach(item => {
                item.style.borderBottom = '1px solid #4a5868';
            });
        }

        const orderSummary = modal.querySelector('.order-summary');
        if (orderSummary) {
            orderSummary.style.backgroundColor = '#34495e';
        }
    }
}

function updateModalColors() {
    const modal = document.getElementById('history-modal');
    if (modal) {
        modal.style.backgroundColor = '#2c3e50'; // Cor de fundo escura
        modal.style.color = '#f5f7fa'; // Texto claro
    
        // Atualizar inputs e selects dentro do modal
        const inputs = modal.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.backgroundColor = '#34495e'; // Fundo escuro para inputs
            input.style.color = '#f5f7fa'; // Texto claro para inputs
            input.style.border = '1px solid #4a5868'; // Borda visível
        });

        updateOrderDetailsColors();

        // Atualizar a tabela
        const table = modal.querySelector('table');
        if (table) {
            table.style.color = '#f5f7fa'; // Texto claro para a tabela
            table.style.borderCollapse = 'collapse';
            
            const headerCells = table.querySelectorAll('th');
            headerCells.forEach(cell => {
                cell.style.backgroundColor = '#3498db'; // Azul para cabeçalho
                cell.style.color = '#ffffff';
                cell.style.padding = '10px';
            });

            const rows = table.querySelectorAll('tr:not(:first-child)');
            rows.forEach((row, index) => {
                row.style.backgroundColor = index % 2 === 0 ? '#2c3e50' : '#34495e'; // Alternância de cores
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.padding = '10px';
                    cell.style.borderBottom = '1px solid #4a5868';
                });
            });
        }

        //Atualizar modal de edição do pedido
        const editOrderModal = document.getElementById('editOrderModal');
        if (editOrderModal && editOrderModal.style.display === 'block') {
            editOrderModal.style.backgroundColor = '#2c3e50';
            editOrderModal.style.color = '#f5f7fa';
    
            const inputs = editOrderModal.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.style.backgroundColor = '#34495e';
                input.style.color = '#f5f7fa';
                input.style.border = '1px solid #4a5868';
            });
    
            const saveButton = editOrderModal.querySelector('button[type="submit"]');
            if (saveButton) {
                saveButton.style.backgroundColor = '#3498db';
                saveButton.style.color = '#ffffff';
                saveButton.style.border = 'none';
            }
        }
        
        //Atualizar modal de detalhes do pedido
        const orderDetailsModal = document.getElementById('order-details-modal');
        if (orderDetailsModal && orderDetailsModal.style.display === 'block') {
            orderDetailsModal.style.backgroundColor = '#2c3e50';
            orderDetailsModal.style.color = '#f5f7fa';
    
            const detailsCards = orderDetailsModal.querySelectorAll('.order-info > div');
            detailsCards.forEach(card => {
                card.style.backgroundColor = '#34495e';
                card.style.border = '1px solid #4a5868';
            });
    
            const itemsList = orderDetailsModal.querySelector('.items-list');
            if (itemsList) {
                itemsList.style.backgroundColor = '#34495e';
                itemsList.style.border = '1px solid #4a5868';
                const items = itemsList.querySelectorAll('li');
                items.forEach(item => {
                    item.style.borderBottom = '1px solid #4a5868';
                });
            }
    
            const orderSummary = orderDetailsModal.querySelector('.order-summary');
            if (orderSummary) {
                orderSummary.style.backgroundColor = '#34495e';
                orderSummary.style.border = '1px solid #4a5868';
            }
        }
    
        // Atualizar botões de ação
        const actionButtons = modal.querySelectorAll('.btn-action');
        actionButtons.forEach(button => {
            button.style.backgroundColor = '#3498db';
            button.style.color = '#ffffff';
            button.style.border = 'none';
            button.style.padding = '5px 10px';
            button.style.margin = '2px';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
        });
    }
}

function updateModalStyles() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.style.display === 'block') {
            modal.style.backgroundColor = '#1a2635';
            modal.style.color = '#f5f7fa';
            modal.style.padding = '20px';
            modal.style.borderRadius = '10px';
            modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.backgroundColor = '#2c3e50';
                modalContent.style.padding = '20px';
                modalContent.style.borderRadius = '8px';
            }

            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.style.color = '#f5f7fa';
                closeBtn.style.opacity = '0.7';
                closeBtn.style.fontSize = '28px';
                closeBtn.style.fontWeight = 'bold';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '10px';
                closeBtn.style.right = '15px';
            }
        }
    });
}

function showCashPayment() {
    const cashPaymentDiv = document.getElementById('cash-payment');
    if (cashPaymentDiv) {
        cashPaymentDiv.style.display = 'block';
    }
}

function hideCashPayment() {
    const cashPaymentDiv = document.getElementById('cash-payment');
    if (cashPaymentDiv) {
        cashPaymentDiv.style.display = 'none';
    }
}

function handlePaymentMethodChange() {
    const paymentMethodElement = document.getElementById('payment-method');
    if (paymentMethodElement) {
        if (paymentMethodElement.value === 'cash') {
            showCashPayment();
        } else {
            hideCashPayment();
        }
    }
}

function updateChangeAmount() {
    const totalElement = document.getElementById('cart-total');
    const cashAmountElement = document.getElementById('cash-amount');
    const changeAmountElement = document.getElementById('change-amount');
    
    if (totalElement && cashAmountElement && changeAmountElement) {
        const total = parseCurrency(totalElement.textContent.replace('R$ ', ''));
        const cashAmount = parseCurrency(cashAmountElement.value);
        
        if (!isNaN(cashAmount) && cashAmount >= total) {
            const change = cashAmount - total;
            changeAmountElement.textContent = formatCurrency(change);
        } else {
            changeAmountElement.textContent = 'R$ 0,00';
        }
    }
}

const paymentMethods = {
    'credit': 'Cartão de Crédito',
    'debit': 'Cartão de Débito',
    'pix': 'PIX',
    'cash': 'Dinheiro',
    'food-voucher': 'Vale-alimentação'
};

function finalizeSale() {
    const paymentMethodElement = document.getElementById('payment-method');
    const customerNameElement = document.getElementById('customer-name');
    const discountPercentageElement = document.getElementById('discount-percentage');

    if (!paymentMethodElement || !customerNameElement || !discountPercentageElement) {
        console.error('Um ou mais elementos necessários não foram encontrados');
        return;
    }

    const paymentMethod = paymentMethodElement.value;
    const nomeCliente = customerNameElement.value.trim();

    if (!paymentMethod) {
        alert('Por favor, selecione um método de pagamento.');
        return;
    }

    if (!nomeCliente) {
        alert('Por favor, insira o nome do cliente.');
        customerNameElement.focus();
        return;
    }

    if (cart.length === 0) {
        alert('O carrinho está vazio. Adicione itens antes de finalizar a venda.');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountPercentage = parseFloat(discountPercentageElement.value) || 0;
    const discountAmount = subtotal * (discountPercentage / 100);
    const total = subtotal - discountAmount;

    let change = 0;
    if (paymentMethod === 'cash') {
        const cashAmountElement = document.getElementById('cash-amount');
        if (!cashAmountElement) {
            console.error('Elemento cash-amount não encontrado');
            return;
        }
        const cashAmount = parseFloat(cashAmountElement.value);
        if (isNaN(cashAmount) || cashAmount < total) {
            alert('Valor em dinheiro inválido ou insuficiente.');
            return;
        }
        change = cashAmount - total;
    }

    const orderNumber = generateOrderNumber();
    const orderDetails = {
        orderNumber: orderNumber,
        items: [...cart],
        subtotal: subtotal,
        discountPercentage: discountPercentage,
        total: total,
        paymentMethod: paymentMethods[paymentMethod] || paymentMethod,
        change: change,
        date: Utils.getCurrentDateTimeBrasilia(),
        client: nomeCliente
    };

    addSaleToHistory(orderDetails);
    generateReceipt(orderDetails);

    cart.forEach(item => {
        const product = products.find(p => p.code === item.code);
        if (product) {
            product.quantity -= item.quantity;
        }
    });

    // Limpar o carrinho
    clearCart();
    
    // Atualizar a exibição do carrinho
    updateCartDisplay();
    
    // Fechar o modal do carrinho, se estiver aberto
    const cartMenu = document.getElementById('cart-menu');
    if (cartMenu) {
        cartMenu.style.display = 'none';
    }
    
    // Resetar campos
    customerNameElement.value = '';
    discountPercentageElement.value = '0';
    
    localStorage.setItem('products', JSON.stringify(products));
    updateProductList(document.getElementById('category-select')?.value);

    showSuccessModal(orderNumber, total, discountPercentage, paymentMethods[paymentMethod]);
}

function generateOrderNumber() {
    let lastOrderNumber = localStorage.getItem('lastOrderNumber') || 0;
    lastOrderNumber = parseInt(lastOrderNumber) + 1;
    localStorage.setItem('lastOrderNumber', lastOrderNumber);
    return `PED${lastOrderNumber.toString().padStart(6, '0')}`;
}

function addSaleToHistory(sale) {
    let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    salesHistory.push(sale);
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
}

function viewOrderHistory() {
    console.log('Visualizando histórico de pedidos');
    Utils.checkAndFixDates();
    filterOrders();
    
    const historyModal = document.getElementById('history-modal');
    if (historyModal) {
        historyModal.style.display = 'block';
        setTimeout(updateModalColors, 0);
        setTimeout(updateModalStyles, 0); // Chama updateModalColors após o modal ser exibido
    } else {
        console.error('Modal de histórico não encontrado');
    }
}

function renderOrders(orders) {
    const historyContainer = document.getElementById('order-history-body');
    historyContainer.innerHTML = '';
    if (orders.length === 0) {
        historyContainer.innerHTML = '<tr><td colspan="5">Nenhum pedido encontrado.</td></tr>';
    } else {
        const currentDate = Utils.getCurrentDateTimeBrasilia().split(',')[0].trim();
        const isAdmin = localStorage.getItem('userType') === 'admin';
        orders.forEach((order, index) => {
            const orderDate = order.date.split(',')[0].trim();
            const isToday = orderDate === currentDate;
            const row = document.createElement('tr');
            row.style.backgroundColor = index % 2 === 0 ? '#2c3e50' : '#34495e';
            row.style.color = '#f5f7fa';
            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${order.date}</td>
                <td>${order.client}</td>
                <td>${Utils.formatCurrency(order.total)}</td>
                <td>
                    <button class="btn-action" onclick="showOrderDetails('${order.orderNumber}')" title="Ver Detalhes">
                        <i class="fas fa-eye"></i><span>Detalhes</span>
                    </button>
                    ${isAdmin ? `
                    <button class="btn-action" onclick="editOrder('${order.orderNumber}')" ${isToday ? '' : 'disabled'} title="${isToday ? 'Alterar' : 'Não editável'}">
                        <i class="fas fa-edit"></i><span>Alterar</span>
                    </button>
                    <button class="btn-action" onclick="confirmDeleteOrder('${order.orderNumber}')" ${isToday ? '' : 'disabled'} title="${isToday ? 'Excluir' : 'Não excluível'}">
                        <i class="fas fa-trash"></i><span>Excluir</span>
                    </button>
                    ` : ''}
                    <button class="btn-action" onclick="viewReceipt('${order.orderNumber}')" title="Visualizar Recibo">
                        <i class="fas fa-file-alt"></i><span>Recibo</span>
                    </button>
                </td>
            `;
            historyContainer.appendChild(row);
        });
    }
    setTimeout(updateModalColors, 0);
}

function filterOrders() {
    const searchTerm = document.getElementById('search-orders').value.toLowerCase();
    const filterValue = document.getElementById('filter-orders').value;
    const filterDateValue = document.getElementById('filter-date').value;

    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const currentDate = Utils.getCurrentDateTimeBrasilia().split(',')[0].trim();
    
    let filteredOrders = salesHistory.filter(order => {
        const orderDate = order.date.split(',')[0].trim();
        const formattedFilterDate = filterDateValue ? Utils.formatDateForComparison(filterDateValue) : '';
        
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm) ||
                              order.client.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' || 
                              (filterValue === 'editable' && orderDate === currentDate) ||
                              (filterValue === 'non-editable' && orderDate !== currentDate);
        const matchesDate = !filterDateValue || orderDate === formattedFilterDate;

        return matchesSearch && matchesFilter && matchesDate;
    });

    renderOrders(filteredOrders);
}

// Função auxiliar para formatar a data do filtro
function formatDateForComparison(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function editOrder(orderNumber) {
    if (!checkAdminPermission()) return;
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const order = salesHistory.find(order => order.orderNumber === orderNumber);

    if (!order) {
        alert('Pedido não encontrado.');
        return;
    }

    const currentDate = Utils.getCurrentDateTimeBrasilia();
    if (!Utils.isSameDay(order.date, currentDate)) {
        alert('Não é possível editar pedidos de dias anteriores.');
        return;
    }

    // Preencher o modal de edição com os detalhes do pedido
    document.getElementById('editOrderNumber').textContent = order.orderNumber;
    document.getElementById('editOrderDate').textContent = order.date;
    document.getElementById('editClientName').value = order.client;
    document.getElementById('editDiscount').value = order.discountPercentage;
    document.getElementById('editPaymentMethod').value = Object.keys(paymentMethods).find(key => paymentMethods[key] === order.paymentMethod) || '';

    // Exibir o modal de edição
    const editModal = document.getElementById('editOrderModal');
    if (editModal) {
        editModal.style.display = 'block';
        // Usar setTimeout para garantir que o modal esteja totalmente renderizado antes de aplicar os estilos
        setTimeout(() => {
            applyDarkThemeToEditModal(editModal);
        }, 0);
    } else {
        console.error('Modal de edição não encontrado');
    }
}

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

function updateEditOrderModalColors() {
    const modal = document.getElementById('editOrderModal');
    if (modal) {
        modal.style.backgroundColor = '#2c3e50';
        modal.style.color = '#f5f7fa';

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.backgroundColor = '#34495e';
            modalContent.style.color = '#f5f7fa';
        }

        const modalHeader = modal.querySelector('.modal-header');
        if (modalHeader) {
            modalHeader.style.borderBottom = '1px solid #4a5868';
            modalHeader.style.color = '#3498db';
        }

        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.backgroundColor = '#2c3e50';
        }

        const inputs = modal.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.backgroundColor = '#34495e';
            input.style.color = '#f5f7fa';
            input.style.border = '1px solid #4a5868';
        });

        const labels = modal.querySelectorAll('label');
        labels.forEach(label => {
            label.style.color = '#f5f7fa';
        });

        const saveButton = modal.querySelector('button[type="submit"]');
        if (saveButton) {
            saveButton.style.backgroundColor = '#3498db';
            saveButton.style.color = '#ffffff';
            saveButton.style.border = 'none';
        }
    }
}

function saveOrderChanges(orderNumber) {
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const orderIndex = salesHistory.findIndex(order => order.orderNumber === orderNumber);

    if (orderIndex === -1) {
        alert('Pedido não encontrado.');
        return;
    }

    const newClient = document.getElementById('editClientName').value;
    const newDiscount = parseFloat(document.getElementById('editDiscount').value);
    const newPaymentMethod = document.getElementById('editPaymentMethod').value;

    if (newClient && !isNaN(newDiscount) && newPaymentMethod) {
        const order = salesHistory[orderIndex];
        const subtotal = order.subtotal;
        const discountAmount = subtotal * (newDiscount / 100);
        const newTotal = subtotal - discountAmount;

        order.client = newClient;
        order.discountPercentage = newDiscount;
        order.total = newTotal;
        order.paymentMethod = paymentMethods[newPaymentMethod];

        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

        alert('Pedido atualizado com sucesso!');
        document.getElementById('editOrderModal').style.display = 'none';
        viewOrderHistory();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function confirmDeleteOrder(orderNumber) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        deleteOrder(orderNumber);
    }
}

function deleteOrder(orderNumber) {
    if (!checkAdminPermission()) return;
    let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const orderIndex = salesHistory.findIndex(order => order.orderNumber === orderNumber);

    if (orderIndex === -1) {
        alert('Pedido não encontrado.');
        return;
    }

    const order = salesHistory[orderIndex];
    const currentDate = Utils.getCurrentDateTimeBrasilia();

    if (!Utils.isSameDay(order.date, currentDate)) {
        alert('Não é possível excluir pedidos de dias anteriores.');
        return;
    }

    order.items.forEach(item => {
        const product = products.find(p => p.code === item.code);
        if (product) {
            product.quantity += item.quantity;
        }
    });

    salesHistory.splice(orderIndex, 1);

    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    localStorage.setItem('products', JSON.stringify(products));

    alert('Pedido excluído com sucesso!');
    viewOrderHistory();
    updateProductList();
}

function viewReceipt(orderNumber) {
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const order = salesHistory.find(sale => sale.orderNumber === orderNumber);

    if (!order) {
        alert('Pedido não encontrado');
        return;
    }

    generateReceipt(order);
}

function generateReceipt(orderDetails) {
    // Implementação da geração do recibo (PDF)
    console.log('Gerando recibo para o pedido:', orderDetails.orderNumber);
    // Aqui você implementaria a lógica para gerar o PDF do recibo
    // Por exemplo, usando uma biblioteca como jsPDF
    if (typeof jspdf === 'undefined') {
        console.error('jsPDF não está carregado. Verifique se a biblioteca está incluída corretamente.');
        alert('Não foi possível gerar o recibo. Por favor, tente novamente mais tarde.');
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF({
        unit: 'mm',
        format: [80, 150 + (orderDetails.items.length * 10)]
    });

    const width = doc.internal.pageSize.getWidth();
    let y = 10;

    function centerText(text, y) {
        doc.text(text, width / 2, y, { align: 'center' });
    }
    
    function leftText(text, y) {
        doc.text(text, 5, y);
    }
    
    function rightText(text, y) {
        doc.text(text, width - 5, y, { align: 'right' });
    }
    
    function line(y) {
        doc.setLineWidth(0.1);
        doc.line(5, y, width - 5, y);
    }

    // Cabeçalho
    doc.setFontSize(12);
    centerText("MINI MERCADINHOS", y);
    y += 5;
    doc.setFontSize(10);
    centerText("CNPJ: 00.000.000/0001-00", y);
    y += 5;
    centerText("Rua Exemplo, 123 - Cidade - Estado", y);
    y += 5;
    centerText("CEP: 12345-678 - Tel: (11) 1234-5678", y);
    y += 7;

    line(y);
    y += 5;

    // Detalhes do pedido
    doc.setFontSize(10);
    leftText(`Pedido: ${orderDetails.orderNumber}`, y);
    y += 5;
    leftText(`Data: ${orderDetails.date}`, y);
    y += 5;
    leftText(`Cliente: ${orderDetails.client}`, y);
    y += 5;
    leftText(`Atendente: ${localStorage.getItem('loggedIn')}`, y);
    y += 7;

    line(y);
    y += 5;

    // Itens do pedido
    doc.setFontSize(10);
    centerText("RESUMO DO PEDIDO", y);
    y += 5;

    orderDetails.items.forEach((item) => {
        y += 5;
        leftText(`${item.name}`, y);
        y += 4;
        leftText(`${Utils.formatQuantity(item.quantity, item.unit)} ${item.unit} x ${Utils.formatCurrency(item.price)}`, y);
        rightText(Utils.formatCurrency(item.quantity * item.price), y);
    });

    y += 7;
    line(y);
    y += 7;

    // Total e pagamento
    doc.setFontSize(10);
    leftText("Subtotal:", y);
    rightText(Utils.formatCurrency(orderDetails.subtotal), y);
    y += 5;
    leftText(`Desconto (${orderDetails.discountPercentage.toLocaleString('pt-BR')}%):`, y);
    rightText(Utils.formatCurrency(orderDetails.subtotal * orderDetails.discountPercentage / 100), y);
    y += 5;
    doc.setFontSize(12);
    leftText("TOTAL:", y);
    rightText(Utils.formatCurrency(orderDetails.total), y);
    y += 7;

    doc.setFontSize(10);
    leftText(`Forma de Pagamento: ${orderDetails.paymentMethod}`, y);
    y += 5;
    if (orderDetails.paymentMethod === 'Dinheiro' && orderDetails.change > 0) {
        leftText("Troco:", y);
        rightText(Utils.formatCurrency(orderDetails.change), y);
        y += 5;
    }

    y += 7;
    line(y);
    y += 7;

    // Mensagem final
    doc.setFontSize(8);
    centerText("Obrigado pela preferência!", y);
    y += 4;
    centerText("Volte sempre!", y);

    // Salva o PDF
    doc.save(`cupom_fiscal_${orderDetails.orderNumber}.pdf`);
}

function checkAdminPermission() {
    if (localStorage.getItem('userType') !== 'admin') {
        alert('Você não tem permissão para realizar esta ação.');
        return false;
    }
    return true;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('#mobile-menu .menu-toggle');
    const mobileNav = document.querySelector('#mobile-menu .mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
        });

        // Fechar o menu ao clicar em um link
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
            });
        });
    }

    const paymentMethodElement = document.getElementById('payment-method');
    if (paymentMethodElement) {
        paymentMethodElement.addEventListener('change', handlePaymentMethodChange);
    }

    const cashAmountElement = document.getElementById('cash-amount');
    if (cashAmountElement) {
        cashAmountElement.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = (parseInt(value) / 100).toFixed(2);
            e.target.value = value.replace('.', ',');
            updateChangeAmount();
        });
    }
    
    Utils.checkAndFixDates();
    // Adicione aqui outros event listeners necessários
});

document.addEventListener('themeChanged', function() {
    updateModalStyles();
    updateModalColors();
    
    const editModal = document.getElementById('editOrderModal');
    if (editModal && editModal.style.display === 'block') {
        applyDarkThemeToEditModal(editModal);
    }
});

const editModalObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const editModal = document.getElementById('editOrderModal');
            if (editModal && editModal.style.display === 'block') {
                applyDarkThemeToEditModal(editModal);
            }
        }
    });
});

const editModal = document.getElementById('editOrderModal');
if (editModal) {
    editModalObserver.observe(editModal, { attributes: true, subtree: true, childList: true });
}

export {
    finalizeSale,
    viewOrderHistory,
    filterOrders,
    editOrder,
    saveOrderChanges,
    confirmDeleteOrder,
    deleteOrder,
    viewReceipt,
    renderOrders
};