/*eslint-env mocha*/
/*global chai*/

describe("BOOMR.plugins.Hit", function() {
	var assert = chai.assert;

	describe("exports", function() {
		it("Should have a Hit object", function() {
			assert.isObject(BOOMR.plugins.Hit);
		});

		it("Should have a is_complete() function", function() {
			assert.isFunction(BOOMR.plugins.Hit.is_complete);
		});

		it("Should have a is_supported() function", function() {
			assert.isFunction(BOOMR.plugins.Hit.is_supported);
		});

		it("Should always be complete", function() {
			assert.isTrue(BOOMR.plugins.Hit.is_complete());
		});

		it("Should always be complete", function() {
			BOOMR.plugins.Hit.init();
			assert.isTrue(BOOMR.plugins.Hit.is_complete());
		});
	});

	describe("send()", function() {
		it("Should should send a beacon", function() {
			//
			// NOTE: If you change the resources for this test suite (index.html), this test will
			// need to be updated.
			//

			BOOMR.plugins.Hit.send('conversion');
			const hit = BOOMR.getVar('hit');
			assert.strictEqual(hit, 'conversion');
		});
	});
});
