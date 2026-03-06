const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
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

const server = http.createServer((req, res) => {
    // Trata requisições para a raiz
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Remove query string
    filePath = filePath.split('?')[0];
    
    // Monta caminho completo
    filePath = path.join(__dirname, filePath);
    
    // Previne acesso a diretórios acima (segurança)
    const realPath = path.resolve(filePath);
    const baseDir = path.resolve(__dirname);
    
    if (!realPath.startsWith(baseDir)) {
        res.statusCode = 403;
        res.end('Acesso negado');
        return;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('Arquivo não encontrado');
            } else if (err.code === 'EISDIR') {
                // Se for um diretório, tenta abrir index.html
                fs.readFile(path.join(filePath, 'index.html'), (err, content) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Erro no servidor');
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        res.end(content);
                    }
                });
            } else {
                res.statusCode = 500;
                res.end('Erro no servidor');
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

server.listen(PORT, HOST, () => {
    console.log(`\n✅ Servidor iniciado com sucesso!`);
    console.log(`🌐 Acesse: http://${HOST}:${PORT}`);
    console.log(`\n🛑 Para parar o servidor: Pressione Ctrl+C\n`);
});
