import { Request, Response } from "express";
import OrderModel from "../models/order";

export const syncOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find({ status: "pending" });
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (Math.random() < 0.2) {
          return order;
        }
        const isSuccess = Math.random() > 0.3;
        order.status = isSuccess ? "success" : "failed";
        order.lastSyncTime = new Date();
        order.errorMessage = isSuccess ? "" : "sync failure";
        return await order.save();
      })
    );
    res.json({ message: "Pending orders synced (some left pending)", updated: updatedOrders.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};