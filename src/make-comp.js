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
    const {_} = args;    // TODO перенести эту логику внутрь makeWhatToDo()
    const NO_CONTAINER = !!(args['c'] || args['container']);
    const NO_TRANSLATION = !!(args['t'] || args['translation']);
    const NO_DOCUMENTATION = !!(args['d'] || args['docs']);
    const NEED_HELP = !!(args['h'] || args['help']);
    const COMPONENT = _[0];

    console.log(args);
    console.log(NO_CONTAINER, NO_DOCUMENTATION, NO_TRANSLATION, COMPONENT, NEED_HELP);

    if (args._.length !== 1) {
        return NEED_HELP ? console.log(message.USAGE) :logError('NOCOMP');
    }

    async function main(userInput) {
        const mainObj = await makeWhatToDo(userInput);
        console.log(mainObj);
    }
    main(args);
};

// TODO - обработчик создания визуального компонента
// TODO - обработчик создания контейнера
// TODO - обработчик создания перевода
// TODO при досоздании перевода, добавлять импорт в визуальный компонент (в обработчике создания перевода обрабаотывать кейс, когда визуальный компонент не создавался (значит был создан ранее))
