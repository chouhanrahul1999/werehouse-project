import { Request, Response } from "express";
import OrderModel from "../models/order";

export const retryOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    const isSuccess = Math.random() > 0.5;
    order.status = isSuccess ? "success" : "failed";
    order.lastSyncTime = new Date();
    order.errorMessage = isSuccess ? "" : "    res.json(order);retry failure";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};