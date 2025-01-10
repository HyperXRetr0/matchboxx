"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clients = void 0;
exports.formatString = formatString;
function formatString(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
exports.clients = new Map();
