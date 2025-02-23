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
    <>
      <QueryClientProvider client={queryClient}>
        <DefaultRoutes />
        <Toaster/>
      </QueryClientProvider>
    </>
  );
}

export default App;
