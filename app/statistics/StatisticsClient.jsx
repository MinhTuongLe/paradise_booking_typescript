"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import EmptyState from "@/components/EmptyState";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map((value, index) => (index + 1) * 1000),
      backgroundColor: "rgb(244, 63, 94)",
    },
    {
      label: "Dataset 2",
      data: labels.map((value, index) => (index + 1) * 1000),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

function StatisticsClient() {
  const loggedUser = useSelector((state) => state.authSlice.loggedUser);
  const authState = useSelector((state) => state.authSlice.authState);

  if (!authState || loggedUser.role !== 2) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }
  return (
    <div className="max-w-[1440px] h-full mx-auto xl:px-20 md:px-2 sm:px-2 px-4">
      <Container>
        <div className="mt-10">
          <Heading
            ce
            title="Statistics"
            subtitle="The chart shows statistics from the website"
          />
        </div>
        <Bar options={options} data={data} />
      </Container>
    </div>
  );
}

export default StatisticsClient;
