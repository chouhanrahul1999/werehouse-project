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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncOrders = void 0;
const order_1 = __importDefault(require("../models/order"));
const syncOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({ status: "pending" });
        const updatedOrders = yield Promise.all(orders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            if (Math.random() < 0.2) {
                return order;
            }
            const isSuccess = Math.random() > 0.3;
            order.status = isSuccess ? "success" : "failed";
            order.lastSyncTime = new Date();
            order.errorMessage = isSuccess ? "" : "sync failure";
            return yield order.save();
        })));
        res.json({ message: "Pending orders synced (some left pending)", updated: updatedOrders.length });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.syncOrders = syncOrders;
