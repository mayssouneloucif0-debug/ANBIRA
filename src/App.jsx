import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/home/Home";
import Collection from "./pages/collection/Collection";
import ProductDetails from "./pages/product/ProductDetails";

import Tailoring from "./pages/tailoring/Tailoring";
import SinglePiece from "./pages/tailoring/singlePiece/SinglePiece";
import Wholesale from "./pages/tailoring/wholesale/Wholesale";

import Jobs from "./pages/jobs/Jobs";
import JobApplication from "./pages/jobs/JobApplication";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";

import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerProducts from "./pages/manager/ManagerProducts";
import ManagerProductForm from "./pages/manager/ManagerProductForm";
import ManagerProductOrders from "./pages/manager/ManagerProductOrders";
import ManagerTailoringOrders from "./pages/manager/ManagerTailoringOrders";
import ManagerWholesaleOrders from "./pages/manager/ManagerWholesaleOrders";
import ManagerJobs from "./pages/manager/ManagerJobs";
import ManagerJobForm from "./pages/manager/ManagerJobForm";
import ManagerJobApplications from "./pages/manager/ManagerJobApplications";

import ProtectedManagerRoute from "./pages/manager/ProtectedManagerRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/collection"
          element={<Collection />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/tailoring"
          element={<Tailoring />}
        />

        <Route
          path="/tailoring/single-piece"
          element={<SinglePiece />}
        />

        <Route
          path="/tailoring/wholesale"
          element={<Wholesale />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/apply/:id"
          element={<JobApplication />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/manager/login"
          element={<ManagerLogin />}
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedManagerRoute>
              <ManagerDashboard />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/products"
          element={
            <ProtectedManagerRoute>
              <ManagerProducts />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/products/new"
          element={
            <ProtectedManagerRoute>
              <ManagerProductForm />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/products/edit/:id"
          element={
            <ProtectedManagerRoute>
              <ManagerProductForm />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/product-orders"
          element={
            <ProtectedManagerRoute>
              <ManagerProductOrders />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/tailoring-orders"
          element={
            <ProtectedManagerRoute>
              <ManagerTailoringOrders />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/wholesale-orders"
          element={
            <ProtectedManagerRoute>
              <ManagerWholesaleOrders />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/jobs"
          element={
            <ProtectedManagerRoute>
              <ManagerJobs />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/jobs/new"
          element={
            <ProtectedManagerRoute>
              <ManagerJobForm />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="/manager/job-applications"
          element={
            <ProtectedManagerRoute>
              <ManagerJobApplications />
            </ProtectedManagerRoute>
          }
        />

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              Page Not Found
            </div>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;