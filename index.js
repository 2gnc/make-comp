const program = require('./src/make-comp');
const minimist = require('minimist');

module.exports = () => {
    const args = minimist(process.argv.slice(2),
        {
        string: '',
        boolean: true,
        alias: {'help': 'h', 'documentation': 'd'},
        default: {},
        unknown: () => {
            return true
        }
    });
    program(args);
};
