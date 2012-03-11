Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");  
Components.utils.import("resource://calendar/modules/calUtils.jsm");

  
function audioAlarmMonitor() {  
	
	cal.ERROR("Error ANTOconst");
    this.wrappedJSObject = this;
    this.mAlarms = [];

    this.mSound = Components.classes["@mozilla.org/sound;1"]
                            .createInstance(Components.interfaces.nsISound);
							
							
	cal.ERROR("Error ANTOconstfinal");


}  


audioAlarmMonitor.prototype = {  
  // this must match whatever is in chrome.manifest!  
  classID: Components.ID("{89d98ce9-ec1c-47e4-8b24-c7e678336df0}"),  
  
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIObserver, Components.interfaces.calIAlarmServiceObserver]),  
  
  /* nsIMyComponent implementation goes here */  
  
	mAlarms: null,
	mWindowOpening: null,
	mSound: null,
	 
	observe: function cAM_observe(aSubject, aTopic, aData) {
	
		//cal.ERROR("Error ANTOobserve");
		let alarmService = Components.classes["@mozilla.org/calendar/alarm-service;1"]
                                      .getService(Components.interfaces.calIAlarmService);
		switch (aTopic) {
			case "alarm-service-startup":
			alarmService.addObserver(this);
            break;
			case "alarm-service-shutdown":
			alarmService.removeObserver(this);
			break;
		}		
	},
		
		
	onAlarm: function cAM_onAlarm(aItem, aAlarm) {
		  
		if (aAlarm.action != "AUDIO") {
			// This monitor only looks for AUDIO alarms.
			return;
		}
		//cal.ERROR("Error ANTOonallam");
		let soundURL = aAlarm.getAttachments({})[0].uri;
		//cal.ERROR(soundURL);
		//soundURL = makeURL(soundURL);
		this.mSound.play(soundURL);
		Components.classes["@mozilla.org/calendar/alarm-service;1"].getService(Components.interfaces.calIAlarmService).dismissAlarm(aItem, aAlarm);
		
		
							
	},
		
		
	onRemoveAlarmsByItem: function cAM_onRemoveAlarmsByItem(aItem) {
		//cal.ERROR("Error ANTOrem");
		
	},
 
 
	onRemoveAlarmsByCalendar: function cAM_onRemoveAlarmsByCalendar(calendar) {
		//cal.ERROR("Error ANTOrem");
 
	}
	 

};  

// The following line is what XPCOM uses to create components. Each component prototype  
// must have a .classID which is used to create it.  
//cal.ERROR("Error ANTOrem");
const NSGetFactory = XPCOMUtils.generateNSGetFactory([audioAlarmMonitor]); 


//al.ERROR("Error ANTOrem");