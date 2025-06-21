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
exports.retryOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const retryOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield order_1.default.findById(id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        const isSuccess = Math.random() > 0.5;
        order.status = isSuccess ? "success" : "failed";
        order.lastSyncTime = new Date();
        order.errorMessage = isSuccess ? "" : "    res.json(order);retry failure";
        yield order.save();
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.retryOrder = retryOrder;
