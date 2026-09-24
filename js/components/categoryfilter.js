// ========================================
// COMPONENTE: CATEGORY FILTER
// ========================================

/**
 * Cria o HTML de um card de categoria
 */
export function createCategoryCard(category, count = 0) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.categoryId = category.id;
    card.dataset.categorySlug = category.slug;
    
    card.innerHTML = `
        <span class="icon">${category.icone || '📦'}</span>
        <div class="name">${category.nome}</div>
        ${count > 0 ? `<div class="count">${count} produtos</div>` : ''}
    `;

    card.addEventListener('click', () => {
        const event = new CustomEvent('categoryFilter', {
            detail: { 
                categoryId: category.id,
                categoryName: category.nome 
            }
        });
        document.dispatchEvent(event);
    });

    return card;
}

/**
 * Renderiza categorias em um container
 */
export function renderCategories(container, categories, products = []) {
    if (!container) return;
    
    if (!categories || categories.length === 0) {
        container.innerHTML = '<p>Nenhuma categoria encontrada</p>';
        return;
    }

    container.innerHTML = '';
    
    // Adiciona opção "Todas"
    const allCard = document.createElement('div');
    allCard.className = 'category-card';
    allCard.innerHTML = `
        <span class="icon">📋</span>
        <div class="name">Todos</div>
        <div class="count">${products.length} produtos</div>
    `;
    allCard.addEventListener('click', () => {
        const event = new CustomEvent('categoryFilter', {
            detail: { categoryId: null, categoryName: 'Todos' }
        });
        document.dispatchEvent(event);
    });
    container.appendChild(allCard);

    // Adiciona as categorias
    categories.forEach(category => {
        const count = products.filter(p => p.categoria.id === category.id).length;
        const card = createCategoryCard(category, count);
        container.appendChild(card);
    });
}