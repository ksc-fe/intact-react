const hasSymbol = typeof Symbol === 'function' && Symbol.for;
const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;

const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};
export {
    isFunction
}
