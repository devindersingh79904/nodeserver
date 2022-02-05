const nodeGeocoder=require('node-geocoder')

const options = {
    provider : process.env.PROVIDER,
    apiKey:process.env.GEO_KEY
}

const geocoder = nodeGeocoder(options);

module.exports = geocoder