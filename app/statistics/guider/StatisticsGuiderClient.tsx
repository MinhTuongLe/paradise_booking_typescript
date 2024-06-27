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

function StatisticsGuiderClient() {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const chartdata = [
    {
      date: "Jan 22",
      SolarPanels: 2890,
      Inverters: 2338,
    },
    {
      date: "Feb 22",
      SolarPanels: 2756,
      Inverters: 2103,
    },
    {
      date: "Mar 22",
      SolarPanels: 3322,
      Inverters: 2194,
    },
    {
      date: "Apr 22",
      SolarPanels: 3470,
      Inverters: 2108,
    },
    {
      date: "May 22",
      SolarPanels: 3475,
      Inverters: 1812,
    },
    {
      date: "Jun 22",
      SolarPanels: 3129,
      Inverters: 1726,
    },
    {
      date: "Jul 22",
      SolarPanels: 3490,
      Inverters: 1982,
    },
    {
      date: "Aug 22",
      SolarPanels: 2903,
      Inverters: 2012,
    },
    {
      date: "Sep 22",
      SolarPanels: 2643,
      Inverters: 2342,
    },
    {
      date: "Oct 22",
      SolarPanels: 2837,
      Inverters: 2473,
    },
    {
      date: "Nov 22",
      SolarPanels: 2954,
      Inverters: 3848,
    },
    {
      date: "Dec 22",
      SolarPanels: 3239,
      Inverters: 3736,
    },
  ];

  const valueFormatter = function (number: number) {
    return "$ " + new Intl.NumberFormat("us").format(number).toString();
  };

  if (!authState || loggedUser?.role !== Role.Guider) {
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
      </Container>
    </div>
  );
}

export default StatisticsGuiderClient;
