import { useState } from "react";
import "./App.css";
import Topbar from "./components/Topbar";
import EarthMapper from "./components/EarthMapper";
function App() {
  const [searchaddress,setsearchaddress]=useState();
  const [minMag, setMinMag] = useState("");
  const [maxMag, setMaxMag] = useState("");
  const safeMinMag = minMag === "" ? 0 : parseFloat(minMag);
  const safeMaxMag = maxMag === "" ? 10 : parseFloat(maxMag);
  const [mode,setmode]=useState(true);
  console.log(mode)
  return (
    <div className="grid grid-rows-[10%_90%] h-screen">
      <Topbar searchaddress={searchaddress} setsearchaddress={setsearchaddress} minMag={safeMinMag} maxMag={safeMaxMag} setMinMag={setMinMag} setMaxMag={setMaxMag} mode={mode} setmode={setmode}/>
      <EarthMapper searchaddress={searchaddress} mode={mode} zoom={6} minMag={safeMinMag} maxMag={safeMaxMag}/>
    </div>
  );
}

export default App;
