
$(function () {
  
  // contructs a new PiwikAPI object
  function PiwikAPI (url, token) {
    this.url = url;
    this.token = token;
  }
  
  // queries information about accessible sites
  PiwikAPI.prototype.getSitesInfo = function PiwikAPI_getSitesInfo (callback) {
    
    $.get({
      url: this.url + "?module=API&method=SitesManager.getSitesWithAtLeastViewAccess&format=json&token_auth=" + this.token
    })
    .done(function(data) {
      callback(data);
    })
    .fail(function(err) {
      callback({});
    });
    
  };
  
  // export PiwikAPI class
  window.PiwikAPI = PiwikAPI;
  
});
