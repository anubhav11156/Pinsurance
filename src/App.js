import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import ScrollToTop from "react-scroll-to-top";


function App() {
  return (
    <div className="App">
      <ScrollToTop className="scrollToTop" smooth color="black" />
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
