import { createBrowserRouter } from 'react-router-dom';
import routeMap from '../routeMap/index.tsx';
import App from '../App.tsx';
import Call from '../pages/call/page';
import CompanyReceiveCall from '../pages/entities';
import EntitiesList from '../pages/entities/page';
import Messages from '../pages/messages/page';
import MessageProvider from '../context/MessageContext.jsx';

function ErrorPage() {
  return (
    <h1> Some error occured! </h1>
  );
}

const noneAuthRoutes = [
  {
    name: 'entities',
    path: routeMap.root,
    element: (
      <CompanyReceiveCall />
    ),
    errorElement: <ErrorPage />,
  },
  {
    name: 'entities',
    path: routeMap.entities || routeMap.root,
    element: (
      <CompanyReceiveCall />
    ),
    errorElement: <ErrorPage />,
  },
  {
    name: 'messages',
    path: routeMap.messages,
    element: (
      <MessageProvider>
        <Messages />
      </MessageProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    name: 'entitiesList',
    path: routeMap.entitiesList,
    element: (
      <EntitiesList />
    ),
    errorElement: <ErrorPage />,
  },
  {
    name: 'call',
    path: routeMap.call,
    element: (
      <Call />
    ),
    errorElement: <ErrorPage />,
  },
  {
    name: 'test',
    path: routeMap.test,
    element: (
      <App />
    ),
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter([...noneAuthRoutes]);

export default router;
