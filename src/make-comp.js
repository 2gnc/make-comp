const {
    logError,
    makeWhatToDo
} = require('./helpers');
const message = require('./messages');

module.exports = (args) => {

    async function main(userInput) {
        const NEED_HELP = !!(userInput['h'] || userInput['help']);

        if (userInput._.length !== 1) {
            return NEED_HELP ? console.log(message.USAGE) :logError('NOCOMP', null);
        }

        const WHAT_TO_DO = await makeWhatToDo(userInput);
        console.log(WHAT_TO_DO);
    }
    main(args);
};

// visual: если !isAlreadyExists
// styles:
// docs:
// container:
// translation
