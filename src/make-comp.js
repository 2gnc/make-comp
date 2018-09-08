const {
    getFileText,
    getRoot,
    makeFolder,
    makeFile,
    logError,
    getInitialStructure,
    getPathSettings,
    makeWhatToDo
} = require('./helpers');
const message = require('./messages');

module.exports = (args) => {

    async function main(userInput) {
        const COMPONENT = userInput._[0];
        const NEED_HELP = !!(userInput['h'] || userInput['help']);

        if (userInput._.length !== 1) {
            return NEED_HELP ? console.log(message.USAGE) :logError('NOCOMP', null);
        }

        const WHAT_TO_DO = await makeWhatToDo(userInput);
        console.log(WHAT_TO_DO);
    }
    main(args);
};

// TODO - обработчик создания визуального компонента
// TODO - обработчик создания контейнера
// TODO - обработчик создания перевода
// TODO при досоздании перевода, добавлять импорт в визуальный компонент (в обработчике создания перевода обрабаотывать кейс, когда визуальный компонент не создавался (значит был создан ранее))
