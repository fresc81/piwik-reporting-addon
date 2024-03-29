
$(function () {
  
  // a click on the HTML body
  function onClickBody (event) {
    event.preventDefault();
    window.close();
  }
  
  // settings button
  function onClickSettings (event) {
    event.preventDefault();
    chrome.runtime.openOptionsPage();
  }
  
  // report button
  function onClickReport (event) {
    event.preventDefault();
    window.close();
    chrome.tabs.create({
      url: chrome.runtime.getURL("report.html"),
      active: true      
    });
  }
  
  // prevent clicks in the summary-period dropdown from closing the popup
  function onClickSummaryPeriod (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // report summary period has been changed
  function onChangeSummaryPeriod (event) {
    event.preventDefault();
    
    // TODO: reload summary...
    console.log("reload summary...");
    chrome.runtime.sendMessage({
      type: "browser:requestSiteInfo"
    }, onRequestSiteInfoResponse);
  }
  
  // opens the project homepage in a new tab
  function onClickProjectLink (event) {
    event.preventDefault();
    window.close();
    chrome.tabs.create({
      url: chrome.runtime.getManifest().homepage_url,
      active: true      
    });
  }
  
  // process messages sent by other modules...
  function onMessageReceived (message, sender, sendResponse) {
    switch (message.type) {
      
    default:
      break;
    
    }
  }
  
  // load the quick summary for the currently active tab
  function loadPageSummary (url, idSite) {
    
    console.log("load summary for '"+url+"'...");
    
    //$("#page-stats").text(siteInfo.idsite+" -> "+siteInfo.name);
    
    var periodBase = $("#summary-period").get(0).value;
    var periodCount = $("#summary-period-count").get(0).value;
    
    $("#page-stats").empty().append(
      $("<img>").attr("src", piwikApi.getVisitsSummaryImageURLForPageURL(idSite, url, periodBase, periodCount))
    );
    $("#page-stats-panel").css("display", "block");
    
  }
  
  // checks, if there is a quick summary available for the currently active tab
  function onQueryCurrentTabResponse () {
    
    // for each tracked site...
    for (var siteId in availableSites) {
      
      var siteInfo = availableSites[siteId];
      
      // if current tab's url matches the site
      // TODO: cleaner matching
      var httpUrl = activeTab.url.replace(/^https:/, "http:");
      if (httpUrl.startsWith(siteInfo.main_url)) {
        
        // TODO: print stats for current URL...
        
        loadPageSummary(activeTab.url, siteInfo.idsite);
        
        // return early - only first match will be processed
        return;
      }
      
    }
  
  }
  
  // receives requested information about the sites tracked by Piwik
  function onRequestSiteInfoResponse (response) {
    if (response.type === "okay") {
      
      availableSites = response.siteInfo.availableSites;
      console.log("available sites: ", availableSites);
      
      var settings = response.siteInfo.settings;
      piwikApi = new PiwikAPI(settings.piwikUrl, settings.piwikToken);
      
      // get active tab
      chrome.tabs.query({ active: true }, function (activeTabs) {
        
        if (activeTabs.length > 0) {
          activeTab = activeTabs[0];
          onQueryCurrentTabResponse();
        }
        
      });
      
    } else {
      
      // error in response
      
    }
  }
  
  console.log("browser.js starting...");
  
  // keeps track of sites available for quick summary
  var availableSites = {};
  
  //
  var piwikApi = null;
  
  // holds a reference to the tab that was active when the popup has been opened
  var activeTab = null;
  
  // assign event handlers...
  $("body").click(onClickBody);
  $("#settings-open").click(onClickSettings);
  $("#report-generate").click(onClickReport);
  $("#project-link").click(onClickProjectLink);
  
  // control the quick summary period
  $("#summary-period")
  .click(onClickSummaryPeriod)
  .change(onChangeSummaryPeriod);
  
  $("#summary-period-count")
  .click(onClickSummaryPeriod)
  .change(onChangeSummaryPeriod);
  
  // process messages from other modules...
  chrome.runtime.onMessage.addListener(onMessageReceived);
  
  // Requests information about sites currently tracked in Piwik.
  // This information is cached by background.js in order to reduce Piwik requests.
  chrome.runtime.sendMessage({
    type: "browser:requestSiteInfo"
  }, onRequestSiteInfoResponse);
  
});
