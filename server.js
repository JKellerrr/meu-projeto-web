const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const HOST = 'localhost';

// Mapa de tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Dados de exemplo para produtos
const produtos = [
    { id: 'produto1', nome: 'Notebook', preco: 2500.00, descricao: 'Notebook de alta performance' },
    { id: 'produto2', nome: 'Mouse', preco: 50.00, descricao: 'Mouse sem fio' },
    { id: 'produto3', nome: 'Teclado', preco: 150.00, descricao: 'Teclado mecânico RGB' },
    { id: 'produto4', nome: 'Monitor', preco: 600.00, descricao: 'Monitor 27" 144Hz' }
];

// Armazenamento de carrinhos por sessão (em produção, usar banco de dados)
const carrinosGlobais = {};

const server = http.createServer((req, res) => {
    // Habilita CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde a requisições OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // ROTAS DE API
    if (req.url.startsWith('/api/')) {
        handleApiRequest(req, res);
        return;
    }

    // SERVIR ARQUIVOS ESTÁTICOS
    let filePath = req.url === '/' ? '/pages/index.html' : req.url;
    if (filePath === '/index.html') {
        filePath = '/pages/index.html';
    }
    
    // Remove query string
    filePath = filePath.split('?')[0];
    
    // Remove barra inicial para evitar problemas com path.join no Windows
    filePath = filePath.replace(/^\/+/, '');
    
    // Monta caminho completo
    filePath = path.join(__dirname, filePath);
    
    // Previne acesso a diretórios acima (segurança)
    const realPath = path.resolve(filePath);
    const baseDir = path.resolve(__dirname);
    
    if (!realPath.startsWith(baseDir)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ erro: 'Acesso negado' }));
        return;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ erro: 'Arquivo não encontrado' }));
            } else if (err.code === 'EISDIR') {
                // Se for um diretório, tenta abrir index.html
                fs.readFile(path.join(filePath, 'index.html'), (err, content) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ erro: 'Erro no servidor' }));
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        res.end(content);
                    }
                });
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ erro: 'Erro no servidor' }));
            }
        } else {
            res.statusCode = 200;
            const ext = path.extname(filePath);
            const contentType = mimeTypes[ext] || 'text/plain';
            res.setHeader('Content-Type', contentType);
            res.end(content);
        }
    });
});

// Função para lidar com requisições de API
function handleApiRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // GET /api/produtos - Lista todos os produtos
    if (pathname === '/api/produtos' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            sucesso: true,
            dados: produtos,
            total: produtos.length
        }));
        return;
    }

    // GET /api/produtos/:id - Obtém um produto específico
    const produtoMatch = pathname.match(/^\/api\/produtos\/(.+)$/);
    if (produtoMatch && req.method === 'GET') {
        const produtoId = produtoMatch[1];
        const produto = produtos.find(p => p.id === produtoId);
        
        if (produto) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                sucesso: true,
                dados: produto
            }));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                sucesso: false,
                erro: 'Produto não encontrado'
            }));
        }
        return;
    }

    // GET /api/carrinho - Obtém o carrinho
    if (pathname === '/api/carrinho' && req.method === 'GET') {
        const carritoId = req.headers['x-carrinho-id'] || 'padrao';
        const carrinho = carrinosGlobais[carritoId] || {};
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            sucesso: true,
            dados: carrinho,
            total: Object.keys(carrinho).length
        }));
        return;
    }

    // POST /api/carrinho - Adiciona item ao carrinho
    if (pathname === '/api/carrinho' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const dados = JSON.parse(body);
                const carritoId = req.headers['x-carrinho-id'] || 'padrao';
                
                if (!carrinosGlobais[carritoId]) {
                    carrinosGlobais[carritoId] = {};
                }
                
                const { produtoId, quantidade } = dados;
                const produto = produtos.find(p => p.id === produtoId);
                
                if (!produto) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        sucesso: false,
                        erro: 'Produto não encontrado'
                    }));
                    return;
                }
                
                if (carrinosGlobais[carritoId][produtoId]) {
                    carrinosGlobais[carritoId][produtoId].quantidade += (quantidade || 1);
                } else {
                    carrinosGlobais[carritoId][produtoId] = {
                        ...produto,
                        quantidade: quantidade || 1
                    };
                }
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    sucesso: true,
                    mensagem: 'Produto adicionado ao carrinho',
                    dados: carrinosGlobais[carritoId]
                }));
            } catch {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    sucesso: false,
                    erro: 'Dados inválidos'
                }));
            }
        });
        return;
    }

    // DELETE /api/carrinho/:produtoId - Remove item do carrinho
    const removeMatch = pathname.match(/^\/api\/carrinho\/(.+)$/);
    if (removeMatch && req.method === 'DELETE') {
        const produtoId = removeMatch[1];
        const carritoId = req.headers['x-carrinho-id'] || 'padrao';
        
        if (carrinosGlobais[carritoId] && carrinosGlobais[carritoId][produtoId]) {
            delete carrinosGlobais[carritoId][produtoId];
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                sucesso: true,
                mensagem: 'Produto removido do carrinho',
                dados: carrinosGlobais[carritoId]
            }));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                sucesso: false,
                erro: 'Produto não encontrado no carrinho'
            }));
        }
        return;
    }

    // Rota não encontrada
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        sucesso: false,
        erro: 'Rota de API não encontrada'
    }));
}

server.listen(PORT, HOST, () => {
    console.log(`\n✅ Servidor iniciado com sucesso!`);
    console.log(`🌐 Acesse: http://${HOST}:${PORT}`);
    console.log(`\n🛑 Para parar o servidor: Pressione Ctrl+C\n`);
});
