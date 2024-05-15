import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StudentEvaluationPage } from "@/content-scripts/features/evaluations/StudentEvaluation.page";
import "bootstrap/dist/css/bootstrap.min.css";
import { appendStylesheet } from "@/content-scripts/links";

const root = document.createElement("div");
root.style.display = "none";
root.id = "myges-content-script-root";

document.body.appendChild(root);

appendStylesheet({
  href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
  id: "material-outlined",
});
const router = createBrowserRouter([
  {
    path: "/teacher/student-evaluation",
    element: <StudentEvaluationPage />,
  },
]);
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
