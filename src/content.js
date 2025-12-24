import { Calendar, Coffee, Music, Smile } from 'lucide-react';

// Perhatikan "export const" bukan "export default"
export const contentData = [
  {
    type: 'opening',
    text: "Hai Kamu...",
    subText: "Nyalain suaranya ya, ada pesan buat kamu.",
    color: "#2E2E2E"
  },
  {
    type: 'stat',
    icon: Calendar,
    label: "Sudah Lewat",
    value: "100 Hari",
    description: "Sejak kita putus kontak.",
    color: "#1DB954"
  },
  {
    type: 'music',
    title: "Lagu Favoritmu",
    artist: "Daniel Caesar",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    caption: "Tiap denger ini keinget kamu.",
    color: "#535353"
  },
  {
    type: 'final',
    title: "2025 Is Coming",
    text: "Maukah kita coba lagi?",
    whatsappNumber: "6281234567890",
    color: "#000000"
  }
];