"use client";

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

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import { useSelector } from "react-redux";
import EmptyState from "@/components/EmptyState";
import { RootState } from "@/store/store";
import { Role } from "@/enum";

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

function StatisticsVendorClient() {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  if (!authState || loggedUser?.role !== Role.Vendor) {
    return (
      <EmptyState
      // title={t("general.unauthorized")}
      // subtitle={t("general.please-login")}
      />
    );
  }
  return (
    <div className="max-w-[1440px] h-full mx-auto xl:px-20 md:px-2 sm:px-2 px-4">
      <Container>
        <div className="mt-10">
          <Heading
            title="Statistics"
            subtitle="The chart shows statistics from the website"
            start
          />
        </div>
        {/* <Bar options={options} data={data} /> */}
      </Container>
    </div>
  );
}

export default StatisticsVendorClient;
