// ========================================
// APLICAÇÃO PRINCIPAL
// ========================================

import { formatPrice } from './utils/formatters.js';
import { renderProducts } from './components/ProductCard.js';
import { renderCategories } from './components/CategoryFilter.js';

// ========================================
// ESTADO DA APLICAÇÃO
// ========================================

const state = {
    produtos: [],
    categorias: [],
    produtosFiltrados: [],
    carrinho: [],
    filtros: {
        termo: '',
        categoriaId: null,
        sort: 'nome',
        page: 0,
        size: 10,
    },
    paginacao: {
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
    },
    isLoading: false,
};

// ========================================
// ELEMENTOS DO DOM
// ========================================

const elements = {
    productsContainer: document.getElementById('productsContainer'),
    featuredContainer: document.getElementById('featuredProducts'),
    categoriesContainer: document.getElementById('categoriesContainer'),
    searchInput: document.getElementById('searchInput'),
    categoryFilter: document.getElementById('categoryFilter'),
    sortFilter: document.getElementById('sortFilter'),
    clearFilters: document.getElementById('clearFilters'),
    pagination: document.getElementById('pagination'),
    cartBtn: document.getElementById('cartBtn'),
    cartCount: document.getElementById('cartCount'),
    cartModal: document.getElementById('cartModal'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    productModal: document.getElementById('productModal'),
    productDetailContent: document.getElementById('productDetailContent'),
};

// ========================================
// FUNÇÕES DE CARREGAMENTO
// ========================================

async function loadCategories() {
    try {
        const categorias = await categoriaApi.listarAtivas();
        state.categorias = categorias;
        return categorias;
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        return [];
    }
}

async function loadProducts() {
    state.isLoading = true;
    showLoading(elements.productsContainer);

    try {
		const { termo, categoriaId, sort, page, size } = state.filtros;
        const result = await produtoApi.buscarAvancada({
            termo: termo || undefined,
            categoriaId: categoriaId || undefined,
            page,
            size,
        });

        state.produtos = result.content;
        state.produtosFiltrados = result.content;
        state.paginacao = {
            totalElements: result.totalElements,
            totalPages: result.totalPages,
            currentPage: page,
        };

        renderProducts(elements.productsContainer, state.produtosFiltrados, addToCart);
        renderPagination();
        
        return result.content;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showError(elements.productsContainer, 'Erro ao carregar produtos');
        return [];
    } finally {
        state.isLoading = false;
    }
}

async function loadFeaturedProducts() {
    try {
        const produtos = await produtoApi.buscarDestaques();
        renderProducts(elements.featuredContainer, produtos, addToCart);
        return produtos;
    } catch (error) {
        console.error('Erro ao carregar produtos em destaque:', error);
        return [];
    }
}

// ========================================
// FUNÇÕES DE RENDERIZAÇÃO
// ========================================

function showLoading(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Carregando...</p>
        </div>
    `;
}

function showError(container, message) {
    if (!container) return;
    container.innerHTML = `
        <div class="empty-state">
            <h3>😕 Ops!</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn-primary" style="margin-top: 15px;">
                Tentar novamente
            </button>
        </div>
    `;
}

function renderPagination() {
    if (!elements.pagination) return;
    
    const { currentPage, totalPages } = state.paginacao;
    
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }

    let html = `
        <button ${currentPage === 0 ? 'disabled' : ''} data-page="${currentPage - 1}">
            ← Anterior
        </button>
    `;

    for (let i = 0; i < totalPages; i++) {
        if (i === 0 || i === totalPages - 1 || Math.abs(i - currentPage) <= 1) {
            html += `
                <button data-page="${i}" class="${i === currentPage ? 'active' : ''}">
                    ${i + 1}
                </button>
            `;
        } else if (Math.abs(i - currentPage) === 2) {
            html += `<span>...</span>`;
        }
    }

    html += `
        <button ${currentPage >= totalPages - 1 ? 'disabled' : ''} data-page="${currentPage + 1}">
            Próximo →
        </button>
        <span class="page-info">
            Página ${currentPage + 1} de ${totalPages}
        </span>
    `;

    elements.pagination.innerHTML = html;

    // Eventos de paginação
    elements.pagination.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (page >= 0 && page < totalPages) {
                state.filtros.page = page;
                loadProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function renderCategoryFilter() {
    if (!elements.categoryFilter) return;
    
    elements.categoryFilter.innerHTML = '<option value="">Todas categorias</option>';
    
    state.categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.icone} ${cat.nome}`;
        elements.categoryFilter.appendChild(option);
    });

    if (state.filtros.categoriaId) {
        elements.categoryFilter.value = state.filtros.categoriaId;
    }
}

