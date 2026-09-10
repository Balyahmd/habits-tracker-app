import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import TodayPage from "./pages/TodayPage";
import HabitsPage from "./pages/HabitsPage";
import NewHabitPage from "./pages/NewHabitPage";
import HabitDetailPage from "./pages/HabitDetailPage";
import EditHabitPage from "./pages/EditHabitPage";
import StatsPage from "./pages/StatsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TodayPage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="habits/new" element={<NewHabitPage />} />
        <Route path="habits/:id" element={<HabitDetailPage />} />
        <Route path="habits/:id/edit" element={<EditHabitPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
