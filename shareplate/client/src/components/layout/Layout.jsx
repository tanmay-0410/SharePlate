import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from '@/components/chat/ChatBot';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <ChatBot />
      <Footer />
    </div>
  );
}
