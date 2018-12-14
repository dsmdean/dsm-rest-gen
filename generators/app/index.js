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
      `Welcome to the tiptop ${chalk.red('generator-km-rest-api')} generator!`
    ));

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'What\'s the project name?',
      default: _.startCase(this.appname)
    }, {
      type: 'input',
      name: 'srcDir',
      message: 'Where to put the source code?',
      default: 'src'
    }, {
      type: 'input',
      name: 'mongodbUri',
      message: 'What\'s your MongoDB URI (you can skip this and update the .env file later)?',
      default: 'mongodburi'
    }, {
      type: 'confirm',
      name: 'generateUserApi',
      message: 'Do you want to generate a user API (it will need some additonal data)?',
      default: true
    }, {
      type: 'input',
      name: 'sendgridKey',
      message: 'What\'s your SendGrid API Key (you can skip this and update the .env file later)?',
      default: 'sendgridkey',
      when: function (props) {
        return props.generateUserApi;
      }
    }, {
      type: 'input',
      name: 'frontLink',
      message: 'What\'s your front end link. (you can skip this and update the .env file later)?',
      default: 'http://localhost:3000',
      when: function (props) {
        return props.generateUserApi;
      }
    }, {
      type: 'input',
      name: 'defaultEmail',
      message: 'What\'s your default email when sending mail (you can skip this and update the .env file later)?',
      default: 'no-reply@domain.com',
      when: function (props) {
        return props.generateUserApi;
      }
    }, {
      type: 'input',
      name: 'port',
      message: 'What\'s your API port (you can skip this and update the .env file later)?',
      default: '9000'
    }]).then(function (props) {
      that.props = props;
      that.props.masterKey = randtoken.uid(32);
      if (that.props.generateUserApi) {
        that.props.jwtSecret = randtoken.uid(32);
      }
      that.config.set({
        srcDir: props.srcDir,
        apiDir: props.apiDir
      });
    });
  }

  writing() {
    var props = this.props;
    var copy = this.fs.copy.bind(this.fs);
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);
    this.props.slug = this.props.name.toLowerCase().split(" ").join("-");

    copyTpl(tPath('_package.json'), dPath('package.json'), props);
    copyTpl(tPath('apidoc.json'), dPath('apidoc.json'), props);
    copy(tPath('babelrc'), dPath('.babelrc'));
    copy(tPath('editorconfig'), dPath('.editorconfig'));
    copyTpl(tPath('env'), dPath('.env'), props);
    copyTpl(tPath('env.example'), dPath('.env.example'), props);
    copy(tPath('eslintrc'), dPath('.eslintrc'));
    copyTpl(tPath('gitignore'), dPath('.gitignore'), props);
    copyTpl(tPath('header.md'), dPath('header.md'), props);
    copyTpl(tPath('README.md'), dPath('README.md'), props);
    copyTpl(tPath('travis.yml'), dPath('.travis.yml'), props);

    if (props.generateUserApi) {
      copyTpl(tPath('src'), dPath(props.srcDir), props);
    } else {
      copyTpl(tPath('src/app.js'), dPath(props.srcDir + '/app.js'), props);
      copyTpl(tPath('src/api/index.js'), dPath(props.srcDir + '/api/index.js'), props);
      copyTpl(tPath('src/bin'), dPath(props.srcDir + '/bin'), props);
      copyTpl(tPath('src/default'), dPath(props.srcDir + '/default'), props);
    }
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
