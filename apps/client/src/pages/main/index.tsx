import Card from "./components/card";
import Navbar from "./components/navbar";

const Main = () => {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-3 gap-4 p-8">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Main;
