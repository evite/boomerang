// This code is run after all plugins have initialized
BOOMR.init({
	beacon_url:
		window.parent && window.parent.BOOMR_config &&
		window.parent.BOOMR_config.beacon_url ||
		"/eventhorizon/rum/",
	autorun: true,
	beacon_interval: 60,
	BW: {enabled: false},
	RT: {session_exp: 1800},
	ResourceTiming: {enabled: true},
	Errors: {
		enabled: true,
		maxErrors: 10,
		sendAfterOnload: true,
		sendInterval: 1000
	},
	Continuity: {enabled: true},
	TPAnalytics: {enabled: true, clientids: true},
	PageParams: {
		xhr: "none",
		params: true
	}
});
BOOMR.t_end = new Date().getTime();
