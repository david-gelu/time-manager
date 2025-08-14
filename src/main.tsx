import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { createBrowserRouter, RouterProvider } from "react-router"
import App from "./App"
import "./index.css"
import Home from "./components/pages/home"
import Test from "./components/pages/test"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "test", element: <Test /> },
      { path: "profile", element: <div>Profile Page - User settings and information</div> },
      { path: "settings", element: <div>Settings Page - Application configuration</div> },
      { path: "inbox", element: <div>Inbox Page - nothing to see here, yet</div> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)