define(function(require,exports,module){"use strict";var AppInit=brackets.getModule("utils/AppInit"),PreferencesManager=brackets.getModule("preferences/PreferencesManager"),UrlParams=brackets.getModule("utils/UrlParams").UrlParams,HealthDataPreview=require("HealthDataPreview"),HealthDataPopup=require("HealthDataPopup");var params=new UrlParams;function handleHealthDataStatistics(){HealthDataPreview.previewHealthData()}AppInit.appReady(function(){params.parse();if(!params.get("testEnvironment")){var alreadyShown=PreferencesManager.getViewState("healthDataNotificationShown");if(!alreadyShown){HealthDataPopup.showFirstLaunchTooltip().done(function(){PreferencesManager.setViewState("healthDataNotificationShown",true)})}}});exports.handleHealthDataStatistics=handleHealthDataStatistics});