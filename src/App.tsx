import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function App() {
  const [words, setWords] = useState<string[]>(['ANOMALI', 'ITU', 'NYATA']);
  const [inputValue, setInputValue] = useState('');
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setWords([...words, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleDownload = useCallback(() => {
    if (stickerRef.current === null) {
      return;
    }

    // Capture the sticker as PNG with a transparent background
    toPng(stickerRef.current, { cacheBust: true, backgroundColor: 'rgba(0,0,0,0)' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'sticker-anomali.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  }, [stickerRef]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Control Panel */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
              Sticker Anomali Generator
            </h1>
            <p className="text-neutral-400 text-sm">
              Buat stiker WhatsApp keren dengan gaya teks per kata.
            </p>
          </div>

          <form onSubmit={handleAddWord} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Masukkan kata..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-neutral-600"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold p-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </form>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              Daftar Kata (Klik untuk hapus)
            </h3>
            <div className="flex flex-wrap gap-2">
              {words.length === 0 ? (
                <span className="text-neutral-600 text-sm italic">Belum ada kata ditambahkan.</span>
              ) : (
                words.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleRemoveWord(index)}
                    className="group flex items-center gap-1 bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 border border-neutral-700 px-3 py-1.5 rounded-md transition-all text-sm font-medium"
                    title="Hapus kata"
                  >
                    {word}
                    <Trash2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={words.length === 0}
            className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            <Download size={20} />
            Download Sticker
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center aspect-square relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-bold text-neutral-700 uppercase tracking-widest z-0">
            Preview Layout
          </div>
          
          {/* Transparency checkerboard background pattern */}
          <div className="absolute inset-0 opacity-10 z-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #404040 25%, transparent 25%, transparent 75%, #404040 75%, #404040), repeating-linear-gradient(45deg, #404040 25%, transparent 25%, transparent 75%, #404040 75%, #404040)',
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }}></div>

          {/* Actual Sticker Canvas (What gets downloaded) */}
          <div 
            ref={stickerRef}
            className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-white p-8"
            style={{ width: '512px', height: '512px', transform: 'scale(0.8)' }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-black font-sans text-5xl leading-[1.2] text-left break-words w-full" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {words.join(' ')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
