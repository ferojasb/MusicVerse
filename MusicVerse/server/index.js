import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
