var expect = chai.expect;

describe('CKEditor directive', function () {
  var $compile, $rootScope, scope;

  beforeEach(module('ckeditor'));

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $document = $injector.get('$document');
    scope = $rootScope.$new();
  }));

  afterEach(function () {
    // Destroy all CKEditor instances.
    _.invoke(CKEDITOR.instances, 'destroy');
  });

  it('should create a new editor', function (done) {
    scope.onReady = function () {
      expect(_.find(CKEDITOR.instances)).to.exist;
      done();
    };

    var element = $compile('<div contenteditable="true" ckeditor ng-model="content" ready="onReady()"></div>')(scope);
  });

  it('should put editor out of readonly mode when ready', function (done) {
    scope.onReady = function () {
      expect(_.find(CKEDITOR.instances).readOnly).to.be.false;
      done();
    };

    var element = $compile('<div contenteditable="true" ckeditor ng-model="content" ready="onReady()"></div>')(scope);
  });

  it('should destroy instance on scope destroy', function (done) {
    scope.onReady = function () {
      scope.$destroy();
      expect(_.size(CKEDITOR.instances)).to.equal(0);
      done();
    };

    var element = $compile('<div contenteditable="true" ckeditor ng-model="content" ready="onReady()"></div>')(scope);
    expect(_.size(CKEDITOR.instances)).to.equal(1);
  });

  it('should synchronize view to editor', function (done) {
    scope.content = 'Hello';

    scope.onReady = function () {
      // We should wait that the editor has setted data.
      setTimeout(function () {
        expect(element).to.contain('Hello');
        done();
      }, 0);
    };

    var element = $compile('<div contenteditable="true" ckeditor ng-model="content" ready="onReady()"></div>')(scope);
  });

  it('should synchronize editor to the view', function (done) {
    scope.onReady = function () {
      _.find(CKEDITOR.instances).setData('<p>Hey</p>');
      setTimeout(function () {
        expect(scope.content).to.equal('<p>Hey</p>');
        done();
      }, 0);
    };

    var element = $compile('<div contenteditable="true" ckeditor ng-model="content" ready="onReady()"></div>')(scope);
  });

  it('should create an inline editor', function (done) {
    scope.onReady = function () {
      expect(_.find(CKEDITOR.instances).editable().isInline()).to.be.true;
      done();
    };

    var element = $compile('<div contenteditable="true" ckeditor ng-model="content" ready="onReady()"></div>')(scope);
  });

  it('should create a non-inline editor', function (done) {
    scope.onReady = function() {
      expect(_.find(CKEDITOR.instances).editable().isInline()).to.be.false;
      done();
    };

    var element = angular.element('<textarea ckeditor ng-model="test" ready="onReady()"></textarea>');
    $document.find('body').append(element);
    $compile(element)(scope);
  });

});
