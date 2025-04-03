// Using Axios directly for API calls
import axios from 'axios';

// Get authentication credentials from environment variables
// Default to 'admin' and 'password' if not provided
const username = process.env.AUTH_USERNAME || 'admin';
const password = process.env.AUTH_PASSWORD || 'password';

async function fetchApiData() {
    try {
        console.log('Fetching data from API...');
        
        // Create authorization header with basic auth
        const auth = {
            username,
            password
        };
        
        // Make the API request with authentication
        const response = await axios.get('http://localhost:3000/api/data', {
            auth,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // Log success and summary of data
        console.log('Successfully retrieved API data');
        console.log(`Data: ${JSON.stringify(response.data).substring(0, 100)}...`);
        
        return response.data;
    } catch (error: any) {
        console.error('Error fetching API data:');
        if (axios.isAxiosError(error)) {
            console.error(`Status: ${error.response?.status}`);
            console.error(`Message: ${error.message}`);
            console.error(`Response: ${JSON.stringify(error.response?.data)}`);
        } else {
            console.error(error);
        }
    }
}

// Execute the function
fetchApiData();