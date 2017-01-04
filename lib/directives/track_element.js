'use strict';

function trackElement(trackingService, lodash) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var currentTrackingAttributes = function () {
        return JSON.parse(attrs.tracking);
      };

      /**
       * Tracks a change event using the combination of `trackingAttributes` and `overridenAttributes`.
       * @param  {object} overridenAttributes Contains the attributes that need to be overriden
       *                                      on `trackingAttributes`
       */
      var trackChange = function (overridenAttributes) {
        trackingService.trackChange(lodash.merge({}, currentTrackingAttributes(), overridenAttributes));
      };

      var ngModelTrack = function (trackThis) {
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (trackThis(newValue, oldValue)) {
            trackChange({value: currentTrackingAttributes().value || newValue});
          }
        });
      };

      var trackTextChange = function (trackMethod) {
        return function () {
          trackMethod(lodash.merge(
            {},
            currentTrackingAttributes(),
            { value: lodash.get(scope, attrs.ngModel) || '' }
          ));
        };
      };

      switch (element.prop('tagName').toLowerCase()) {
        case 'input': // type="text"
        case 'textarea':
          element
            .on('focus', trackTextChange(trackingService.trackFocus))
            .on('blur',  trackTextChange(trackingService.trackBlur));
          break;
        case 'md-select':
        case 'md-switch':
        /**
         * This check is needed to validate that we aren't in the initialization scenario.
         * The explanation can be found here: https://docs.angularjs.org/api/ng/type/$rootScope.Scope
         */
          ngModelTrack(function(newValue, oldValue) {
            return oldValue !== newValue;
          });
          break;
        case 'md-checkbox':
        case 'md-radio-group':
          ngModelTrack(function(newValue, oldValue) {
            return oldValue !== newValue && oldValue !== undefined;
          });
          break;
      }
    }
  };
};
