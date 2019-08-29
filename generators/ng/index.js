'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const randtoken = require('rand-token');
const _ = require('lodash');

module.exports = class extends Generator {
  prompting() {
    var that = this;
    this.log(yosay(
      `Welcome to the tiptop ${chalk.red('generator-dsm')} generator!`
    ));
    this.log(`You will need to run ${chalk.red('npm-install')} after the setup`);

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'What\'s the project name?',
      default: _.startCase(this.appname)
    }, {
      type: 'input',
      name: 'dir',
      message: 'Where to put the source code?',
      default: this.appname.toLowerCase()
    }]).then(function (props) {
      that.props = props
    });
  }

  writing() {
    var props = this.props;
    var copy = this.fs.copy.bind(this.fs);
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);

    copyTpl(tPath('_package.json'), dPath(props.dir + '/package.json'));
    copyTpl(tPath('_tsconfig.json'), dPath(props.dir + '/tsconfig.json'));
    copyTpl(tPath('_tslint.json'), dPath(props.dir + '/tslint.json'));
    copyTpl(tPath('angular.json'), dPath(props.dir + '/angular.json'));
    copyTpl(tPath('CHANGELOG.md'), dPath(props.dir + '/CHANGELOG.md'));
    copy(tPath('editorconfig'), dPath(props.dir + '/.editorconfig'));
    copyTpl(tPath('gitignore'), dPath(props.dir + '/.gitignore'), props);
    copyTpl(tPath('ISSUES_TEMPLATE.md'), dPath(props.dir + '/ISSUES_TEMPLATE.md'));
    copyTpl(tPath('LICENSE.md'), dPath(props.dir + '/LICENSE.md'), props);
    copyTpl(tPath('README.md'), dPath(props.dir + '/README.md'), props);

    copyTpl(tPath('docs'), dPath(props.dir + '/docs'), props);
    copyTpl(tPath('e2e'), dPath(props.dir + '/e2e'), props);
    copyTpl(tPath('src'), dPath(props.dir + '/src'), props);
  }
};
