// returns the value from a specific class
export function getValueByClass(queryClass) {
    return document.querySelector(queryClass).value;
}

// returns the element from a specific class
export function getElementByClass(queryClass) {
    return document.querySelector(queryClass);
}