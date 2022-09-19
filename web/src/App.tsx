import { useEffect, useState } from 'react';
import axios from 'axios';

import * as Dialog from '@radix-ui/react-dialog';
import './styles/main.css';
import logoImg from './assets/logo-nlw-esports.svg';
import { GameBanner } from './components/GameBanner';
import { CreateAdBanner } from './components/CreateAdBanner';
import { CreateAdModal } from './components/CreateAdModal';

interface Game { 
  id: string; 
  title: string; 
  bannerUrl: string; 
  _count: {
    ads: number;
  };
}

function App() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios('http://localhost:3333/games').then(res => {
      setGames(res.data);
    })
  }, [])

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-8">  
      <img src={logoImg} alt="Logo" className=' h-32'/>

      <main className='flex flex-col items-center '>
      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className='bg-nlw-gradient bg-clip-text text-transparent'>duo</span> está aqui
      </h1>

        <div className='grid grid-cols-6 gap-6 mt-16'>
          {games.map(game =>
              <GameBanner
                key={game.id}
                title={game.title}
                adsCount={game._count.ads}
                bannerUrl={game.bannerUrl}
              />
          )}
        </div>

        <Dialog.Root>
          <CreateAdBanner />

          <CreateAdModal />
        </Dialog.Root>

      </main>
    </div>  
  )
}

export default App
