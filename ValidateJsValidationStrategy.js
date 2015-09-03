var union = require('lodash.union');
var reduce = require('lodash.reduce');
var validatejs = require('validate.js');

var ValidateJsValidationStrategy = {
  validate: function(constraints, data, key) {
    constraints = constraints || {};
    data = data || {};
    var options = {
      format: 'detailed',
    };
    var errors = this._format(validatejs.validate(data, constraints, options));
    if (key === undefined) {
      union(Object.keys(constraints), Object.keys(data)).forEach(function(error) {
          errors[error] = errors[error] || [];
        });
        return errors;
    } else {
      var result = {};
      result[key] = errors[key];
      return result;
    }
  },

  _format: function(validateResult) {
    if (validateResult != null) {
      return reduce(validateResult, function(result, error) {
        // Act with an array because of ValidationFactory
        result[error.attribute] = [];
        result[error.attribute].push(error.error);
        return result;
      }, {});
    } else {
      return {};
    }
  }
};

module.exports = ValidateJsValidationStrategy;
