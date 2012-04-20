var fs   = require('fs'),
    path = require('path'),
    Y    = require('yui/yui-base'),

    CONFIG_FILE = 'config.json',
    NODE_ENV    = process.env.NODE_ENV,

    ENV = {
        development: NODE_ENV !== 'production',
        production : NODE_ENV === 'production'
    };

var appRoot    = process.cwd(),
    configFile = path.join(__dirname, CONFIG_FILE),
    config     = path.existsSync(configFile) &&
                    JSON.parse(fs.readFileSync(configFile, 'utf8'));

if (!config) {
    console.error('Could not read config file: ' + configFile);
    process.exit(1);
}

config.env          = ENV;
config.pubDir       = path.join(appRoot, config.pubDir);
config.templatesDir = path.join(appRoot, config.templatesDir);

// YUI on the server.
config.yui.server = {
    groups: {
        pnm: Y.merge(config.yui.pnm, {
            base   : path.join(config.pubDir, config.yui.pnm.base),
            combine: false
        })
    }
};

// YUI on the client.
config.yui.client = {
    allowRollup: false,
    combine    : ENV.production,
    filter     : ENV.production ? 'min' : 'raw',
    modules    : config.yui.modules,

    groups: {
        pnm: Y.merge(config.yui.pnm, {
            combine: ENV.production
        })
    }
};

global.config = module.exports = config;
