/**
 * Plugin to collect metrics from the W3C [ResourceTiming]{@link http://www.w3.org/TR/resource-timing/}
 * API.
 *
 * Just like the restiming plugin this is based off of, this plugin collects resource timing
 * information and uses the same fields. It requires restiming to build.
 *
 * Unlike restiming, this plugin doesn't automatically run and submit information. It is designed to collect
 * information for a single frame and submit it in a separate beacon. This is useful for ad monitoring where
 * frames are
 *
 * For information on how to include this plugin, see the {@tutorial building} tutorial.
 *
 * ## Beacon Parameters
 *
 * This plugin adds the following parameters to the beacon for Page Loads:
 *
 * * `restiming`: Compressed FrameTiming data
 *
 * See the ResourceTiming plugin for details
 *
 * @see {@link http://www.w3.org/TR/resource-timing/}
 * @class BOOMR.plugins.FrameTiming
 */
(function() {
	BOOMR = window.BOOMR || {};
	BOOMR.plugins = BOOMR.plugins || {};

	if (BOOMR.plugins.FrameTiming) {
		return;
	}

	impl = {
		initialized: false,
		supported: null,
	};

	BOOMR.plugins.FrameTiming = {
		/**
		 * Initializes the plugin.
		 *
		 * @param {object} config Configuration
		 *
		 * @returns {@link BOOMR.plugins.FrameTiming} The FrameTiming plugin for chaining
		 * @memberof BOOMR.plugins.FrameTiming
		 */
		init: function(config) {
			BOOMR.utils.pluginConfig(impl, config, "FrameTiming", []);

			if (impl.initialized) {
				return this;
			}

			impl.initialized = true;
			return this;
		},

		/**
		 * Whether or not this plugin is complete
		 *
		 * @returns {boolean} `true` if the plugin is complete
		 * @memberof BOOMR.plugins.FrameTiming
		 */
		is_complete: function() {
			return true;
		},

		/**
		 * Whether or not this FrameTiming is enabled and supported.
		 *
		 * @returns {boolean} `true` if FrameTiming plugin is enabled.
		 * @memberof BOOMR.plugins.FrameTiming
		 */
		is_enabled: function() {
			return impl.initialized && this.is_supported();
		},

		/**
		 * Whether or not FrameTiming is supported in this browser.
		 *
		 * @returns {boolean} `true` if FrameTiming is supported.
		 * @memberof BOOMR.plugins.FrameTiming
		 */
		is_supported: function() {
			return BOOMR.plugins.ResourceTiming.is_supported();
		},

		//
		// Public Exports
		//

		/**
		 * Adds 'restiming' and 'servertiming' to the beacon
		 *
		 * @param {Frame} frame collect resource information from this frame
		 * @param {string} initiator name to use for http.initiator, defaults to `frametiming`
		 *
		 * @memberof BOOMR.plugins.FrameTiming
		 */
		sendBeaconForFrame: function(frame, initiator) {
			var resources,
				startTime = BOOMR.now();

			// Can't send if we don't support JSON
			if (typeof JSON === "undefined") {
				return false;
			}
			if (BOOMR.plugins.ResourceTiming === undefined) {
				BOOMR.error("ResourceTiming plugin is not loaded");
				return false;
			}
			if (!frame) return false;

			/* BEGIN_DEBUG */
			BOOMR.utils.mark("frametiming:build:start");
			/* END_DEBUG */

			resources = BOOMR.plugins.ResourceTiming.getCompressedResourceTiming(
				frame
			);

			/* BEGIN_DEBUG */
			BOOMR.utils.mark("frametiming:build:end");
			BOOMR.utils.measure(
				"frametiming:build",
				"frametiming:build:start",
				"frametiming:build:end"
			);
			/* END_DEBUG */

			if (!resources) {
				BOOMR.info("ResourceTiming is not supported");
				return false;
			}

			// Queue a beacon whenever there isn't another one ongoing
			BOOMR.sendBeaconWhenReady(
				{
					"rt.start": "manual",
					"http.initiator": initiator || "frametiming",

					// when
					"rt.tstart": startTime,
					"rt.end": startTime
				},
				function() {
					BOOMR.removeVar("restiming");
					BOOMR.removeVar("servertiming");

					BOOMR.plugins.ResourceTiming.addToBeacon(resources);
				},
				impl
			);

			return true;
		}
	};
})();
