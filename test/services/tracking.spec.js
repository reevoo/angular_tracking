'use strict';

describe('trackingService', function () {
  var trackingService, pingInstance;

  beforeEach(function() {
    module('eventTracker');

    inject(function(_$rootScope_, _trackingService_) {
      trackingService = _trackingService_;

      pingInstance = {
        trackEvent: jasmine.createSpy('pingInstance.trackEvent'),
        page: {
          viewed: jasmine.createSpy('pingInstance.page.viewed')
        }
      };

      trackingService.pingInstance = pingInstance;
    });
  });

  describe('track',function(){
    it('tracks an event with given data', function() {
      trackingService.track('event', { data: 'foo' });

      expect(pingInstance.trackEvent).toHaveBeenCalledWith({type: 'event', data: 'foo'});
    });

    it('doesn\'t track an event without eventType', function() {
      spyOn(console, 'log');
      trackingService.track(null, { data: 'foo' });

      expect(pingInstance.trackEvent).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('[event-tracker] An eventType name should be provided to track something.');
    });
  });

  describe('trackPageView',function(){
    it('tracks the page view', function() {
      trackingService.trackPageView();

      expect(pingInstance.page.viewed).toHaveBeenCalled();
    });
  });

  describe('trackClick',function(){
    it('tracks an eventType click with any given data', function() {
      trackingService.trackClick({data: 'foo'});

      expect(pingInstance.trackEvent).toHaveBeenCalledWith({type: 'click', data: 'foo'});
    });
  });

  describe('trackChange',function(){
    it('tracks an eventType click with any given data', function() {
      trackingService.trackChange({data: 'foo'});

      expect(pingInstance.trackEvent).toHaveBeenCalledWith({type: 'change', data: 'foo'});
    });
  });

  describe('trackFocus',function(){
    it('tracks an eventType click with any given data', function() {
      trackingService.trackFocus({data: 'foo'});

      expect(pingInstance.trackEvent).toHaveBeenCalledWith({type: 'focus', data: 'foo'});
    });
  });

  describe('trackBlur',function(){
    it('tracks an eventType click with any given data', function() {
      trackingService.trackBlur({data: 'foo'});

      expect(pingInstance.trackEvent).toHaveBeenCalledWith({type: 'blur', data: 'foo'});
    });
  });
});
