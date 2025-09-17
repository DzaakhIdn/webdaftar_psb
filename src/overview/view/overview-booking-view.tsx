"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

import { DashboardContent } from "@/layout/dashboard/content";
import {
  _bookings,
  _bookingNew,
  _bookingReview,
  _bookingsOverview,
} from "@/_mock";

import { BookingBooked } from "../booking-booked";
import { BookingDetails } from "../booking-details";
import { BookingAvailable } from "../booking-available";
import { BookingStatistics } from "../booking-statistics";
import { BookingTotalIncomes } from "../booking-total-incomes";
import { BookingWidgetSummary } from "../booking-widget-summary";
import { BookingCheckInWidgets } from "../booking-check-in-widgets";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

const ICON = {
  totalPendaftar: (
    <Iconify
      icon="solar:users-group-rounded-bold-duotone"
      width={48}
      height={48}
      color="primary.main"
    />
  ),
  diterima: (
    <Iconify
      icon="solar:check-read-bold-duotone"
      width={48}
      height={48}
      color="success.main"
    />
  ),
  pending: (
    <Iconify
      icon="solar:clock-circle-bold-duotone"
      width={48}
      height={48}
      color="warning.main"
    />
  ),
};

export function OverviewBookingView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Total Pendaftar"
            percent={2.6}
            total={714000}
            icon={ICON.totalPendaftar}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Diterima"
            percent={0.2}
            total={311000}
            icon={ICON.diterima}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Pending"
            percent={-0.1}
            total={124000}
            icon={ICON.pending}
          />
        </Grid>

        <Grid container size={12}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Box
              sx={{
                mb: 3,
                p: { md: 1 },
                display: "flex",
                gap: { xs: 3, md: 1 },
                borderRadius: { md: 2 },
                flexDirection: "column",
                bgcolor: { md: "background.neutral" },
              }}
            >
              <Box
                sx={{
                  p: { md: 1 },
                  display: "grid",
                  gap: { xs: 3, md: 0 },
                  borderRadius: { md: 2 },
                  bgcolor: { md: "background.paper" },
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                  },
                }}
              >
                <BookingTotalIncomes
                  sx={{ boxShadow: { md: "none" } }}
                  title="Total Pembayaran (IDR)"
                  total={18765}
                  percent={2.6}
                  chart={{
                    categories: [
                      "Senin",
                      "Selasa",
                      "Rabu",
                      "Kamis",
                      "Jumat",
                      "Sabtu",
                      "Minggu",
                    ],
                    series: [10, 41, 35, 51, 49, 62],
                  }}
                />

                <BookingBooked
                  subheader="Ringkasan Statistik Pembayaran"
                  title="Pembayaran"
                  data={_bookingsOverview}
                  sx={{ boxShadow: { md: "none" } }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
              <BookingAvailable
                sx={{ boxShadow: { md: "none" } }}
                subheader="Ringkasan Statistik Pendaftar"
                title="Kuota Tersedia"
                chart={{
                  series: [
                    { label: "Sold out", value: 120 },
                    { label: "Available", value: 66 },
                  ],
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid size={12}>
          <BookingStatistics
            subheader="Statistics"
            title="Statistics"
            chart={{
              series: [
                {
                  name: "Weekly",
                  categories: [
                    "Week 1",
                    "Week 2",
                    "Week 3",
                    "Week 4",
                    "Week 5",
                  ],
                  data: [
                    { name: "Sold", value: [20, 56, 77, 88, 99] },
                    { name: "Canceled", value: [20, 56, 77, 88, 99] },
                  ],
                },
                {
                  name: "Monthly",
                  categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                  ],
                  data: [
                    {
                      name: "Sold",
                      value: [83, 112, 119, 88, 103, 112, 114, 108, 93],
                    },
                    {
                      name: "Canceled",
                      value: [46, 46, 43, 58, 40, 59, 54, 42, 51],
                    },
                  ],
                },
                {
                  name: "Yearly",
                  categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
                  data: [
                    { name: "Sold", value: [76, 42, 29, 41, 27, 96] },
                    { name: "Canceled", value: [46, 44, 24, 43, 44, 43] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={12}>
          <BookingDetails
            subheader="Last 7 days"
            title="Booking details"
            tableData={_bookings}
            headCells={[
              { id: "destination", label: "Destination" },
              { id: "customer", label: "Customer" },
              { id: "checkIn", label: "Check in" },
              { id: "checkOut", label: "Check out" },
              { id: "status", label: "Status" },
              { id: " ", label: "" },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
