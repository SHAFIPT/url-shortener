import { getClicksOverTimeApi } from "@/lib/url/api";
import { useQuery } from "@tanstack/react-query";

export const useClicksOverTime = (days = 30) =>
  useQuery({
    queryKey: ["analytics", "clicksOverTime", days],
    queryFn: () => getClicksOverTimeApi(days),
  });
