jest.dontMock('../../../../tests/_fixtures/networking/networking-vip-detail.json');

var BackendList = require('../BackendList');
var VIPDetail = require('../VIPDetail');
var vipDetailFixture = require('../../../../tests/_fixtures/networking/networking-vip-detail.json');

describe('VIPDetail', function () {

  beforeEach(function () {
    this.vipDetail = new VIPDetail(vipDetailFixture);
  });

  describe('#getBackends', function () {

    it('returns an instance of BackendList', function () {
      expect(this.vipDetail.getBackends() instanceof BackendList).toBeTruthy();
    });

    it('returns the all of the backends it was given', function () {
      expect(this.vipDetail.getBackends().getItems().length).toEqual(
        vipDetailFixture.backends.length
      );
    });

  });

});
