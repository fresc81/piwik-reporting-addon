
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
  
  PiwikAPI.prototype.getVisitsSummaryImageURLForPageURL = function PiwikAPI_getVisitsSummaryImageURLForPageURL (idSite, pageUrl, periodBase, periodCount) {
    
    var idSiteParam = "idSite=" + idSite;
    var periodParam = "period=" + periodBase;
    var dateParam   = "date=last" + periodCount;
    var segmentParam = "segment=" + "pageUrl=^"+ encodeURIComponent(pageUrl);
    var sizeParam = "width=250&height=210";
    
    return this.url + "?module=API&method=ImageGraph.get&apiModule=VisitsSummary&graphType=evolution&apiAction=get&"+idSiteParam+"&"+periodParam+"&"+dateParam+"&"+segmentParam+"&"+sizeParam+"&token_auth=" + this.token;
  };
  
  // export PiwikAPI class
  window.PiwikAPI = PiwikAPI;
  
});
