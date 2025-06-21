import { Request, Response } from "express";
import OrderModel from "../models/order";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (e) {
    res.status(500).json({
       message: "Server error", error: e });
  }
};
