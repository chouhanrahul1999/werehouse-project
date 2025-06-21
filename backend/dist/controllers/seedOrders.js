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
exports.seedOrders = void 0;
const order_1 = __importDefault(require("../models/order"));
const syncOrders_1 = require("./syncOrders");
const seedOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mockChannels = ["Shopify", "Amazon", "eBay"];
    const mockOrders = Array.from({ length: 10 }).map((_, i) => ({
        orderId: `ORD-${1000 + i}`,
        channel: mockChannels[Math.floor(Math.random() * mockChannels.length)],
        status: "pending",
        lastSyncTime: new Date(),
        errorMessage: "",
    }));
    try {
        yield order_1.default.deleteMany(); // clear previous orders (optional)
        const inserted = yield order_1.default.insertMany(mockOrders);
        res.json({ message: "orders seeded", count: inserted.length });
        setTimeout(() => {
            (0, syncOrders_1.syncOrders)({}, {
                json: (data) => console.log("Auto-sync after seed:", data),
                status: () => ({ json: (data) => console.error("Auto-sync error:", data) })
            });
        }, 5000);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to seed orders", error
        });
    }
});
exports.seedOrders = seedOrders;
