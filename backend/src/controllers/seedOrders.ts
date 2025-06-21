import { Request, Response } from "express";
import OrderModel from "../models/order";
import { syncOrders } from "./syncOrders";

export const seedOrders = async (req: Request, res: Response) => {
  const mockChannels = ["Shopify", "Amazon", "eBay"];

  const mockOrders = Array.from({ length: 10 }).map((_, i) => ({
    orderId: `ORD-${1000 + i}`,
    channel: mockChannels[Math.floor(Math.random() * mockChannels.length)],
    status: "pending",
    lastSyncTime: new Date(),
    errorMessage: "",
  }));

  try {
    await OrderModel.deleteMany(); // clear previous orders (optional)
    const inserted = await OrderModel.insertMany(mockOrders);
    res.json({ message: "orders seeded", count: inserted.length });
    setTimeout(() => {
      syncOrders({} as Request, {
        json: (data: any) => console.log("Auto-sync after seed:", data),
        status: () => ({ json: (data: any) => console.error("Auto-sync error:", data) })
      } as unknown as Response);
    }, 5000);
  } catch (error) {
    res.status(500).json({
       message: "Failed to seed orders", error });
  }
};
