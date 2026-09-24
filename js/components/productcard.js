// ========================================
// COMPONENTE: PRODUCT CARD
// ========================================

import { formatPrice, calcularDesconto, truncateText } from '../utils/formatters.js';

/**
 * Cria o HTML de um card de produto
 */
export function createProductCard(product, onAddToCart) {
    const precoFinal = product.precoPromocional || product.preco;
    const temDesconto = product.precoPromocional !== null && 
                        product.precoPromocional < product.preco;
    const desconto = temDesconto ? calcularDesconto(product.preco, product.precoPromocional) : 0;

    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img 
                src="${product.imagem || '/assets/images/placeholder.jpg'}" 
                alt="${product.nome}"
                loading="lazy"
                onerror="this.src='/assets/images/placeholder.jpg'"
            />
            ${temDesconto ? `<span class="discount-badge">-${desconto}%</span>` : ''}
            ${product.destaque ? `<span class="featured-badge">⭐ Destaque</span>` : ''}
        </div>
        
        <div class="product-info">
            <div class="product-name">
                <a href="#" data-product-id="${product.id}" class="product-link">
                    ${product.nome}
                </a>
            </div>
            
            <div class="product-meta">
                <span class="category">
                    ${product.categoria.icone} ${product.categoria.nome}
                </span>
                <span class="rating">⭐ ${product.avaliacao.toFixed(1)}</span>
            </div>

            <div class="product-description">
                ${truncateText(product.descricao, 80)}
            </div>

            <div class="product-footer">
                <div class="price-section">
                    ${temDesconto ? `
                        <span class="old-price">${formatPrice(product.preco)}</span>
                        <span class="current-price">${formatPrice(precoFinal)}</span>
                    ` : `
                        <span class="current-price">${formatPrice(product.preco)}</span>
                    `}
                </div>

                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <span>+</span> Adicionar
                </button>
            </div>

            <div class="product-extras">
                <span>⏱️ ${product.tempoPreparo} min</span>
                <span>📦 ${product.peso}</span>
            </div>
        </div>
    `;

    // Evento de abrir detalhes do produto
    const link = card.querySelector('.product-link');
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const event = new CustomEvent('productDetail', {
            detail: { productId: product.id }
        });
        document.dispatchEvent(event);
    });

    // Evento de adicionar ao carrinho
    const addBtn = card.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => {
        if (onAddToCart) {
            onAddToCart(product);
        }
    });

    return card;
}

/**
 * Renderiza uma lista de produtos em um container
 */
export function renderProducts(container, products, onAddToCart) {
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros de busca</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    products.forEach(product => {
        const card = createProductCard(product, onAddToCart);
        container.appendChild(card);
    });
}