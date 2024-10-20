const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Create an HTTPS agent to ignore self-signed certificate validation
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// Route to fetch data from API and render with pagination
app.get('/', async (req, res) => {
    try {
        // Fetch data from the API with the HTTPS agent
        const response = await axios.get('https://localhost:7139/GoogleKeywords', {
            httpsAgent: httpsAgent
        });
        const keywordsData = response.data;

        // Pagination logic
        const page = parseInt(req.query.page) || 1; // Current page number, default to 1
        const limit = 10; // Number of items per page
        const startIndex = (page - 1) * limit; // Starting index
        const endIndex = page * limit; // Ending index

        const paginatedData = keywordsData.slice(startIndex, endIndex); // Get data for the current page

        // Calculate total pages
        const totalPages = Math.ceil(keywordsData.length / limit);

        // Render the view with the paginated data
        res.render('index', { 
            data: paginatedData, 
            currentPage: page, 
            totalPages: totalPages 
        });
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        res.status(500).send('Error fetching data from API');
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
