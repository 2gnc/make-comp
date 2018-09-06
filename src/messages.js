module.exports = {
    ROOT_NOT_FOUND: 'Корень проекта не найден, попробуйте запустить make-comp из любой папки вашего проекта',
    USAGE:
    `Создание компонента: make-comp ComponentName flags
                    Команда без флагов создает визуальный компонент, контейнер и переводы к нему.
                    Если какие-либо составляющие компонента уже есть, то повторный запуск make-comp досоздаст недостающие (с учетом переданных флагов). 
        Флаги:
                    -с ................................... Исключает контейнер
                    -t ................................... Исключает переводы
                    -m ................................... Исключает файл с документацией
        Примеры:
                    make-comp MyComponent -ct ............ Создаст только визуальный компонент (без контейнера и без перевода)
                    make-comp MyComponent -m ............. Создаст визуальный компонент без md - файла, контейнер и перевод
    `,
    DIRECTORY_CREATED: 'Создана директория',
    DIRECTORY_ALREADY_EXIST: 'Директория была создана ранее:',
    FILE_ALREADY_EXIST: 'Файл уже существует:',
    UNKNOWN_ERROR: 'Произошла неизвестная ошибка',
    UNKNOWN_COMMAND: 'Непонятно, какой компонент создать. Для полной справки: make-comp --help'
};
