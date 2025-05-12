import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser"; // Changed import style
import { promisify } from "util";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const readFile = promisify(fs.readFile);

// Interface for the CSV data matching your file structure
interface CsvOrder {
  order_number: string;
  customer_name: string;
  product_name: string;
  product_category: string;
  price: string;
  order_date: string;
}

async function parseCsv(filePath: string): Promise<CsvOrder[]> {
  return new Promise((resolve, reject) => {
    const results: CsvOrder[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

async function createOrdersFromCsv(filePath: string) {
  try {
    const orders = await parseCsv(filePath);
    let createdCount = 0;
    let skippedCount = 0;

    for (const order of orders) {
      try {
        const email = `${order.customer_name.toLowerCase().replace(/\s+/g, ".")}@example.com`;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash("password123", 10);
          user = await prisma.user.create({
            data: {
              email,
              name: order.customer_name,
              password: hashedPassword,
              role: "CUSTOMER",
            },
          });
          console.log(`Created new user: ${email}`);
        }

        const [day, month, year] = order.order_date.split("/");
        const orderDate = new Date(`${year}-${month}-${day}`);

        await prisma.order.create({
          data: {
            productName: order.product_name,
            productCategory: order.product_category,
            price: parseFloat(order.price),
            orderDate: orderDate,
            userId: user.id,
          },
        });
        createdCount++;
      } catch (error) {
        console.error(`Error creating order #${order.order_number}:`, error);
        skippedCount++;
      }
    }

    console.log(
      `Orders creation complete. Created: ${createdCount}, Skipped: ${skippedCount}`
    );
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
}

async function main() {
  const csvFilePath = path.join(__dirname, "MOCK_DATA.csv");
  await createOrdersFromCsv(csvFilePath);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
