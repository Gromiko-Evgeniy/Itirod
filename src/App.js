import React from 'react'

import DepartmentsContextProvider from './contexts/providers/DepartmentsContextProvider'
import UserContextProvider from "./contexts/providers/UserContextProvider";
import TopicsContextProvider from "./contexts/providers/TopicsContextProvider";
import EventContextProvider from './contexts/providers/EventContextProvider';

import NavigationRoutes from "./components/NavigationRoutes";
import Calendar from "./pages/common/Calendar/Calendar";
import UserMeetups from "./pages/user/UserMeetups";
import AdminMeetups from "./pages/admin/AdminMeetups";
import TopicsDepartments from "./pages/admin/TopicsDepartments";
import Login from './pages/common/Login'

function App() {
  return (
    <EventContextProvider>
      <UserContextProvider>
        <DepartmentsContextProvider>
          <TopicsContextProvider>
            <NavigationRoutes 
              routes = {[
                {path:"/adminMeetups", element:<AdminMeetups/>},
                {path:"/userMeetups", element:<UserMeetups/>},
                {path:"/calendar", element:<Calendar/>},
                {path:"/login", element:<Login/>},
                {path:"/topicsDepartments", element:<TopicsDepartments/>},
              ]}
              defaultRoute='/login' />
          </TopicsContextProvider>
        </DepartmentsContextProvider>
      </UserContextProvider>
    </EventContextProvider>
  );
}

export default App;