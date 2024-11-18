import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.apiKey,
});

// Function to fetch token data from CoinGecko API by contract address
async function fetchTokenData(tokenAddress) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`);
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        
        // Filter only necessary fields to reduce data size
        return {
            id: data.id,
            symbol: data.symbol,
            name: data.name,
            market_data: data.market_data ? {
                market_cap: data.market_data.market_cap,
                total_volume: data.market_data.total_volume,
                current_price: data.market_data.current_price,
            } : {},
            community_data: data.community_data,
            description: data.description ? data.description.en : ''
        };
    } catch (error) {
        console.error("Error fetching token data:", error);
    }
}

// Function to generate a detailed summary using OpenAI ChatGPT API
async function generateSummary(data) {
    const prompt = `
    Provide a detailed summary of the cryptocurrency with the following information:
    - Basic details (name, symbol, blockchain).
    - Overview of its purpose and unique features.
    - Recent news or events.
    - Relevant metrics: market cap, liquidity, trading volume.
    - Social/community metrics, influencer mentions, community sentiment.
    Here is the data:\n\n${JSON.stringify(data)}
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000  // Set a max token limit to avoid rate limits
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error generating summary:", error);
    }
}

// Main function to get detailed token information
async function getTokenInformation(tokenAddress) {
    const tokenData = await fetchTokenData(tokenAddress);

    if (!tokenData) {
        console.error("Failed to fetch token data.");
        return;
    }

    // Generate a detailed summary using ChatGPT
    const summary = await generateSummary(tokenData);

    console.log("Detailed Token Information:", summary);
    return summary;
}

// Usage
const tokenAddress = "0x812ba41e071c7b7fa4ebcfb62df5f45f6fa853ee";
getTokenInformation(tokenAddress);