const nodeGeocoder=require('node-geocoder')

const options = {
    apiKey:process.env.GEO_KEY,
    provider : process.env.PROVIDER
}

const geocoder = nodeGeocoder(options);

module.exports = geocoder