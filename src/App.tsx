import { useState, useEffect, useRef } from 'react';
import './App.css'; // Pastikan kita pakai CSS yang sama

// Data Katalog Drama Update Terbaru (Diambil dari penemuan JSON-mu)
const katalogDrama = [
  { bookId: "7602908037468146693", judul: "Istriku Multitalenta", cover: "https://p19-novel-sign-sg.fizzopic.org/novel-images-sg/d61e0868a52eae766ce4cd0be4d7ae1f~tplv-resize:570:810.heic?rk3s=95ec04ee&x-expires=1772669746&x-signature=DsypsOkpDvu1TvIk6CLEslvg864%3D", ep: "75 EP", desc: "Ayu menemukan Angga yang terluka parah di desa. Setelah operasi..." },
  { bookId: "7603616055197453317", judul: "Putra Terbuang Jadi Pahlawan", cover: "https://p19-novel-sign-sg.fizzopic.org/novel-images-sg/03def24687aa8e549f0f6ff1dac08e41~tplv-resize:570:810.heic?rk3s=95ec04ee&x-expires=1772669746&x-signature=sXWZKZu0rjpklbezMNhD2CIhUEI%3D", ep: "80 EP", desc: "Jorda menembus waktu dan menjadi putra Keluarga Lintara yang diusir..." },
  { bookId: "7602855039975033861", judul: "Suamiku Bisa Dengar Isi Hatiku", cover: "https://p16-novel-sign-sg.fizzopic.org/novel-images-sg/93a91bb1c7ce79350d19b48091540b86~tplv-resize:570:810.heic?rk3s=95ec04ee&x-expires=1772669746&x-signature=O%2BrcOstppjjjyxvK25kN3WexeUI%3D", ep: "81 EP", desc: "Putri Ayu bereinkarnasi menjadi istri buangan keluarga kaya..." },
  { bookId: "7600002690927578117", judul: "Ayah Super Keluarga Bahagia", cover: "https://p16-novel-sign-sg.fizzopic.org/novel-images-sg/e35235ee9820ca8d8e0852bf71b5615e~tplv-resize:570:810.heic?rk3s=95ec04ee&x-expires=1772669746&x-signature=u6BP%2FNXXIMKc%2Ffh7lh8dGAoT6gE%3D", ep: "82 EP", desc: "Rizky Pratama tiba-tiba menjadi ayah super setelah Putri Ayu hamil..." },
  { bookId: "41000104882", judul: "Gadis Lugu Penakluk Raja Mafia", cover: "https://hwztchapter.dramaboxdb.com/data/cppartner/4x1/41x0/410x0/41000104882/41000104882.jpg", ep: "61 EP", desc: "Setelah diculik oleh raja mafia, Bella yang polos dipaksa untuk..." }
];

export default function App() {
  const [activeDrama, setActiveDrama] = useState(katalogDrama[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusAPI, setStatusAPI] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // EFEK SCROLL NAVBAR
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FUNGSI PLAY & MENGHUBUNGI BACKEND API VERCEL
  const handlePlay = async () => {
    setIsModalOpen(true);
    setVideoUrl(''); // Kosongkan video lama
    setStatusAPI('⏳ Menembus Server DramaBox lewat API Backend...');

    try {
      // Memanggil File api/get-video.js yang kita buat tadi!
      const response = await fetch(`/api/get-video?bookId=${activeDrama.bookId}&episode=1`);
      const data = await response.json();

      if (data.success && data.videoUrl) {
        setStatusAPI('✅ Berhasil! Mengambil Link MP4 VIP...');
        setVideoUrl(data.videoUrl); // Masukkan link VIP ke Player
        setTimeout(() => setStatusAPI(''), 1500);
      } else {
        throw new Error(data.error || "Gagal mendapatkan link");
      }
    } catch (error: any) {
      setStatusAPI(`⚠️ Error: ${error.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVideoUrl('');
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="logo">Nonton <span>Yuk</span></div>
          <span style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 600, letterSpacing: '1px', marginTop: '-3px' }}>by : Smart</span>
        </div>
        <ul className="nav-links">
          <li><a href="#">Beranda</a></li>
          <li><a href="#">Trending</a></li>
          <li><a href="#">Rilis Baru</a></li>
        </ul>
      </nav>

      {/* HERO BANNER */}
      <div className="hero" style={{ backgroundImage: `url('${activeDrama.cover}')` }}>
        <div className="hero-content">
          <div className="tags">
            <span className="tag hot">🔥 #1 Trending</span>
            <span className="tag">{activeDrama.ep}</span>
          </div>
          <h1>{activeDrama.judul}</h1>
          <p>{activeDrama.desc}</p>
          <button className="btn-play" onClick={handlePlay}>
            ▶ Play Now
          </button>
        </div>
      </div>

      {/* KATALOG DRAMA */}
      <div className="row">
        <div className="row-header"><h2>Drama Pilihan VIP</h2></div>
        <div className="slider">
          {katalogDrama.map((drama, idx) => (
            <div key={idx} className="card" onClick={() => setActiveDrama(drama)}>
              <div className="card-img-wrapper">
                <img src={drama.cover} alt={drama.judul} />
                <div className="ep-badge">{drama.ep}</div>
              </div>
              <p className="card-title">{drama.judul}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VIDEO PLAYER */}
      {isModalOpen && (
        <div className="modal active">
          <div style={{ position: 'relative', width: '90%', maxWidth: '1000px' }}>
            <span className="close-btn" onClick={closeModal}>✖</span>
            <div className="modal-content">
              {statusAPI && <div className="status-api">{statusAPI}</div>}
              {videoUrl && (
                <video ref={videoRef} controls autoPlay style={{ width: '100%', maxHeight: '75vh', display: 'block' }}>
                  <source src={videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
