const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/advice', (req, res) => {
    const { companyInfo } = req.body;
    // Simulate AI advice generation
    const advice = `Advice for ${companyInfo.gicsGroup}: Focus on scaling your team of ${companyInfo.teamSize} members.`;
    res.json({ advice });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
