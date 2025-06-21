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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/orders', orderRoutes_1.default);
// Connect DB and start server
mongoose_1.default.connect(process.env.MONGO_URI || '')
    .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => console.error(err));
const order_1 = __importDefault(require("./models/order"));
// Auto-retry every 30 seconds
const AUTO_RETRY_INTERVAL = 30 * 1000;
const autoRetryFailedOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const failedOrders = yield order_1.default.find({ status: 'failed' });
        for (const order of failedOrders) {
            const isSuccess = Math.random() > 0.3;
            order.status = isSuccess ? 'success' : 'failed';
            order.lastSyncTime = new Date();
            order.errorMessage = isSuccess ? '' : 'Auto-retry failed';
            yield order.save();
            console.log(`[Auto-Retry] Order ${order.orderId}: ${order.status.toUpperCase()}`);
        }
        if (failedOrders.length) {
            console.log(`[Auto-Retry] Retried ${failedOrders.length} failed orders.`);
        }
    }
    catch (err) {
        console.error('[Auto-Retry] Error during retry:', err);
    }
});
setInterval(autoRetryFailedOrders, AUTO_RETRY_INTERVAL);
