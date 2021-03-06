jest.dontMock('../../../utils/DOMUtils');
jest.dontMock('../../../utils/JestUtil');
jest.dontMock('../VersionsModal');
/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');

var VersionsModal = require('../VersionsModal');

describe('VersionsModal', function () {

  describe('#onClose', function () {
    beforeEach(function () {
      this.callback = jasmine.createSpy();

      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <VersionsModal onClose={this.callback} versionDump={{}} />,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('shouldn\'t call the callback after initialization', function () {
      expect(this.callback).not.toHaveBeenCalled();
    });

    it('should call the callback when #onClose is called', function () {
      this.instance.onClose();
      expect(this.callback).toHaveBeenCalled();
    });

  });

  describe('#getContent', function () {
    beforeEach(function () {
      var data = {foo: 'bar'};
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <VersionsModal onClose={function () {}} versionDump={data} open={true}/>,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('should return a pre element tag', function () {
      var content = this.instance.getContent();
      var contentInstance = ReactDOM.render(content, this.container);
      var node = ReactDOM.findDOMNode(contentInstance);
      var result = node.querySelector('pre');
      expect(result.tagName).toBe('PRE');
    });

    it('should return a pre element tag', function () {
      var content = this.instance.getContent();
      var contentInstance = ReactDOM.render(content, this.container);
      var node = ReactDOM.findDOMNode(contentInstance);
      var result = node.querySelector('pre');
      expect(result.innerHTML).toEqual('{\n  "foo": "bar"\n}');
    });

  });

});
