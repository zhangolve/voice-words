"use client";
import { BarChart } from "@mui/x-charts/BarChart";
import useSWR from "swr";
import { fetcher } from "../utils";

const chartSetting = {
  xAxis: [
    {
      label: "Count (mm)",
    },
  ],
  width: 500,
  height: 400,
};

const valueFormatter = (value) => {
  console.log(value);
  return `${value}`;
};

export default function HorizontalBars() {
  const { data, error, isLoading } = useSWR(
    { url: `/api/word/statistics` },
    fetcher,
  );
  if (isLoading) {
    return <div>loading</div>;
  }
  const total = data.result.reduce((acc, { count }) => acc + count, 0);
  return (
    <>
      <BarChart
        dataset={data.result}
        yAxis={[{ scaleType: "band", dataKey: "period" }]}
        series={[{ dataKey: "count", label: "how many", valueFormatter }]}
        layout="horizontal"
        {...chartSetting}
      />
      <div className="text-black text-lg ">Total: {total}</div>
    </>
  );
}

// const Collection = ()=> {
//     return (
//       <div>
//         <h1>Search</h1>
//       </div>
//     );
//   }

//   export default Collection;
