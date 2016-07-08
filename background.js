
$(function () {
  
  // handle changed settings
  function onSettingsSaved (message, sender, sendResponse) {
    
    // reload Piwik data
    reloadPiwikData();
    
    sendResponse({
      type: "okay"
    });
    
  }
  
  // handle site info requests from other modules
  function onSiteInfoRequested (message, sender, sendResponse) {
    
    sendResponse({
      type: "okay",
      siteInfo: {
        availableSites: availableSites,
        settings: {
          piwikUrl: piwikApi.url,
          piwikToken: piwikApi.token
        }
      }
    });
    
  }

  // handle incoming messages
  function onMessageReceived (message, sender, sendResponse) {
    switch (message.type) {
      
    case "settings:saved":
      onSettingsSaved(message, sender, sendResponse);
      break;
      
    case "browser:requestSiteInfo":
      onSiteInfoRequested(message, sender, sendResponse);
      break;
    
    default:
      sendResponse({
        type: "error"
      });
      break;
    
    }
  }
  
  // process sites info requested from Piwik
  function onReceivedSitesInfo (siteInfo) {
    
    availableSites = siteInfo;
    
  }
  
  // request sites info from Piwik
  function onSettingsLoaded (settings) {
    
    piwikApi = new PiwikAPI(settings.piwikUrl, settings.piwikToken);
    piwikApi.getSitesInfo(onReceivedSitesInfo);
    
  }
  
  // reload settings
  function reloadPiwikData () {
    
    console.log("reload Piwik data...");
    chrome.storage.local.get(["piwikUrl", "piwikToken"], onSettingsLoaded);
    
  }
  
  console.log("background.js starting...");

  // caches the sites info from Piwik
  var availableSites = {};
  
  // as long as the settings do not change the Piwik API object can be reused
  var piwikApi = null;

  // handle incoming messages
  chrome.runtime.onMessage.addListener(onMessageReceived);

  // reload Piwik data
  reloadPiwikData();
  
});
