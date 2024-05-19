import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Routing related
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Admin from './routes/Admin'
import Forms, { loader as rootLoader } from './routes/Forms'
import NewForm from './routes/NewForm'
import Welcome from './routes/Welcome'
import Patient from './routes/Patient'
import AnswerForm from './routes/AnswerForm'
import GenerateQR from './routes/GenerateQR'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Patient />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: '/generate',
        element: <GenerateQR />,
      },
      {
        path: ':code',
        element: <AnswerForm />,
      },
    ],
  },
  {
    path: '/admin',
    errorElement: <div>An error has occurred!</div>, // TODO: Style this
    element: <Admin />,
    children: [
      {
        index: true,
        element: <Forms />,
        loader: rootLoader,
      },
      {
        path: 'form/new',
        element: <NewForm />,
      },
    ],
  },
])

// biome-ignore lint/style/noNonNullAssertion: Autogenerated by Vite
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
