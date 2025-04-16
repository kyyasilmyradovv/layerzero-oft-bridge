module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Replace with your image domains if needed
  },
  env: {
    NEXT_PUBLIC_LAYERZERO_ENDPOINT: process.env.NEXT_PUBLIC_LAYERZERO_ENDPOINT, // Add your LayerZero endpoint here
  },
};