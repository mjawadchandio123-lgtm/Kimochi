const axios = require('axios');
const config = require('../../config/config');

class BinanceService {
  constructor() {
    this.baseUrl = config.binance.testnet
      ? 'https://testnet.binance.vision/api'
      : 'https://api.binance.com/api';
    this.apiKey = config.binance.apiKey;
    this.apiSecret = config.binance.apiSecret;
  }

  /**
   * Get current price for a cryptocurrency
   */
  async getPrice(symbol) {
    try {
      const response = await axios.get(`${this.baseUrl}/v3/ticker/price`, {
        params: { symbol: `${symbol}USDT` },
      });
      return parseFloat(response.data.price);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  /**
   * Get multiple prices at once
   */
  async getPrices(symbols) {
    try {
      const prices = {};
      for (const symbol of symbols) {
        prices[symbol] = await this.getPrice(symbol);
      }
      return prices;
    } catch (error) {
      console.error('Error fetching prices:', error.message);
      throw error;
    }
  }

  /**
   * Get withdrawal fees for a network
   */
  async getWithdrawalFees(coin, network = null) {
    try {
      const params = { coin };
      if (network) params.network = network;

      const response = await axios.get(`${this.baseUrl}/v3/capital/withdraw/apply`, {
        headers: { 'X-MBX-APIKEY': this.apiKey },
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal fees:', error.message);
      throw error;
    }
  }

  /**
   * Get all available networks for a coin
   */
  async getNetworks(coin) {
    try {
      const response = await axios.get(`${this.baseUrl}/v3/capital/config/getall`, {
        headers: { 'X-MBX-APIKEY': this.apiKey },
      });

      const coinData = response.data.find(c => c.coin === coin);
      if (!coinData) throw new Error(`Coin ${coin} not found`);

      return coinData.networkList || [];
    } catch (error) {
      console.error('Error fetching networks:', error.message);
      throw error;
    }
  }

  /**
   * Validate withdrawal address
   */
  async validateAddress(coin, address, network) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v3/capital/withdraw/apply`,
        {},
        {
          headers: { 'X-MBX-APIKEY': this.apiKey },
          params: {
            coin,
            withdrawOrderId: 'test',
            address,
            network,
            amount: 0.0001,
            transactionFeeFlag: true,
            test: true,
          },
        }
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get 24h trading volume
   */
  async get24hVolume(symbol) {
    try {
      const response = await axios.get(`${this.baseUrl}/v3/ticker/24hr`, {
        params: { symbol: `${symbol}USDT` },
      });
      return {
        volume: parseFloat(response.data.volume),
        quoteVolume: parseFloat(response.data.quoteAssetVolume),
      };
    } catch (error) {
      console.error('Error fetching 24h volume:', error.message);
      throw error;
    }
  }
}

module.exports = new BinanceService();
