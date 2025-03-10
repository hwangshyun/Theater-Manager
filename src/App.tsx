import DefaultRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ 배경 블러 적용 */}
      <div className="background-container"></div>
      <div className="blur-overlay"></div>

      {/* ✅ 실제 콘텐츠 */}
      <div className="content">
        <DefaultRoutes />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;