
$(function () {
  
  // load settings and initialize control elements
  function onSettingsLoaded (settings) {
    console.log("loaded settings", settings);
    
    if (settings.piwikUrl)
      $("#input-settings-piwik-url").get(0).value = settings.piwikUrl;
    
    if (settings.piwikToken)
      $("#input-settings-piwik-token").get(0).value = settings.piwikToken;
    
  }
  
  // handle save action
  function onSettingsSave (event) {
    
    var self = $(this);
    var settings = {
      piwikUrl: $("#input-settings-piwik-url").get(0).value,
      piwikToken: $("#input-settings-piwik-token").get(0).value
    };
    
    event.preventDefault();
    
    // store settings
    chrome.storage.local.set(settings, function () {
      
      console.log("settings saved");
      window.close();
      
      // send notification message
      chrome.runtime.sendMessage({
        type: "settings:saved",
        settings: settings
      });
      
    });
    
  }
  
  // TODO: handle reset action
  function onSettingsReset (event) {
    
    var self = $(this);
    event.preventDefault();
    window.close();
    
  }
  
  // TODO: handle validate URL
  function onValidatePiwikUrl (event) {
    
    var self = $(this);
    
  }
  
  // TODO: handle validate token
  function onValidatePiwikToken (event) {
    
    var self = $(this);
    
  }
  
  console.log("options.js starting...");
  
  // assign event handlers...
  $("#form-settings").submit(onSettingsSave);
  $("#input-settings-reset").click(onSettingsReset);
  $("#piwikUrl").change(onValidatePiwikUrl);
  $("#piwikToken").change(onValidatePiwikToken);

  // load settings
  chrome.storage.local.get(["piwikUrl", "piwikToken"], onSettingsLoaded);
  
});
