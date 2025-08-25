export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <div>
          <span>Produced by Karin Miyawaki</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Developed by Yuki Itoi</span>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <a 
            href="https://www.yuki-engineer.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer"
          >
            Contact Developer
          </a>
        </div>
      </div>
    </footer>
  );
}