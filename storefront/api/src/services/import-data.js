"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var faker_1 = require("faker");
function isExistedData() {
    return new Promise(function (resolve, reject) {
        models_1.Product.find({}, function (errors, products) {
            if (products.length > 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}
function importData() {
    return __awaiter(this, void 0, void 0, function () {
        var existed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isExistedData()];
                case 1:
                    existed = _a.sent();
                    if (existed) {
                        return [2 /*return*/, Promise.resolve()];
                    }
                    console.log('start import data');
                    return [2 /*return*/, new Promise(function (resolve) {
                            var totalItem = 0;
                            for (var i = 0; i < 100; i++) {
                                var item = new models_1.Product({
                                    name: faker_1.commerce.productName(),
                                    price: faker_1.commerce.price(100, 200, 2),
                                    description: "<div>" + new Array(faker_1.random.number({ min: 1, max: 4 })).fill(null).map(function (e) { return "<p>" + faker_1.lorem.paragraph() + "</p>"; }).join('') + "</div>",
                                    images: [{
                                            type: 'Thumbnail',
                                            src: faker_1.image.food(1024, 1024) + "?random=" + Date.now()
                                        }]
                                });
                                item.save(function (error) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    else {
                                        if (totalItem == 100) {
                                            resolve();
                                        }
                                        totalItem++;
                                    }
                                });
                            }
                        })];
            }
        });
    });
}
exports.importData = importData;
