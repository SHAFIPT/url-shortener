// App.tsx
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            "bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-lg border dark:border-gray-700",
          duration: 4000,
          style: {
            padding: "12px 16px",
            borderRadius: "10px",
          },
        }}
      />
    </BrowserRouter>
  );
}
