import { generateDebugLog } from '@/utils/debugLog';

export default function DebugCopyButton() {
  return (
    <button
      onClick={generateDebugLog}
      className="fixed bottom-20 right-4 z-[2000] 
                 bg-green-600 text-white text-sm 
                 px-3 py-2 rounded-full shadow-md 
                 hover:bg-green-700 active:scale-95"
      title="Copy Debug Log"
    >
      📋
    </button>
  );
}
