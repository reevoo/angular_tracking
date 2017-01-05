'use strict';

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

  describe('trackElement directive', function () {
    var scope, element;

    describe('on an md-select element', function () {
      beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        scope.model = 'foo';
        element = angular.element(
          '<md-select track-element data-tracking="{{ { action: \'changed_md_select_value\' } }}" ng-model="model">change value</md-select>'
        );
        $compile(element)(scope);
        scope.$digest();
      }));

      it('calls trackingService.trackChange when the ngModel value changes', function () {
        scope.model = 'bar';
        scope.$digest();
        expect(trackingServiceMock.trackChange)
          .toHaveBeenCalledWith({ action: 'changed_md_select_value', value: 'bar'});
      });
    });

    describe('on an md-switch element', function () {
      beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        element = angular.element(
          '<md-switch track-element data-tracking="{{ { action: \'changed_md_switch_value\', value: \'true\'} }}" ng-model="model">' +
          ' change value' +
          '</md-switch>'
        );
        $compile(element)(scope);
        scope.$digest();
      }));

      it('calls trackingService.trackChange when the value changes by clicking it', function () {
        element.click();
        expect(trackingServiceMock.trackChange)
          .toHaveBeenCalledWith({ action: 'changed_md_switch_value', value: 'true'});
      });
    });

    describe('on an md-checkbox element', function () {
      beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        scope.model = true;
        element = angular.element(
          '<md-checkbox track-element data-tracking="{{ { action: \'changed_md_checkbox_value\' } }}" ng-model="model">' +
          ' change value' +
          '</md-checkbox>'
        );
        $compile(element)(scope);
        scope.$digest();
      }));

      it('calls trackingService.trackChange when the value changes by clicking it', function () {
        element.click();
        expect(trackingServiceMock.trackChange)
          .toHaveBeenCalledWith({ action: 'changed_md_checkbox_value', value: false });
      });
    });

    describe('on an md-radio-group element', function () {
      beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        scope.model = 'foo';
        element = angular.element(
          '<md-radio-group track-element data-tracking="{{ { action: \'changed_radio_value\' } }}" ng-model="model">' +
          ' <md-radio-button value="foo">foo value</md-radio-button>' +
          ' <md-radio-button value="bar">bar value</md-radio-button>' +
          '</md-radio-group>'
        );
        $compile(element)(scope);
        scope.$digest();
      }));

      it('calls trackingService.trackChange when the value changes by clicking it', function () {
        element.children('md-radio-button')[1].click();
        expect(trackingServiceMock.trackChange).toHaveBeenCalledWith({ action: 'changed_radio_value', value: 'bar' });
      });
    });

    describe('on an input text element', function () {
      beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        scope.model = 'foo';
        element = angular.element(
          '<input type="text" track-element data-tracking="{{ { action: \'edit_input_text_value\' } }}" ng-model="model" />'
        );
        $compile(element)(scope);
        scope.$digest();

        element.appendTo(document.body); // This is needed to focus the element
      }));

      afterEach(function () {
        element.remove(); // Remove the element from document.body
      });

      it('calls trackingService.trackFocus when the element is focused', function () {
        element.focus();
        expect(trackingServiceMock.trackFocus)
          .toHaveBeenCalledWith({ action: 'edit_input_text_value', value: 'foo' });
      });

      it('calls trackingService.trackBlur when the element is blurred', function () {
        element.focus();
        element.blur();
        expect(trackingServiceMock.trackBlur)
          .toHaveBeenCalledWith({ action: 'edit_input_text_value', value: 'foo' });
      });
    });

    describe('on a textarea element', function () {
      beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        scope.model = 'foo';
        element = angular.element(
          '<textarea track-element data-tracking="{{ { action: \'edit_textarea_value\' } }}" ng-model="model"></textarea>'
        );
        $compile(element)(scope);
        scope.$digest();

        element.appendTo(document.body); // This is needed to focus the element
      }));

      afterEach(function () {
        element.remove(); // Remove the element from document.body
      });

      it('calls trackingService.trackFocus when the element is focused', function () {
        element.focus();
        expect(trackingServiceMock.trackFocus)
          .toHaveBeenCalledWith({ action: 'edit_textarea_value', value: 'foo' });
      });

      it('calls trackingService.trackBlur when the element is blurred', function () {
        element.focus();
        element.blur();
        expect(trackingServiceMock.trackBlur)
          .toHaveBeenCalledWith({ action: 'edit_textarea_value', value: 'foo' });
      });
    });
  });
});
