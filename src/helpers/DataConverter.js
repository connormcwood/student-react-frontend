
module.exports.optionsGenerator = function(array, valueProp = "value", labelProp = "title") {
    let options = [];
    if(typeof array !== 'undefined' && array.length > 0) {
        for(let i = 0; i < array.length; i++) {
            options[i] = {value: array[i][valueProp], label: array[i][labelProp]};
        }
    }

    return options;
};