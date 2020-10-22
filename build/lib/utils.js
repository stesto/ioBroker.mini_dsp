"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cramp = void 0;
function cramp(value, min, max) {
    if (value <= min) {
        return min;
    }
    if (value >= max) {
        return max;
    }
    return value;
}
exports.cramp = cramp;
