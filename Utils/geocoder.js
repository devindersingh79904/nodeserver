const nodeGeocoder=require('node-geocoder')

const options = {
    apiKey:process.env.GEO_KEY,
    provider : process.env.PROVIDER
}

console.log(process.env)
console.log(options)
const geocoder = nodeGeocoder(options);

module.exports = geocoder