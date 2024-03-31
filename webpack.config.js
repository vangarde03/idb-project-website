const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      fs: false, // or require.resolve("fs")
      net: false, // or require.resolve("net")
      tls: false, // or require.resolve("tls")
      path: false, // or require.resolve("path")
      crypto: false, // or require.resolve("crypto")
      stream: false, // or require.resolve("stream")
    }
  }

};
