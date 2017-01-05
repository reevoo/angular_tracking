'use strict';

describe('Filter: parameterize', function() {
  var parameterize;

  beforeEach(module('eventTracker'));

  beforeEach(inject(function(parameterizeFilter) {
    parameterize = parameterizeFilter;
  }));

  it('changes to lowercase', function() {
    expect(parameterize('HellOO')).toEqual('helloo');
  });

  it('adds underscores instead of spaces', function() {
    expect(parameterize('test event')).toEqual('test_event');
  });

  it('removes blank spaces', function() {
    expect(parameterize(' test ')).toEqual('test');
  });

  it('converts numbers to strings', function() {
    expect(parameterize(22)).toEqual('22');
  });

  it('only adds one underscore if multiple characters should be replaced', function() {
    expect(parameterize('_+=test _ ')).toEqual('test');
  });
});
