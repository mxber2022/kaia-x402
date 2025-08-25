const express = require('express');
const { paymentMiddleware } = require('./dist/cjs/index.js');

const app = express();

// Example showing x402-express working with multiple networks
app.use(paymentMiddleware(
  "0x1234567890123456789012345678901234567890",
  {
    "/base-endpoint": {
      price: "$0.01",
      network: "base",
      config: {
        description: "Base mainnet endpoint",
      }
    },
    "/base-sepolia-endpoint": {
      price: "$0.01", 
      network: "base-sepolia",
      config: {
        description: "Base Sepolia testnet endpoint",
      }
    },
    "/avalanche-endpoint": {
      price: "$0.01",
      network: "avalanche", 
      config: {
        description: "Avalanche mainnet endpoint",
      }
    },
    "/avalanche-fuji-endpoint": {
      price: "$0.01",
      network: "avalanche-fuji",
      config: {
        description: "Avalanche Fuji testnet endpoint", 
      }
    },
    "/iotex-endpoint": {
      price: "$0.01",
      network: "iotex",
      config: {
        description: "IoTeX mainnet endpoint",
      }
    },
    "/sei-endpoint": {
      price: "$0.01", 
      network: "sei",
      config: {
        description: "Sei mainnet endpoint",
      }
    },
    "/sei-testnet-endpoint": {
      price: "$0.01",
      network: "sei-testnet", 
      config: {
        description: "Sei testnet endpoint",
      }
    },
    "/kaia-endpoint": {
      price: "$0.01",
      network: "kaia",
      config: {
        description: "Kaia mainnet endpoint", 
      }
    },
    "/kairos-endpoint": {
      price: "$0.01",
      network: "kairos",
      config: {
        description: "Kairos mainnet endpoint",
      }
    }
  }
));

// Route handlers
app.get('/base-endpoint', (req, res) => {
  res.json({ message: 'Base mainnet endpoint - payment successful!' });
});

app.get('/base-sepolia-endpoint', (req, res) => {
  res.json({ message: 'Base Sepolia testnet endpoint - payment successful!' });
});

app.get('/avalanche-endpoint', (req, res) => {
  res.json({ message: 'Avalanche mainnet endpoint - payment successful!' });
});

app.get('/avalanche-fuji-endpoint', (req, res) => {
  res.json({ message: 'Avalanche Fuji testnet endpoint - payment successful!' });
});

app.get('/iotex-endpoint', (req, res) => {
  res.json({ message: 'IoTeX mainnet endpoint - payment successful!' });
});

app.get('/sei-endpoint', (req, res) => {
  res.json({ message: 'Sei mainnet endpoint - payment successful!' });
});

app.get('/sei-testnet-endpoint', (req, res) => {
  res.json({ message: 'Sei testnet endpoint - payment successful!' });
});

app.get('/kaia-endpoint', (req, res) => {
  res.json({ message: 'Kaia mainnet endpoint - payment successful!' });
});

app.get('/kairos-endpoint', (req, res) => {
  res.json({ message: 'Kairos mainnet endpoint - payment successful!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 x402-express multi-network example server running on port ${PORT}`);
  console.log('\n📋 Available endpoints:');
  console.log('  GET /base-endpoint (Base mainnet)');
  console.log('  GET /base-sepolia-endpoint (Base Sepolia testnet)');
  console.log('  GET /avalanche-endpoint (Avalanche mainnet)');
  console.log('  GET /avalanche-fuji-endpoint (Avalanche Fuji testnet)');
  console.log('  GET /iotex-endpoint (IoTeX mainnet)');
  console.log('  GET /sei-endpoint (Sei mainnet)');
  console.log('  GET /sei-testnet-endpoint (Sei testnet)');
  console.log('  GET /kaia-endpoint (Kaia mainnet)');
  console.log('  GET /kairos-endpoint (Kairos mainnet)');
  console.log('\n💡 All endpoints require $0.01 payment in the respective network\'s USDC');
  console.log('🔗 Try accessing any endpoint in a browser to see the paywall!');
});
