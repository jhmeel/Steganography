import { useEffect, lazy, Suspense } from "react";
import { IconCloudOffline16 } from "./assets/icons";
import toast, { useToasterStore } from "react-hot-toast";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header";
import MainLoader from "./components/loaders/mainLoader";
const HomePage = lazy(() => import("./pages/home"));

function App() {
  const { pathname } = useLocation();
  const { toasts } = useToasterStore();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  useEffect(() => {
    if (!navigator.onLine) {
      toast("You are currently offline!", {
        style: {
          backgroundColor: "gray",
          color: "#fff",
        },
        icon: <IconCloudOffline16 />,
      });
    }
  }, [pathname]);
  const TOAST_LIMIT = 1;
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);
  return (
    <>
      <Suspense fallback={<MainLoader />}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
