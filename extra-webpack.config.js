module.exports = {
    node: {
      vm: true,
      stream: true
    },
    resolve: {
      alias: {
        crypto: "crypto-browserify",
        net: "net-browserify",
        fs: "browserify-fs",
        dns: "@i2labs/dns"
      }
    },
  };