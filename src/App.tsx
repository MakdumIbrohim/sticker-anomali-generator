import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function App() {
  const [words, setWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Jika ada spasi, pisahkan kata dan masukkan ke dalam list words
    if (value.includes(' ')) {
      const parts = value.split(' ');
      const newWords = parts.slice(0, -1).filter((w) => w.trim() !== '');
      if (newWords.length > 0) {
        setWords([...words, ...newWords]);
      }
      // Sisa karakter setelah spasi terakhir menjadi inputValue baru
      setInputValue(parts[parts.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        setWords([...words, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleDownload = useCallback(() => {
    if (stickerRef.current === null) {
      return;
    }

    // Capture the sticker as PNG
    toPng(stickerRef.current, { cacheBust: true })
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

  // Teks gabungan dari words dan input yang sedang diketik
  const displayText = [...words, inputValue].filter(Boolean).join(' ');

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
              Ketik kata dan tekan spasi. Teks akan otomatis terangkai.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ketik di sini (otomatis terpisah spasi)..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-neutral-600 text-lg"
            />
          </div>

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
                {displayText}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
