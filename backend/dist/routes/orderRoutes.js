"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seedOrders_1 = require("../controllers/seedOrders");
const getOrders_1 = require("../controllers/getOrders");
const syncOrders_1 = require("../controllers/syncOrders");
const retryOrder_1 = require("../controllers/retryOrder");
const router = express_1.default.Router();
router.get('/', getOrders_1.getOrders);
router.post('/sync', syncOrders_1.syncOrders);
router.post('/retry/:id', retryOrder_1.retryOrder);
router.post('/seed', seedOrders_1.seedOrders);
exports.default = router;
