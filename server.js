// server.mjs
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy __dirname trong môi trường ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load biến môi trường từ .env
dotenv.config();

// Load file OpenAPI YAML
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint /metadata
app.get('/metadata', (req, res) => {
  res.json({
    name: 'AgentX',
    version: '1.0.0',
    capabilities: ['ask', 'data-retrieval'],
    model: {
      name: 'gpt-4o-mini',
      provider: 'OpenAI'
    }
  });
});

// Endpoint /ask
app.post('/ask', (req, res) => {
  const { query, sessionId } = req.body;

  if (!query) {
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      message: 'Thiếu query'
    });
  }

  res.json({
    answer: `Bạn vừa hỏi: "${query}". Đây là câu trả lời mẫu.`,
    confidence: 0.95,
    sources: [
      { title: 'Mock Source', url: 'https://example.com' }
    ]
  });
});

// Endpoint /data
app.get('/data', (req, res) => {
  res.json({
    data: [
      { id: '1', value: 'Sample note', updatedAt: new Date().toISOString() }
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/docs`);
});
