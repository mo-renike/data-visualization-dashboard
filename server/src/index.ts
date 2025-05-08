import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import csv from "csv-parser";

import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";
import statsRoutes from "./routes/stats";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

const importMockData = async () => {
  try {
    const orderCount = await prisma.order.count();
    if (orderCount > 0) {
      console.log("Database already has orders, skipping import");
      return;
    }

    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: "admin@example.com",
          name: "Admin User",
          password: await bcrypt.hash("admin123", 10),
          role: "admin",
        },
      });
      console.log("Admin user created");
    }

    // Download and process the CSV file
    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mock%20order%20data%20-%20MOCK_DATA-tPaLKvsTfiWyHypgTwwYUo9lXVvU8Z.csv";
    const response = await fetch(csvUrl);
    const csvData = await response.text();

    // Write to a temporary file
    const tempFilePath = path.join(__dirname, "temp_mock_data.csv");
    fs.writeFileSync(tempFilePath, csvData);

    // Process the CSV file
    const results: any[] = [];

    fs.createReadStream(tempFilePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // Create a test customer if it doesn't exist
        const customerExists = await prisma.user.findUnique({
          where: { email: "customer@example.com" },
        });

        let customerId;
        if (!customerExists) {
          const customer = await prisma.user.create({
            data: {
              email: "customer@example.com",
              name: "Test Customer",
              password: await bcrypt.hash("customer123", 10),
              role: "customer",
            },
          });
          customerId = customer.id;
          console.log("Test customer created");
        } else {
          customerId = customerExists.id;
        }

        // Import orders
        for (const row of results) {
          await prisma.order.create({
            data: {
              orderNumber: row.order_number,
              productName: row.product_name,
              productCategory: row.product_category,
              price: Number.parseFloat(row.price),
              orderDate: new Date(
                row.order_date.split("/").reverse().join("-")
              ),
              userId: customerId,
            },
          });
        }

        console.log(`Imported ${results.length} orders from CSV`);

        // Clean up temp file
        fs.unlinkSync(tempFilePath);
      });
  } catch (error) {
    console.error("Error importing mock data:", error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await importMockData();
});
