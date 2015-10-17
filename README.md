# Thread-runner [![Build Status](https://travis-ci.org/redshark1802/thread-runner.svg)](https://travis-ci.org/redshark1802/thread-runner)

```javascript

var Thread = require('thread-runner'),
    //workStack has to be an array of elements that need to be processed
    workStack = ['6', '5', '4', '3', '2' , '1', '0'];


/**
 * @param stackElement single element from workStack
 * @param callback
 */
var functionToBeThreaded = function (stackElement, callback, stack) {

    var timeout = stackElement * 1000;
    console.log(timeout);

    setTimeout(function () {
        
        /**
         * you even can add new elements to the stack
         * stack.push('1');
         *
         */
    
        return callback(timeout);
    }, timeout);
};

//will be called once every element in workStack has been processed by functionToBeThreaded.
var workStackDone = function(results){
    console.log('all results', results);
};

var thread = new Thread(functionToBeThreaded, workStack, workStackDone);

//set the number of concurrent threads, default 10
thread.setMaxThreads(2);

//will be called every time functionToBeThreaded is done processing a stackElement
var singleResult = function(result){
    console.log('single result', result);
};

thread.setListener(singleResult);

//start the runner
thread.run();

```