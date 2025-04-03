// For more information, see https://crawlee.dev/
import { CheerioCrawler, createCheerioRouter } from 'crawlee';

// Get authentication credentials from environment variables
// Default to 'admin' and 'password' if not provided
const username = process.env.AUTH_USERNAME || 'admin';
const password = process.env.AUTH_PASSWORD || 'password';

// Create a router for handling the page
const router = createCheerioRouter();

router.addDefaultHandler(async ({ $, log, request, pushData }) => {
    log.info(`Processing protected page at ${request.loadedUrl}`);
    
    // Extract content from the page
    const title = $('title').text();
    const bodyContent = $('body').text().trim();
    
    // Log the extracted information
    log.info(`Title: ${title}`);
    log.info('Successfully accessed protected content');
    
    // Save the data
    await pushData({
        url: request.loadedUrl,
        title,
        bodyContent
    });
});

// Define the target URL
const urls = ['http://localhost:3000/protected'];

// Create and run the crawler
const crawler = new CheerioCrawler({
    // Configure basic authentication
    navigationTimeoutSecs: 60,
    requestHandlerTimeoutSecs: 60,
    maxRequestRetries: 3,
    // Add basic authentication credentials
    preNavigationHooks: [
        async ({ request }) => {
            // Set the Authorization header with Basic auth
            const credentials = Buffer.from(`${username}:${password}`).toString('base64');
            request.headers = {
                ...request.headers,
                Authorization: `Basic ${credentials}`,
            };
        },
    ],
    requestHandler: router,
    maxRequestsPerCrawl: 1,
});

await crawler.run(urls);