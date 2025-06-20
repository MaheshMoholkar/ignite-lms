import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateAnalytics<T extends Document>(
  model: Model<T>
): Promise<MonthData[]> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );

    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    const lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    endDate.setDate(lastDay.getDate());

    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    last12Months.push({ month: monthYear, count });
  }

  return last12Months;
}
