/**
 * This module contains all the different functionality needed to track the events of the application.
 * It depends on trackingService (an Angular ReevooPing wrapper).
 */
var angular = require('angular');

import trackingService2 from './services/tracking.js';
import parameterizeService2 from './filters/parameterize.js';
import trackElement2 from './directives/track_element.js';

angular.module('eventTracker', [
  'clientPortalMaterial',
  'ngLodash',
]).config(function($provide, trackingServiceProvider) {
  /**
   * Decorator for the ng-click directive to track all the clicks with ReevooPing.
   */
  $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
    // Gets the existing instance of the trackService so it can be used in the trackable events.
    const trackingService = trackingServiceProvider.$get();

    const compile = $delegate[0].compile;

    $delegate[0].compile = function() {
      const link = compile.apply(this, arguments);

      return function(scope, element, attrs) {
        element.bind('click', function() {
          if (attrs && attrs.tracking) {
            trackingService.trackClick(JSON.parse(attrs.tracking));
          }
        });

        return link.apply(this, arguments);
      };
    };

    return $delegate;
  }]);
})
.run(function($rootScope, trackingService) {
  /**
   * Hook on $locationChangeSuccess event (any change in the url) to track all the page views with ReevooPing.
   */
  $rootScope.$on('$locationChangeSuccess', function() {
    trackingService.trackPageView();
  });
});

angular.module('eventTracker').service('trackingService', trackingService2);
angular.module('eventTracker').filter('parameterize', parameterizeService2);
angular.module('eventTracker').directive('trackElement', trackElement2);
