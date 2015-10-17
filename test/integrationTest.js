var Thread = require('./../src/index.js');

require('should');

var threadedAsyncFunction = function (stackElement, callback) {

    var timeout = stackElement * 10;

    setTimeout(function () {
        return callback(timeout);
    }, timeout);
};

var threadedSyncFunction = function (stackElement, callback) {
    callback(stackElement);
};


describe('Integration', function () {

    it('should run in sequence with 1 thread', function (done) {

        var stack = ['6', '5', '4', '3', '2', '1'],
            expectedResponse = [60, 50, 40, 30, 20, 10];

        var thread = new Thread(threadedAsyncFunction, stack, function (result) {
            result.should.deepEqual(expectedResponse);
            done();
        });
        thread.setMaxThreads(1);
        thread.run();
    });

    it('should run parallel with 2 threads', function (done) {
        this.timeout(5000);
        var stack = ['250', '200', '150', '100', '50'],
            expectedResponse = [2000, 2500, 1500, 1000, 500];

        var thread = new Thread(threadedAsyncFunction, stack, function (result) {
            result.should.deepEqual(expectedResponse);
            done();
        });
        thread.setMaxThreads(2);
        thread.run();
    });

    it('should not cause an infinite loop when threaded function is not async', function (done) {

        var stack = ['60', '50', '40', '30', '20', '10'],
            expectedResponse = ['60', '50', '40', '30', '20', '10'];

        var thread = new Thread(threadedSyncFunction, stack, function (result) {
            result.should.deepEqual(expectedResponse);
            done();
        });
        thread.setMaxThreads(2);
        thread.run();
    });
});