var assert = require('assert');
var app = require('../app');

describe('App', function() {
    it('Should be running', function () {
        assert.equal(app.run(), 'Running...');
    });
});