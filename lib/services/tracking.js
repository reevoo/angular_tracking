function trackingService($window, lodash, $filter) {
  var that = this;

  this.pingInstance = new $window.ReevooPing.Client('client_portal-admin', {});

  this.track = function (eventType, data) {
    if (!eventType) {
      console.log('[event-tracker] An eventType name should be provided to track something.');
      return;
    }
    console.log(eventType, parameterizeValues(data));
    this.pingInstance.trackEvent(lodash.merge({}, parameterizeValues(data), {type: eventType}));
  };

  this.trackClick = function (data) {
    that.track('click', parameterizeValues(data));
  };

  this.trackChange = function (data) {
    that.track('change', parameterizeValues(data));
  };

  this.trackFocus = function (data) {
    that.track('focus', parameterizeValues(data));
  };

  this.trackBlur = function (data) {
    that.track('blur', parameterizeValues(data));
  };

  this.trackPageView = function () {
    this.pingInstance.page.viewed();
  };

  var parameterizeValues = function (data) {
    Object.keys(data).map(function (key) {
      if (key !== 'value') {
        data[key] = $filter('parameterize')(data[key]);
      } else if(typeof data[key] === 'number') {
        data[key] = data[key].toString();
      }
    });
    return data;
  }
}

export default trackingService

