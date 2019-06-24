/*eslint-env mocha*/
/*global chai*/

describe("BOOMR.plugins.FrameTiming", function() {
	var assert = chai.assert;

	describe("exports", function() {
		it("Should have a FrameTiming object", function() {
			assert.isObject(BOOMR.plugins.FrameTiming);
		});

		it("Should have a is_complete() function", function() {
			assert.isFunction(BOOMR.plugins.FrameTiming.is_complete);
		});

		it("Should have a is_supported() function", function() {
			assert.isFunction(BOOMR.plugins.FrameTiming.is_supported);
		});

		it("Should always be complete", function() {
			assert.isTrue(BOOMR.plugins.FrameTiming.is_complete());
		});

		it("Should always be complete", function() {
			BOOMR.plugins.FrameTiming.init();
			assert.isTrue(BOOMR.plugins.FrameTiming.is_complete());
		});
	});

	describe("sendBeaconForFrame()", function() {
		it("Should get the correct entries for this page", function() {
			//
			// NOTE: If you change the resources for this test suite (index.html), this test will
			// need to be updated.
			//

			BOOMR.plugins.FrameTiming.sendBeaconForFrame(window, '04-test');
			var entries = BOOMR.getVar('restiming');

			// NOTE: what is tested depends on the environment, whether it supports ResourceTiming or not
			if (!BOOMR.plugins.FrameTiming.is_supported()) {
				assert.strictEqual(entries, "");
				return;
			}

			entries = JSON.parse(entries);

			// entries is a compressed object trie from the restiming plugin. We don't
			// have to retest all of that stuff, just that it's built is good enough

			var urls = Object.keys(entries);
			assert.strictEqual(1, urls.length);
			assert.isTrue(urls[0].indexOf('http://') > -1);
		});
	});
});
