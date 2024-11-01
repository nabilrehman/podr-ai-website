import VoiceChat from '@/components/VoiceChat';

export default function VoiceChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Voice Chat with AI
        </h1>
        <VoiceChat />
      </div>
    </div>
  );
}