const Dotenv = require('dotenv-webpack');
module.exports = {
    plugins: [
        new Dotenv()
    ]
}

// now no need to import the env module everytime simply use like thits REACT_APP_ALCHEMY_API_KEY