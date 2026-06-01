import type { Metadata } from "next";
import BeansBoard from "../components/BeansBoard";

export const metadata: Metadata = {
  title: "Castro Coffee Company — Coffee Beans",
};

// Right TV — the auto-rotating coffee-beans board.
export default function Page() {
  return <BeansBoard />;
}
