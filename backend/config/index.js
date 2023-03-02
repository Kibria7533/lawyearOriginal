if(process.env.APP_ENV === 'production'){
    module.exports = require('./config_prod')
} else {
    console.log(process.env.APP_ENV,'lool')
    module.exports = require('./config_dev')
}
// module.exports = require("./config_prod");

// module.exports = require('./config_dev')
