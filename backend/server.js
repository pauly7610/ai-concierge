const express = require('express');
const mongoose = require('mongoose');
const propertyRoutes = require('./routes/propertyRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/zillow-ai-concierge', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use('/api/properties', propertyRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 