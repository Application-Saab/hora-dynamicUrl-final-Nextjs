
import { useRouter } from "next/router";

import HomeContent from "@/components/HomeContent";

export default function LocalityPage() {
  const router = useRouter();

  return <HomeContent />;
}
