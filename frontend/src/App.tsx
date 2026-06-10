import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        <Route path="/" element={<div className="flex items-center justify-center h-screen">
          <h1 className="text-4xl font-bold text-white">Veil</h1>
        </div>} />
        <Route path="/dashboard/*" element={<div>Dashboard</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/signup" element={<div>Sign Up</div>} />
      </Routes>
    </div>
  );
}

export default App;