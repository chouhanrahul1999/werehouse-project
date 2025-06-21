import { useState } from 'react';
import OrderList from './components/OrderList';
import Topbar from './components/Topbar';


function App() {
  const [seedTrigger, setSeedTrigger] = useState(0);

  const handleSeed = () => {
    setSeedTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <Topbar onSeed={handleSeed} />
      <OrderList seedTrigger={seedTrigger} />

    </div>
  );
}

export default App;

