import type { Metadata } from "next";
import CoffeeBoard from "./components/CoffeeBoard";

export const metadata: Metadata = {
  title: "Castro Coffee Company — Drinks Menu",
};

// Left TV — the drinks board.
export default function Page() {
  return <CoffeeBoard />;
}
