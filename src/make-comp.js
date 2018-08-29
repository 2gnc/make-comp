const { getFileText, getRoot } = require('./helpers');

module.exports = (args) => {

    Promise.all([
            getRoot(process.env.PWD),
            getFileText('MyPerfectComponent', 'visual-js', true),
            getFileText('MyPerfectComponent', 'visual-css'),
            getFileText('MyPerfectComponent', 'visual-md'),
        ])
        .then((res) => {
            console.log(res[0]);
            console.log(res[1]);
            console.log(res[2]);
            console.log(res[3]);
        })
        .catch(e => e);
};



// TODO сделвать логику для отображения <<TRANSLATION>>
// TODO сделать команду --help (выводит описание и подсказки)
// TODO сделать команду config visual src/components
// TODO сделать команду config container src/containers
// TODO сделать команду config translation src/i18n
// TODO добавить флаги -c -t которые убирают создание контейнера и перевода соответственно
// TODO логика:
// если вызвать make-comp Test без аргументов, то сначала проверяем, есть ли уже этот компонент (визуальный (js, css, md), контейнер и перевод).
// Чего не хватает - создать. Флаги исключают определенные составляющие.
// Уже созданные составляюие компонентов не перезаписываем.

