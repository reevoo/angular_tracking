describe('Event Tracker', function() {
  var trackingService, trackingServiceMock;

  beforeEach(function() {
    module('eventTracker');

    /**
     * This is needed to fake the trackingServiceProvider in the config phase of the fastResponse module.
     */
    module(function(trackingServiceProvider) {
      trackingService = trackingServiceProvider;
      trackingServiceMock = jasmine.createSpyObj(
        'trackingService',
        ['trackPageView', 'trackClick', 'trackChange', 'trackFocus', 'trackBlur']
      );
      spyOn(trackingService, '$get').and.returnValue(trackingServiceMock);
    });
  });

  describe('decorator for ng-click directive with data-tracking attribute', function () {
    var scope, element;

    beforeEach(inject(function ($compile, $rootScope) {
      scope = $rootScope;
      scope.clickHandler = jasmine.createSpy('clickHandler');
      element = angular.element(
        '<div data-tracking="{{ { action: \'changed_search_filter\'} }}" ng-click="clickHandler(\'test string\')"></div>'
      );
      $compile(element)(scope);
      scope.$digest();

    }));

    it('calls the click function callback and trackingService.trackClick', function () {
      element.click();
      expect(trackingServiceMock.trackClick).toHaveBeenCalled();
      expect(scope.clickHandler).toHaveBeenCalledWith('test string');
    });
  });

  describe('decorator for ng-click directive without data-tracking attribute', function () {
    var scope, element;

    beforeEach(inject(function ($compile, $rootScope) {
      scope = $rootScope;
      scope.clickHandler = jasmine.createSpy('clickHandler');
      element = angular.element(
        '<div ng-click="clickHandler(\'test string\')"></div>'
      );
      $compile(element)(scope);
      scope.$digest();

    }));

    it('just calls the click function callback', function () {
      element.click();
      expect(trackingServiceMock.trackClick).not.toHaveBeenCalled();
      expect(scope.clickHandler).toHaveBeenCalledWith('test string');
    });
  });

  describe('hook on $locationChangeSuccess', function () {
    var scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope;
    }));
    it('calls trackingService.trackPageView on url change', function(){
      scope.$broadcast('$locationChangeSuccess');
      expect(trackingServiceMock.trackPageView).toHaveBeenCalled();
    });
  });
});
