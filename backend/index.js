const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/item.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Backend đang chạy!');
});

app.use('/api/items', itemRoutes);

app.use(errorHandler); 
const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy ở port ${PORT}`));