function copyToCipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
};

Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
};

function addStyle(cssStr) {
    var D = document;
    var newNode = D.createElement('style');
    newNode.textContent = cssStr;
    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(newNode);
}

function titleCase(str) {
//    str = str.toLowerCase().split(' ');
//    for (var i = 0; i < str.length; i++) {
//        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
//    }
//    return str.join(' ');
    
    const textBox = document.querySelector('#text-box');;
    const regex = /(^|\b(?!(da|de|em|a|e|o)\b))\w+/g;

    return str.toLowerCase().replace(regex, s => s[0].toUpperCase() + s.slice(1));
    
}
