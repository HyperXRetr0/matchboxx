"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clients = void 0;
exports.formatString = formatString;
exports.hasIntersection = hasIntersection;
function formatString(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
function hasIntersection(arr1, arr2) {
    return arr1.some((skill) => arr2.includes(skill));
}
exports.clients = new Map();
