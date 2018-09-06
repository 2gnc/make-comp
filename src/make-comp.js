const {
    getFileText,
    getRoot,
    makeFolder,
    makeFile,
    logError,
    getInitialStructure,
    getPathSettings
} = require('./helpers');
const message = require('./messages');

module.exports = (args) => {
    const {_} = args;
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

    Promise.all([
            getRoot(process.env.PWD),
            getFileText('MyPerfectComponent', 'visual-js', true),
            getFileText('MyPerfectComponent', 'visual-css'),
            getFileText('MyPerfectComponent', 'visual-md'),
            getFileText('MyPerfectComponent', 'container'),
            getFileText('MyPerfectComponent', 'translation'),
        ])
        .then((res) => {
            makeFolder(res[0], 'MyPerfectComponent');
            makeFile(`${res[0]}/MyPerfectComponent`, 'MyPerfectComponent.js', 'test');
            return res[0]
        })
        .then((res) => {
            return Promise.all([
                getPathSettings(res),
                getInitialStructure(res, 'MyPerfectComponent')
            ])
        })
        .then(data => {
            console.log(data[0]);
            console.log(data[1]);
        })
        .catch(e => e);
};

// TODO разобрать аргемнты командной строки (какие могут быть, на все остальные возвращать хелп)
// TODO - обработчик создания визуального компонента
// TODO - обработчик создания контейнера
// TODO - обработчик создания перевода
// TODO при досоздании перевода, добавлять импорт в визуальный компонент (в обработчике создания перевода обрабаотывать кейс, когда визуальный компонент не создавался (значит был создан ранее))
// TODO сделать команду --help (выводит описание и подсказки)
// TODO сделать команду config.json visual src/components
// TODO сделать команду config.json container src/containers
// TODO сделать команду config.json translation src/i18n
// TODO добавить флаги -c -t которые убирают создание контейнера и перевода соответственно
// TODO логика:
// если вызвать make-comp Test без аргументов, то сначала проверяем, есть ли уже этот компонент (визуальный (js, css, md), контейнер и перевод).
// Чего не хватает - создать. Флаги исключают определенные составляющие.
// Уже созданные составляюие компонентов не перезаписываем.
//
// По полученному имени проверить что уже есть:
// initialStructure = {
//     visual: {
//         js: boolean;
//         css: boolean;
//         md: boolean;
//     };
//     container: boolean;
//     translation: boolean;
// }
//
// логика создания директорий
// 1 составляющая компонента === один хелпер
//     makeVisual
//     makeContainer
//     makeTranslation
// создать директрию
// запустить один или несколько раз хелпер для создания файла (имя файла, хелпер для получения шаблона)

// последовательность: 1 получить параметры -> 2 получить рут -> 3 получить нужные тексты -> 4 создать директории -> 5 создать в них файлы -> 6 записать данные
// в шагах 4 и 5 проверять, есть ли уже такие директории и файлы, пропускать если уже есть

