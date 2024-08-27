import { useState, useEffect } from 'react';
import './App.css';
import GenerateMnemonic from './components/GenerateMnemonic';
import ThemeSwitcher from './components/ThemeSwitcher';
import KeyCardContainer from './components/KeyCardContainer';
import ViewAllButton from './components/AllWalletButton';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mnemonic, setMnemonic] = useState("");
  const [allSolWallet, setSolAllWallet] = useState([]);
  const [clicks, setClicks] = useState(0);
  const [solWalletLength, setSolWalletLength] = useState(0);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    try {
      const storedMnemonic = localStorage.getItem('mnemonic');
      if (storedMnemonic) {
        setMnemonic(storedMnemonic);
      }

      const storedWallets = localStorage.getItem('allSolWallet');
      if (storedWallets) {
        setSolAllWallet(JSON.parse(storedWallets));
      }
    } catch (error) {
      console.error("Failed to retrieve or parse localStorage data:", error);
      localStorage.removeItem('allSolWallet'); // Clear corrupt data
    }
  }, []);

  useEffect(() => {
    if (mnemonic) {
      localStorage.setItem('mnemonic', mnemonic);
    }
  }, [mnemonic]);

  useEffect(() => {
    if (allSolWallet.length > 0) {
      localStorage.setItem('allSolWallet', JSON.stringify(allSolWallet));
    } else {
      localStorage.removeItem('allSolWallet'); // Optionally clear if empty
    }
  }, [allSolWallet]);

  useEffect(() => {
    setSolWalletLength(allSolWallet.length);
  }, [allSolWallet]);

  return (
    <div
      className={`${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-200 text-gray-800"
        } min-h-screen transition-colors duration-300`}
    >
      <header className="p-4 flex justify-end">
        <ThemeSwitcher isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </header>
      <main className="p-8 pt-0 flex flex-col items-center">
        <GenerateMnemonic isDarkMode={isDarkMode} setMnemonic={setMnemonic} mnemonic={mnemonic}/>
        <KeyCardContainer
          isDarkMode={isDarkMode}
          mnemonic={mnemonic}
          setClicks={setClicks}
          clicks={clicks}
          allSolWallet={allSolWallet}
          setSolAllWallet={setSolAllWallet}
        />
        <ViewAllButton
          solWalletLength={solWalletLength}
          isDarkMode={isDarkMode}
          allSolWallet={allSolWallet}
        />
      </main>
    </div>
  );
}

export default App;