// ========================================
// FUNÇÕES DO CARRINHO
// ========================================

function addToCart(product) {
    const existingItem = state.carrinho.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantidade += 1;
    } else {
        state.carrinho.push({
            ...product,
            quantidade: 1,
        });
    }
    
    updateCartUI();
    showNotification(`${product.nome} adicionado ao carrinho! 🎉`);
}

function removeFromCart(productId) {
    state.carrinho = state.carrinho.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
}

function updateCartUI() {
    const totalItems = state.carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    if (elements.cartCount) {
        elements.cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    if (!elements.cartItems) return;
    
    if (state.carrinho.length === 0) {
        elements.cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        elements.cartTotal.textContent = 'R$ 0,00';
        return;
    }

    let html = '';
    let total = 0;

    state.carrinho.forEach(item => {
        const preco = item.precoPromocional || item.preco;
        const subtotal = preco * item.quantidade;
        total += subtotal;

        html += `
            <div class="cart-item">
                <div>
                    <div class="item-name">${item.nome}</div>
                    <div class="item-price">${formatPrice(preco)}</div>
                </div>
                <div>
                    <span>Qtd: ${item.quantidade}</span>
                    <button class="remove-item" data-id="${item.id}">✕</button>
                </div>
            </div>
        `;
    });

    elements.cartItems.innerHTML = html;
    elements.cartTotal.textContent = formatPrice(total);

    elements.cartItems.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(parseInt(btn.dataset.id));
        });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideUp 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// EVENTOS
// ========================================

