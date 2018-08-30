const {
    getFileText,
    getRoot,
    makeFolder
} = require('./helpers');

module.exports = (args) => {

    Promise.all([
            getRoot(process.env.PWD),
            getFileText('MyPerfectComponent', 'visual-js', true),
            getFileText('MyPerfectComponent', 'visual-css'),
            getFileText('MyPerfectComponent', 'visual-md'),
            getFileText('MyPerfectComponent', 'container'),
            getFileText('MyPerfectComponent', 'translation'),
        ])
        .then((res) => {
            console.log(res[0]);
            makeFolder(res[0], 'MyPerfectComponent')

        })
        .catch(e => e);
};


// TODO при досоздании перевода, добавлять импорт в визуальный компонент
// TODO сделать команду --help (выводит описание и подсказки)
// TODO сделать команду config visual src/components
// TODO сделать команду config container src/containers
// TODO сделать команду config translation src/i18n
// TODO добавить флаги -c -t которые убирают создание контейнера и перевода соответственно
// TODO логика:
// если вызвать make-comp Test без аргументов, то сначала проверяем, есть ли уже этот компонент (визуальный (js, css, md), контейнер и перевод).
// Чего не хватает - создать. Флаги исключают определенные составляющие.
// Уже созданные составляюие компонентов не перезаписываем.

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

