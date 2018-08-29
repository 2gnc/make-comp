const program = require('./src/make-comp');
const minimist = require('minimist')

module.exports = () => {
    const args = minimist(process.argv.slice(2));
    program(args);
};

// обработка аргументов, вызов соответствующих команд
// компонент, контейнер, css, перевод, заготовка для md
