import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import AddClientPage from './pages/AddClientPage'
import AddCampaignPage from './pages/AddCampaignPage'
import ActivityPage from './pages/ActivityPage'
import CalendarPage from './pages/CalendarPage'
import AddEventPage from './pages/AddEventPage'
import RemindersPage from './pages/RemindersPage'
import BottomNav from './components/BottomNav'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-svh bg-[#0c0d0f]">
          <div className="flex-1 pb-20">
            <Routes>
              <Route path="/" element={<Navigate to="/clients" replace />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/new" element={<AddClientPage />} />
              <Route path="/clients/:id" element={<ClientDetailPage />} />
              <Route path="/clients/:id/campaign/new" element={<AddCampaignPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/event/new" element={<AddEventPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
