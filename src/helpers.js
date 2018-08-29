const fs = require('fs');
const message = require('./messages');

const _kebaber = str => str.replace(/\b([A-Z][a-z]+)+\b/g, n => n.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());

const _getTemplateText = (componentName, type) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`./settings/${type}.template`, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    });

};

const getFileText = async (componentName, type, translation) => {
    const template = await _getTemplateText(componentName, type);
    const translationString = translation ? `import * as i18n from ' b:components_${componentName} t:i18n';` : '';
    if (type === 'visual-css') componentName = _kebaber(componentName);
    return template
        .replace(/<<COMPONENT>>/g, componentName)
        .replace(/<<BLOCK>>/g, _kebaber(componentName))
        .replace(/<<TRANSLATION>>/g, translationString);
};

const getRoot = (startPath) => {
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
};


module.exports.getFileText = getFileText;
module.exports.getRoot = getRoot;