import './App.css'
import CardView from "@/components/CardView.tsx";
import {Toaster} from "sonner";
import { Routes, Route } from "react-router-dom";
import RedirectHandler from "@/components/RedirectHandler.tsx";




function App() {

  return (
      <Routes>
          {/* Home */}
          <Route path="/" element={
              <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
                  <CardView />
                  <Toaster theme="dark" position="bottom-right"/>
              </div>
          } />
          {/* Catch ALL single-segment paths */}
          <Route path="/:code" element={<RedirectHandler/>} />
      </Routes>

  )
}

export default App
