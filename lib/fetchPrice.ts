async function fetchPrice(tokenId: string, vsToken = 'USDC'): Promise<number> {
    try {
      const apiUrl = `https://price.jup.ag/v4/price?ids=${tokenId}&vsToken=${vsToken}`;
      const response = await fetch(apiUrl);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
      }
    
  
      const data = await response.json();
      const tokenData = data.data[tokenId];
      const price = tokenData.price;
  
      return price;
    } catch (error) {
      throw new Error(`Error fetching token price`);
    }
  }