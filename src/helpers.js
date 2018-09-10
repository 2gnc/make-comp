const fs = require('fs');
const message = require('./messages');
const { PARTS } = require('./constants');

/**
 * @desc Превращает строку из формата CamelCase в формат cebab-case (для классов css)
 * @param str {String} Исходная строка.
 * @returns {string | void | *}
 * @private
 */
const _kebaber = str => str.replace(/\b([A-Z][a-z]+)+\b/g, n => n.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());

/**
 * @desc Получает текст шаблона.
 * @param componentName {String} Имя компонента.
 * @param type {'visual-css' | 'visual-js' | 'visual-md' | 'container' | 'translation'} тип шаблона
 * @returns {Promise<any>}
 * @private
 */
function _getTemplateText (componentName, type) {
    return new Promise((resolve, reject) => {
        fs.readFile(`./settings/${type}.template`, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    });

}

/**
 * @desc Создает папку в указанной директории с указанным именем
 * @param path {String} Адрес родителькой директории.
 * @param folderName {String} Имя будущей папки.
 * @returns {Promise<any>}
 * @private
 */
function _makeFolder (path, folderName) {
    return new Promise((resolve, reject) => {
        fs.mkdir(`${path}/${folderName}`, (err) => {
            if (!err) resolve(`${path}/${folderName}`);
            else reject(err);
        })
    })
}

/**
 * @desc Проверяет, отсутствует ли указанный файл.
 * @param path {String} Путьк файлу включая имя файла и расширение.
 * @returns {Promise<any>}
 * @private
 */
function _checkIfFileNotExist (path) {
    console.log(path);
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (!err) {
                reject(stats);
            } else {
                resolve(err);
            }
        })
    })
}

/**
 * @desc Создает файл с указанным содержимым в случае, если такого файла еще нет.
 * @param path {String} Каталог, куда записать файл.
 * @param fileName {String} Имя файла с расширением.
 * @param fileContent {String} Содержимое файла.
 * @returns {Promise<any>}
 * @private
 */
function _makeFile (path, fileName, fileContent) {
    return new Promise((resolve, reject) => {
        // проверка, есть ли файл
        _checkIfFileNotExist(`${path}/${fileName}`)
            .then((err) => {
                if (err.code === 'ENOENT') {
                    fs.writeFile(`${path}/${fileName}`, fileContent, (err) => {
                        if (!err) resolve();
                        else reject(fileName);
                    })
                } else {
                    reject(err.code)
                }
            })
            .catch(() => reject(fileName));
    })
}

/**
 * @desc Получает содержимое файла.
 * @param filePath {String} Полный путь до файла включая имя файла.
 * @returns {Promise<any>}
 * @private
 */
function _getFileContents (filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    });
}

/**
 * @desc Выводит в консоль текст ошибки.
 * @param errCode {String} Код ошибки.
 * @param otherParams {String} Дополниткльный текст, который нудно отобразить.
 */
function logError (errCode, otherParams) {
    const additionalInfo = otherParams ? ` ${otherParams.toString()}` : '';
    const _msg = (code) => {
        switch(code) {
            case 'EEXIST':
                return message.DIRECTORY_ALREADY_EXIST;
            case 'FILEEXIST':
                return message.FILE_ALREADY_EXIST;
            case 'NOCOMP':
                return message.UNKNOWN_COMMAND;
            default:
                return message.UNKNOWN_ERROR;
        }
    };
    console.log(`${_msg(errCode)}${additionalInfo}`)
}

/**
 * @desc Получает готовый текст для файла.
 * @param componentName {String} Имя компонента
 * @param type {'visual-css' | 'visual-js' | 'visual-md' | 'container' | 'translation'} тип файла
 * @param translation {Boolean} нужен ли перевод
 * @returns {Promise<string>}
 */
async function getFileText (componentName, type, translation) {
    const template = await _getTemplateText(componentName, type);
    const translationString = translation ? `import * as i18n from ' b:components_${componentName} t:i18n';` : '';
    if (type === 'visual-css') componentName = _kebaber(componentName);
    return template
        .replace(/<<COMPONENT>>/g, componentName)
        .replace(/<<BLOCK>>/g, _kebaber(componentName))
        .replace(/<<TRANSLATION>>/g, translationString);
}

/**
 * @desc Пролучает корень проекта
 * @param startPath {String} Папка, внутри которой выполнился скрипт.
 * @returns {Promise<any>}
 */
function getRoot (startPath) {
    return new Promise((resolve) => {
        const f = (path, resolve) => {
            fs.access(`${path}/package.json`, fs.constants.F_OK, err => {
                if (!err) {
                    resolve(path);
                } else {
                    if (!path) return console.log(message.ROOT_NOT_FOUND);
                    const newPath = path.split("/").slice(0, -1).join("/");
                    f(newPath, resolve);
                }
            });
        };
        f(startPath, resolve);
    });
}

/**
 * @desc Создает папку и оповещает о результате.
 * @param path {String} Родительская папка.
 * @param folderName {String} Имя новой папки.
 * @returns {Promise<void>}
 */
async function makeFolder (path, folderName) {
    return await _makeFolder(path, folderName)
        .then((res) => console.log(`Создана директория: ${res}`))
        .catch(e => logError(e.code, folderName));
}

