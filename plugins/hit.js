/**
 * Plugin to send custom hits as beacon data. The rt.start reason
 * will be set to the hit name.
 *
 * This plugin adds the following parameters to a new beacon:
 *
 * * `hit.n`: Name of the hit
 *
 * @class BOOMR.plugins.Hit
 */
(function() {
	BOOMR = window.BOOMR || {};
	BOOMR.plugins = BOOMR.plugins || {};

	if (BOOMR.plugins.Hit) {
		return;
	}

	BOOMR.plugins.Hit = {
		/**
		 * Initializes the plugin.
		 *
		 * @param {object} config Configuration
		 *
		 * @returns {@link BOOMR.plugins.Hit} The Hit plugin for chaining
		 * @memberof BOOMR.plugins.Hit
		 */
		init: function(config) {
			BOOMR.utils.pluginConfig(impl, config, "Hit", []);
		},

		/**
		 * Whether or not this plugin is complete
		 *
		 * @returns {boolean} `true` if the plugin is complete
		 * @memberof BOOMR.plugins.Hit
		 */
		is_complete: function() {
			return true;
		},

		/**
		 * Whether or not this Hit is enabled and supported.
		 *
		 * @returns {boolean} `true` if Hit plugin is enabled.
		 * @memberof BOOMR.plugins.Hit
		 */
		is_enabled: function() {
			return impl.initialized;
		},

		/**
		 * Whether or not Hit is supported in this browser.
		 *
		 * @returns {boolean} `true`
		 * @memberof BOOMR.plugins.Hit
		 */
		is_supported: function() {
			return true;
		},

		//
		// Public Exports
		//

		/**
		 * Adds 'restiming' and 'servertiming' to the beacon
		 *
		 * @param {string} hit name
		 * @param {number} startTime time of the event, defaults to `BOOMR.now()`
		 *
		 * @memberof BOOMR.plugins.Hit
		 */
		send: function(hit, startTime) {
			startTime = startTime || BOOMR.now();

			// Queue a beacon whenever there isn't another one ongoing
			BOOMR.sendBeaconWhenReady(
				{
					"rt.start": "manual",
					"http.initiator": 'hit',
					// added as a single variable so it's removed after the beacon is sent.
					// Don't want duplicates.
					"hit": hit,

					// when
					"rt.tstart": startTime,
					"rt.end": startTime
				}
			);

			return true;
		}
	};
})();
