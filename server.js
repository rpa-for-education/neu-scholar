import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load OpenAPI spec
const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GET /metadata
app.get('/metadata', (req, res) => {
  res.json({
    name: "AgentX",
    version: "1.0.0",
    capabilities: ["ask", "data-retrieval"],
    model: { name: "gpt-4o-mini", provider: "OpenAI" }
  });
});

// POST /ask
app.post('/ask', (req, res) => {
  const { query, sessionId, params } = req.body;

  if (!query || !sessionId) {
    return res.status(400).json({ message: "Thiếu query hoặc sessionId" });
  }

  res.json({
    answer: `Bạn vừa hỏi: "${query}"`,
    sessionId
  });
});

// GET /data
app.get('/data', (req, res) => {
  res.json({
    items: [
      { id: 1, name: "Sample item 1" },
      { id: 2, name: "Sample item 2" }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
