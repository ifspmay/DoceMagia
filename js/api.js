// ========================================
// CONFIGURAÇÃO DA API
// ========================================

const API_URL = 'http://localhost:8080/api/v1';

// ========================================
// FUNÇÕES DE REQUISIÇÃO
// ========================================

//**
// * Faz uma requisição GET para a API
//

async function get(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
		if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Erro na requisição GET:', error);
        throw error;
    }
}

/**
 * Faz uma requisição POST para a API
 */
async function post(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Erro na requisição POST:', error);
        throw error;
    }
}

/**
 * Faz uma requisição PUT para a API
 */
async function put(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Erro na requisição PUT:', error);
        throw error;
    }
}

/**
 * Faz uma requisição DELETE para a API
 */
async function del(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('❌ Erro na requisição DELETE:', error);
        throw error;
    }
}

// ========================================
// API DE CATEGORIAS
// ========================================

const categoriaApi = {
    listarTodas: () => get('/categorias'),
    listarAtivas: () => get('/categorias/ativas'),
    buscarPorId: (id) => get(`/categorias/${id}`),
    buscarPorSlug: (slug) => get(`/categorias/slug/${slug}`),
};

// ========================================
// API DE PRODUTOS
// ========================================

const produtoApi = {
    listarTodos: () => get('/produtos'),
    listarPaginado: (page = 0, size = 10) => 
        get(`/produtos/paginado?page=${page}&size=${size}`),
    buscarPorId: (id) => get(`/produtos/${id}`),
    buscarPorCategoria: (categoriaId) => 
        get(`/produtos/categoria/${categoriaId}`),
    buscarDestaques: () => get('/produtos/destaques'),
    buscarAvancada: (filtros) => {
        const params = new URLSearchParams();
        if (filtros.termo) params.append('termo', filtros.termo);
        if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
        if (filtros.minPreco) params.append('minPreco', filtros.minPreco);
        if (filtros.maxPreco) params.append('maxPreco', filtros.maxPreco);
        if (filtros.apenasDestaque) params.append('apenasDestaque', filtros.apenasDestaque);
        if (filtros.page !== undefined) params.append('page', filtros.page);
        if (filtros.size !== undefined) params.append('size', filtros.size);
		
		return get(`/produtos/busca?${params.toString()}`);
    },
};

// ========================================
// API DE AVALIAÇÕES
// ========================================

const avaliacaoApi = {
    listarPorProduto: (produtoId) => 
        get(`/avaliacoes/produto/${produtoId}`),
    listarUltimas: (produtoId, limit = 5) => 
        get(`/avaliacoes/produto/${produtoId}/ultimas?limit=${limit}`),
};