function setupEvents() {
    let searchTimeout;
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                state.filtros.termo = e.target.value;
                state.filtros.page = 0;
                loadProducts();
            }, 500);
        });
    }

    if (elements.categoryFilter) {
        elements.categoryFilter.addEventListener('change', (e) => {
            state.filtros.categoriaId = e.target.value ? parseInt(e.target.value) : null;
            state.filtros.page = 0;
            loadProducts();
        });
    }

    if (elements.sortFilter) {
        elements.sortFilter.addEventListener('change', (e) => {
            state.filtros.sort = e.target.value;
            loadProducts();
        });
    }

    if (elements.clearFilters) {
        elements.clearFilters.addEventListener('click', () => {
            state.filtros.termo = '';
            state.filtros.categoriaId = null;
            state.filtros.page = 0;
            
            if (elements.searchInput) elements.searchInput.value = '';
            if (elements.categoryFilter) elements.categoryFilter.value = '';
            if (elements.sortFilter) elements.sortFilter.value = 'nome';
            
            loadProducts();
        });
    }

    if (elements.cartBtn) {
        elements.cartBtn.addEventListener('click', () => {
            renderCartItems();
            elements.cartModal.classList.add('show');
        });
    }

    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').classList.remove('show');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', () => {
            if (state.carrinho.length === 0) {
                showNotification('Seu carrinho está vazio!');
                return;
            }
            
            const total = state.carrinho.reduce((sum, item) => {
                const preco = item.precoPromocional || item.preco;
                return sum + (preco * item.quantidade);
            }, 0);
            
            alert(`Pedido finalizado!\nTotal: ${formatPrice(total)}\nItens: ${state.carrinho.length}`);
            state.carrinho = [];
            updateCartUI();
            renderCartItems();
            elements.cartModal.classList.remove('show');
            showNotification('Pedido finalizado com sucesso! 🎉');
        });
    }

    document.addEventListener('productDetail', async (e) => {
        const productId = e.detail.productId;
        await showProductDetail(productId);
    });

    document.addEventListener('categoryFilter', (e) => {
        const { categoryId } = e.detail;
        
        state.filtros.categoriaId = categoryId;
        state.filtros.page = 0;
        
        if (elements.categoryFilter) {
            elements.categoryFilter.value = categoryId || '';
        }
        
        loadProducts();
        
        document.querySelector('.products-section')?.scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
}

// ========================================
// DETALHE DO PRODUTO
// ========================================

async function showProductDetail(productId) {
    try {
        const product = await produtoApi.buscarPorId(productId);
        
        if (!product) {
            showNotification('Produto não encontrado');
            return;
        }

        const precoFinal = product.precoPromocional || product.preco;
        const temDesconto = product.precoPromocional !== null && 
                            product.precoPromocional < product.preco;

        elements.productDetailContent.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <img 
                        src="${product.imagem || '/assets/images/placeholder.jpg'}" 
                        alt="${product.nome}"
                        style="width: 100%; border-radius: 8px;"
                        onerror="this.src='/assets/images/placeholder.jpg'"
                    />
                </div>
                <div>
                    <h2 style="color: #8B4513;">${product.nome}</h2>
                    <p style="color: #666; margin: 10px 0;">
                        ${product.categoria.icone} ${product.categoria.nome}
                    </p>
                    <div style="margin: 15px 0;">
                        ${temDesconto ? `
                            <span style="text-decoration: line-through; color: #999; font-size: 1.1rem;">
                                ${formatPrice(product.preco)}
                            </span>
                            <span style="font-size: 2rem; font-weight: bold; color: #8B4513; margin-left: 10px;">
                                ${formatPrice(precoFinal)}
                            </span>
                            <span style="background: #dc3545; color: white; padding: 2px 10px; border-radius: 20px; font-size: 0.9rem; margin-left: 10px;">
                                -${product.percentualDesconto}%
                            </span>
                        ` : `
                            <span style="font-size: 2rem; font-weight: bold; color: #8B4513;">
                                ${formatPrice(product.preco)}
                            </span>
                        `}
                    </div>
                    <div style="margin: 15px 0;">
                        <span>⭐ ${product.avaliacao.toFixed(1)}</span>
                        <span style="margin-left: 20px;">📦 ${product.peso}</span>
                        <span style="margin-left: 20px;">⏱️ ${product.tempoPreparo} min</span>
                    </div>
                    <div style="margin: 20px 0;">
                        <h4>Descrição</h4>
                        <p style="color: #666;">${product.descricao}</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <h4>Ingredientes</h4>
                        <p style="color: #666;">${product.ingredientes}</p>
                    </div>
                    <button 
                        class="btn-primary" 
                        style="width: 100%; padding: 15px; font-size: 1.1rem;"
                        onclick="window.addToCartFromDetail(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                    >
                        🛒 Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;

        elements.productModal.classList.add('show');

    } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        showNotification('Erro ao carregar detalhes do produto');
    }
}

window.addToCartFromDetail = function(product) {
    addToCart(product);
    elements.productModal.classList.remove('show');
};

// ========================================
// INICIALIZAÇÃO
// ========================================

async function init() {
    console.log('🍰 Doceria Artesanal - Iniciando...');
    
    await loadCategories();
    renderCategoryFilter();
    
    if (elements.categoriesContainer) {
        renderCategories(elements.categoriesContainer, state.categorias, state.produtos);
    }
    
    await loadFeaturedProducts();
    await loadProducts();
    setupEvents();
    
    console.log('✅ Aplicação inicializada com sucesso!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addToCart = addToCart;
window.showNotification = showNotification;
window.formatPrice = formatPrice;