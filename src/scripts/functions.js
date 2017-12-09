export function debounce(callback, delay){
    var timer;

    return function(){
        var args = arguments;
        var context = this;

        clearTimeout(timer);
        timer = setTimeout(function(){
            callback.apply(context, args);
        }, delay)
    }
}

export function throttle(callback, delay){
    var last;
    var timer;

    return function(){
        var context = this;
        var now = +new Date();
        var args = arguments;

        if(last && now < last + delay){
            clearTimeout(timer);
            timer = setTimeout(function(){
                last = now;
                callback.apply(context, args);
            }, delay);
        }else{
            last = now;
            callback.apply(context, args);
        }
    };
}

export function each(array, callback){
    for(var i = 0, len = array.length; i < len; i++){
        callback(i, array[i]);
    }
}

export function eachIn(object, callback){
    var index = 0;

    for(var prop in object){
        callback(prop, object[prop], index);
        index++;
    }
}
