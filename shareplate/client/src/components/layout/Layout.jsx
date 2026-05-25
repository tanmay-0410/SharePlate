import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from '@/components/chat/ChatBot';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import CustomCursor from '@/components/ui/CustomCursor';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <CustomCursor />
        <Navbar />
        <main className="flex-1">{children}</main>
        <ChatBot />
        <Footer />
      </div>
    </div>
  );
}
