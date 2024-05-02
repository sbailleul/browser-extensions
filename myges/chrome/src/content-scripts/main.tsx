import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StudentEvaluationPage } from "./features/evaluations/StudentEvaluation.page";


const root = document.createElement("div");
root.style.display = "none";
root.id = "myges-content-script-root";

document.body.appendChild(root);

const router = createBrowserRouter([
  {
    path: "/teacher/student-evaluation",
    element: <StudentEvaluationPage/>,

  },
]);
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

