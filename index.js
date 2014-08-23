
/**
 *
 * @param threadedFunction
 * @param workStack
 * @param callback
 * @constructor
 */
function Thread(threadedFunction, workStack, callback) {
    this.threadedFunction = threadedFunction;
    this.workStack = workStack;
    this.callback = callback;
    this.resultStack = [];

    this.index = 0;
    this.maxThreads = 10;
    this.runningThreads = 0;
    this.running = true;

    this.listener = null;
}

/**
 * set the number of concurrent threads
 * @param maxThreads int
 */
Thread.prototype.setMaxThreads = function (maxThreads) {
    this.maxThreads = maxThreads;
};


/**
 * stop the execution of the current thread
 */
Thread.prototype.stop = function () {
    this.running = false;
};


/**
 * true if maxThreads is bigger than workStack.length
 * @returns {boolean}
 */
Thread.prototype.maxThreadsInvalid = function () {
    return (this.maxThreads > this.workStack.length);
};

/**
 * limits the number of concurrent threads to the workStat.length
 */
Thread.prototype.limitMaxThreads = function () {

    this.maxThreads = this.workStack.length;
};

/**
 * secures validity of maxThreads
 */
Thread.prototype.secureMaxThreadsLimit = function () {
    if (this.maxThreadsInvalid()) {
        this.limitMaxThreads();
    }
};

/**
 * start the runner
 */
Thread.prototype.run = function () {

    this.secureMaxThreadsLimit();

    for (this.runningThreads = 0; this.runningThreads < this.maxThreads; this.runningThreads++) {
        this.threadInstance();
    }
};

/**
 *
 * @returns {boolean}
 */
Thread.prototype.isRunning = function () {
    return this.running;
};

/**
 *
 * @returns {boolean}
 */
Thread.prototype.workLeft = function () {
    return this.index < this.workStack.length;
};

/**
 *
 * @returns {boolean}
 */
Thread.prototype.threadsFinished = function () {
    return this.runningThreads === 0;
};


/**
 * set a event listener that will be called when an element of
 * the workStack is finished
 *
 * @param listener function
 */
Thread.prototype.setListener = function(listener){
    this.listener = listener;
};

/**
 * calls the listener with the result if set
 *
 * @param result
 */
Thread.prototype.emit = function(result){
    if(this.listener !== null && typeof this.listener !== 'undefined'){
        this.listener(result);
    }
};


/**
 * actual runner
 */
Thread.prototype.threadInstance = function (result) {

    if(typeof result !== 'undefined'){
        this.resultStack.push(result);
    }

    if (this.isRunning() && this.workLeft()) {

        var currentLoopIndex = this.index,
            stackElement = this.workStack[currentLoopIndex],
            that = this;


        this.threadedFunction(stackElement, function (result) {
            if(that.isRunning()){
                that.emit(result);
                that.threadInstance(result);
            }
        });

        this.index++;

    } else {
        this.runningThreads--;
        if (this.threadsFinished()) {
            this.callback(this.resultStack);
        }
    }
};

module.exports = Thread;