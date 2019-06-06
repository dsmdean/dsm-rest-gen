'use strict';
var path = require('path');
const Generator = require('yeoman-generator');
var pluralize = require('pluralize');
var _ = require('lodash');
var recast = require('recast');
var reservedWords = require('reserved-words');

module.exports = class extends Generator {
  prompting() {
    var srcDir = this.config.get('srcDir') || 'src';
    var apiDir = this.config.get('apiDir') || 'api';
    var authMethods = this.config.get('authMethods') || [];

    var methods = [
      { name: 'Create (POST)', value: 'POST' },
      { name: 'Retrieve list (GET)', value: 'GET LIST' },
      { name: 'Retrieve one (GET)', value: 'GET ONE' },
      { name: 'Update (PUT)', value: 'PUT' },
      { name: 'Delete (DELETE)', value: 'DELETE' }
    ];

    var getSelectedMethods = function (props) {
      return methods.filter(function (method) {
        return props.methods.indexOf(method.value) !== -1;
      });
    };

    var prompts = [{
      type: 'input',
      name: 'route',
      message: 'What\'s the API name?',
      default: 'some-route'
    }, {
      type: 'input',
      name: 'lowerSuffix',
      message: 'Name is a reserved word, add suffix for lowercase identifier',
      default: 'Obj',
      when: function (props) {
        return reservedWords.check(_.lowerCase(props.route), 6);
      }
    }, {
      type: 'input',
      name: 'routes',
      message: 'What\'s the endpoint name?',
      default: function (props) {
        return pluralize(props.route);
      }
    }, {
      type: 'input',
      name: 'dir',
      message: 'Where to put the code?',
      default: srcDir + '/' + apiDir
    }, {
      type: 'checkbox',
      name: 'methods',
      message: 'Which methods it will have?',
      default: methods.map(function (method) {
        return method.value;
      }),
      choices: methods.map(function (method) {
        return _.assign({}, method, { checked: true });
      })
    }, {
      type: 'confirm',
      name: 'generateModel',
      message: 'Do you want to generate a model?',
      default: true
    }, {
      type: 'input',
      name: 'modelFields',
      message: 'Which fields will the model have? (comma separated, do not include id)',
      when: function (props) {
        return props.generateModel;
      }
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.props.camel = _.camelCase(this.props.route);
      this.props.camels = pluralize(this.props.camel);
      this.props.pascal = _.upperFirst(this.props.camel);
      this.props.pascals = _.upperFirst(this.props.camels);
      this.props.lower = _.lowerCase(this.props.camel);
      this.props.lowers = _.lowerCase(this.props.camels);
      this.props.start = _.upperFirst(this.props.lower);
      this.props.starts = _.upperFirst(this.props.lowers);

      if (this.props.lowerSuffix) {
        this.props.camel = _.lowerCase(this.props.camel) + this.props.lowerSuffix;
        this.props.pascal = _.upperFirst(this.props.camel);
      }

      this.props.srcDir = srcDir;
      this.props.apiDir = apiDir;

      this.props.modelFields = this.props.modelFields || '';
      this.props.modelFields = this.props.modelFields ?
        this.props.modelFields.split(',').map(function (field) {
          return field.trim();
        }) : [];
    }.bind(this));
  }

  writing() {
    var props = this.props;
    var routesFile = path.join(props.srcDir, 'app.js');
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);
    var filepath = function (filename) {
      return path.join(props.dir, props.route, filename);
    };

    copyTpl(tPath('controller.js'), dPath(filepath('controller.js')), props);
    copyTpl(tPath('index.js'), dPath(filepath('index.js')), props);

    if (props.generateModel) {
      copyTpl(tPath('model.js'), dPath(filepath('model.js')), props);
    }

    if (this.fs.exists(routesFile)) {
      var ast = recast.parse(this.fs.read(routesFile));
      var body = ast.program.body;
      var lastImportIndex = _.findLastIndex(body, function (statement) {
        return statement.type === 'ImportDeclaration';
      });
      var actualImportCode = recast.print(body[lastImportIndex]).code;
      var importString = ['import ', props.camel, 'Router from \'./api/', props.route, '\''].join('');
      body.splice(lastImportIndex, 1, importString);
      body.splice(lastImportIndex, 0, actualImportCode);

      var middlewareString = [
        'app.use(\'/', props.routes, '\', ', props.camel, 'Router)'
      ].join('');
      var lastMiddlewareIndex = _.findLastIndex(body, function (statement) {
        if (!statement.expression || !statement.expression.callee) {
          return false;
        }
        var callee = statement.expression.callee;
        return callee.object.name === 'app' && callee.property.name === 'use';
      });

      if (lastMiddlewareIndex === -1) {
        var exportRouterIndex = _.findIndex(body, function (statement) {
          return statement.type === 'ExportDefaultDeclaration';
        });
        body.splice(exportRouterIndex, 0, middlewareString);
      } else {
        var actualMiddlewareCode = recast.print(body[lastMiddlewareIndex]).code;
        body.splice(lastMiddlewareIndex, 1, middlewareString);
        body.splice(lastMiddlewareIndex, 0, actualMiddlewareCode);
      }

      this.fs.write(routesFile, recast.print(ast).code);
    }
  }

  install() { }
};
