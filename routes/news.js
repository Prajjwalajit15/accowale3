 
const axios = require('axios');
const express = require('express');
const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const { search = 'latest', page = 1 } = req.query;
//         const apiKey = 'b69675ce6b57e8471fa098a8cca9dcd5';  // Hardcoded temporarily


//         // Log the API Key to verify it's being loaded
//         console.log('GNEWS_API_KEY:', apiKey);

//         const requestUrl = `https://gnews.io/api/v4/search?q=${search}&token=${apiKey}&lang=en&page=${page}`;
//         console.log('Request URL:', requestUrl);

//         const response = await axios.get(requestUrl);
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching news:', error.message);
//         res.status(500).json({ message: 'Error fetching news', error });
//     }
// });

  
// module.exports = router;

 
router.get('/', async (req, res) => {
    try {
        // Prevent caching to ensure fresh data
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        
        // Extracting query parameters from the request
        const { search = 'latest', category, country, page = 1, limit = 10 } = req.query;

        // GNews API Key (hardcoded for now, replace with env variables in production)
        // const apiKey = 'b69675ce6b57e8471fa098a8cca9dcd5'; 
        // const apiKey = '8f5ca964667c9ed0e675bf6fc344e727'; 
        const apiKey = '74c6b5109afe8e73ecdbcbbdbd6819e4'; 

        
        // Constructing the parameters for the API request
        const params = {
            q: search,
            token: apiKey, 
            lang: 'en',
            page,                    
            max: limit,              
            topic: category || undefined,  
            country: country || undefined, 
        };

        // Log the request URL and params for debugging purposes
        console.log('GNews API Params:', params);

        // Send the request to the GNews API
        const response = await axios.get('https://gnews.io/api/v4/search', { params ,timeout: 5000  });

        // Get total articles count and calculate total pages
        const totalArticles = response.data.totalArticles;
        const totalPages = Math.ceil(totalArticles / limit);

        // Return the articles and pagination information
        res.json({
            articles: response.data.articles,
            totalPages: totalPages,
            currentPage: page,
            totalArticles: totalArticles,
        });

    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded');
            res.status(429).json({ message: 'Rate limit exceeded, please try again later' });
        } else {
            console.error('Error fetching news:', error.message);
            res.status(500).json({ message: 'Error fetching news', error });
        }
    }
    
});

module.exports = router;
