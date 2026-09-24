// ========================================
// UTILITÁRIOS DE FORMATAÇÃO
// ========================================

/**
 * Formata um valor para moeda brasileira (R$)
 */
export function formatPrice(value) {
    if (value === null || value === undefined) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Formata uma data para o padrão brasileiro
 */
export function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

/**
 * Calcula o percentual de desconto
 */
export function calcularDesconto(precoOriginal, precoPromocional) {
    if (!precoPromocional || precoPromocional >= precoOriginal) return 0;
    
    return Math.round(((precoOriginal - precoPromocional) / precoOriginal) * 100);
}

/**
 * Trunca um texto para um tamanho máximo
 */
export function truncateText(text, maxLength = 80) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
}

/**
 * Gera um slug a partir de um texto
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}