/**
 * @desc Создает файл в указанной папке.
 * @param path {String} Родительский каталог.
 * @param fileName {String} Имя файла.
 * @param fileContent {String} Содержимое файла.
 * @returns {Promise<void>}
 */
async function makeFile(path, fileName, fileContent) {
    return await _makeFile(path, fileName, fileContent)
        .then(() => console.log('файл создан'))
        .catch(fileName => logError('FILEEXIST', fileName))
}

/**
 * @desc Возвращает объект с настройками, на сонове которого будут создаваться файлы
 * @param userInput
 * @returns {Promise<*>}
 */

async function makeWhatToDo(userInput) {
    const obj = {
        component: userInput._[0],
        root: undefined,
        jsExtension: undefined,
        toCreate: [],
        [PARTS.VISUAL]: {},
        [PARTS.STYLES]: {},
        [PARTS.DOCUMENTATION]: {},
        [PARTS.CONTAINER]: {},
        [PARTS.TRANSLATION]: {},
    };

    try {

        // получаем список соатвляющих компонента, которые нужно создать (парсим пользовательский ввод)
        obj.toCreate.push(PARTS.VISUAL);
        obj.toCreate.push(PARTS.STYLES);
        if (!(userInput['d'] || userInput['docs'])) {
            obj.toCreate.push(PARTS.DOCUMENTATION)
        }
        if (!(userInput['c'] || userInput['container'])) {
            obj.toCreate.push(PARTS.CONTAINER)
        }
        if (!(userInput['t'] || userInput['translation'])) {
            obj.toCreate.push(PARTS.TRANSLATION)
        }

        // получаем корень проекта
        await getRoot(process.env.PWD).then(root => obj.root = root).catch(e => e);

        // получаем настройки путей
        const settings = JSON.parse(await _getFileContents(`${obj.root}/settings/config.json`));
        obj.jsExtension = settings.jsExtension;

        obj.toCreate.forEach(item => {
           obj[PARTS[item]].path = settings[PARTS[item]];
        });

        // для каждой составляющей компоненета (если она нужна), проверяем, есть ли она уже в проекте

        await _checkIfFileNotExist(`${obj.root}${obj[PARTS.VISUAL].path}/${obj.component}/${obj.component}.${obj.jsExtension}`)
            .then(() => obj[PARTS.VISUAL].isAlreadyExists = false)
            .catch(() => obj[PARTS.VISUAL].isAlreadyExists = true);

        await _checkIfFileNotExist(`${obj.root}${obj[PARTS.STYLES].path}/${obj.component}/${obj.component}.css`)
            .then(() => obj[PARTS.STYLES].isAlreadyExists = false)
            .catch(() => obj[PARTS.STYLES].isAlreadyExists = true);

        if(obj[PARTS.DOCUMENTATION].path) {
            await _checkIfFileNotExist(`${obj.root}${obj[PARTS.DOCUMENTATION].path}/${obj.component}/${obj.component}.md`)
                .then(() => obj[PARTS.DOCUMENTATION].isAlreadyExists = false)
                .catch(() => obj[PARTS.DOCUMENTATION].isAlreadyExists = true);
        }

        if(obj[PARTS.CONTAINER].path) {
            await _checkIfFileNotExist(`${obj.root}${obj[PARTS.CONTAINER].path}/${obj.component}Container/${obj.component}Container.${obj.jsExtension}`)
                .then(() => obj[PARTS.CONTAINER].isAlreadyExists = false)
                .catch(() => obj[PARTS.CONTAINER].isAlreadyExists = true);
        }

        if(obj[PARTS.TRANSLATION].path) {
            await _checkIfFileNotExist(`${obj.root}${obj[PARTS.TRANSLATION].path}/components_${obj.component}/componets_${obj.component}.18n/ru.js`)
                .then(() => obj[PARTS.TRANSLATION].isAlreadyExists = false)
                .catch(() => obj[PARTS.TRANSLATION].isAlreadyExists = true);
        }

        return obj;

    } catch (e) {
        return e;
    }
}

/**
 * Создает составляющую компонета (папку, файлы)
 * @param part {PARTS} что создавать
 * @param prefs {Object} объекта с настройками
 * @returns {Promise<void>}
 */

async function componentPartCreator(part, prefs) {

}

// visual: если !isAlreadyExists получить шаблон для visual, создавть папку по настройкам (если еще не создана), записать туда файл, отметиь, что файл был создан
// styles: если !isAlreadyExists получить шаблон для css, создать папку, записать туда файл, отметить, что файл создан
// docs: если !isAlreadyExists получить шаблон для docs, создать папку, записать туда файл, отметить, что файл создан
// container: если !isAlreadyExists получить шаблон для container, создать папку, записать туда файл, отметить, что файл создан
// translation: если !isAlreadyExists получить шаблон для css, создать папку, записать туда файл, отметить, что файл создан, если visual.WasCreated, дописать в него строчку с импортом перевода


module.exports.getFileText = getFileText;
module.exports.getRoot = getRoot;
module.exports.makeFolder = makeFolder;
module.exports.makeFile = makeFile;
module.exports.logError = logError;
module.exports.makeWhatToDo = makeWhatToDo;
module.exports.componentPartCreator = componentPartCreator;
