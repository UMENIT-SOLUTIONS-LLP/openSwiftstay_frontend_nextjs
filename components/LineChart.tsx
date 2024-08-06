import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

export function LineChart({ data, duration = "12Months" }: any) {
  let labels;
  if (duration == "24Hours" && data?.orderData?.length == 24) {
    labels = data?.orderData?.map((order: any) =>
      new Date(order?.name)?.toLocaleString(undefined, {
        hour: "numeric",
        hour12: true,
      })
    );

    //   if (duration == "24Hours") {
    //   labels = data.orderData.map((order: any, index: number) => {
    //   const currentHour = new Date(order.name).getUTCHours();
    //   const formattedHour = currentHour >= 12 ? currentHour - 12 : currentHour;
    //   const period = currentHour >= 12 ? "PM" : "AM";

    //   return `${formattedHour === 0 ? 12 : formattedHour} ${period}`;
    // });
  } else {
    labels = data?.orderData?.map((item: any) => item?.name);
  }
  const counts = data?.orderData?.map((item: any) => item?.count);

  const orderData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "",
        data: counts,
        borderColor: "#021A98",
        tension: 0.8,
        // borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Line height={50} options={options} data={orderData} />;
}
