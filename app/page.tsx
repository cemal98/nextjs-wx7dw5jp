'use client'
import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Home, Search, PlusSquare, User, Bell, X, Eye, EyeOff } from 'lucide-react';

interface Notification {
  id: number;
  type: 'bad' | 'good';
  sender: string;
  avatar: string;
  message: string;
  blurredText?: string;
  correctAction: string;
  isBlurred: boolean;
  timestamp: string;
}

interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

const InstagramSafetySimulator = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [revealedNotifications, setRevealedNotifications] = useState<Set<number>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);

  // Mock data
  const posts = [
    { id: 1, username: "okul_arkadasim", avatar: "👦", image: "🎨", caption: "Bugün resim dersinde çok güzel bir tablo yaptım!", likes: 15, time: "2 saat önce" },
    { id: 2, username: "sevgili_ogretmenim", avatar: "👩‍🏫", image: "📚", caption: "Yarınki sınavı unutmayın çocuklar! 💪", likes: 23, time: "4 saat önce" },
    { id: 3, username: "aile_dostumuz", avatar: "👨", image: "🏠", caption: "Bahçede güzel çiçekler açmış", likes: 8, time: "6 saat önce" }
  ];

  // Senaryo mesajları
  const scenarios = [
    { type: 'bad' as const, sender: 'stranger_user', avatar: '😷', message: 'Merhaba, çok güzelsin. Fotoğraflarını gönderebilir misin?', blurredText: 'KÖTÜ İÇERİKLİ MESAJ', correctAction: 'reject' },
    { type: 'good' as const, sender: 'okul_arkadasim', avatar: '👦', message: 'Merhaba! Yarın okulda matematik sınavı var, birlikte çalışalım mı?', correctAction: 'accept' },
    { type: 'bad' as const, sender: 'unknown_person', avatar: '🚫', message: 'Bana adresini verirsen sana hediye göndereceğim. Kimseye söyleme.', blurredText: 'KÖTÜ İÇERİKLİ MESAJ', correctAction: 'reject' },
    { type: 'good' as const, sender: 'sevgili_ogretmenim', avatar: '👩‍🏫', message: 'Merhaba, yarınki gezi için veli izin belgeni getirmeyi unutma.', correctAction: 'accept' }
  ];

  const startSimulation = (): void => {
    setGameStarted(true);
    setCurrentScenario(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setNotifications([]);
    setRevealedNotifications(new Set());
    setShowSuccessMessage(false);
    setFeedbackMessage(null);
    sendMessage(0);
  };

  const sendMessage = (scenarioIndex: number): void => {
    if (scenarioIndex >= scenarios.length) {
      setShowSuccessMessage(true);
      return;
    }

    const scenario = scenarios[scenarioIndex];
    const newNotification: Notification = {
      id: Date.now(),
      ...scenario,
      isBlurred: scenario.type === 'bad',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setTimeout(() => {
      setNotifications(prev => [newNotification, ...prev]);
    }, 1500);
  };
  
  const handleMessageAction = (notificationId: number, action: string): void => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    if (action === 'view' || action === 'hide') {
        setRevealedNotifications(prev => {
            const newSet = new Set(prev);
            if (action === 'view') {
                newSet.add(notificationId);
            } else {
                newSet.delete(notificationId);
            }
            return newSet;
        });
        return;
    }

    const isCorrectChoice = 
      (notification.type === 'bad' && action === 'reject') ||
      (notification.type === 'good' && action === 'accept');

    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setRevealedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
    });

    if (isCorrectChoice) {
      setCorrectAnswers(prev => prev + 1);
      
      const message: FeedbackMessage = notification.type === 'bad' ? 
        { type: 'success', text: '✅ Çok iyi! Tanımadığın kişilerden gelen kötü mesajları reddettin. Bu güvenliğin için en doğrusu!' } :
        { type: 'success', text: '✅ Harika! Tanıdığın kişilerden gelen güvenli mesajları kabul etmek arkadaşlıkların için güzel!' };
      
      setFeedbackMessage(message);
      
      setTimeout(() => {
        setFeedbackMessage(null);
        proceedToNextScenario();
      }, 2500);
    } else {
      setWrongAnswers(prev => prev + 1);
      
      const message: FeedbackMessage = notification.type === 'bad' ? 
        { type: 'error', text: '⚠️ Dikkat! Bu mesaj kötü niyetliydi. Kişisel bilgilerini isteyen veya seni rahatsız eden mesajları her zaman reddetmelisin.' } :
        { type: 'error', text: '⚠️ Bu güvenli bir mesajdı. Okul arkadaşın veya öğretmeninden gelen normal mesajları kabul edebilirsin. Endişelenmene gerek yok!' };
      
      setFeedbackMessage(message);
      
      setTimeout(() => {
        setFeedbackMessage(null);
        proceedToNextScenario();
      }, 3000);
    }
  };
  
  const proceedToNextScenario = (): void => {
    const nextScenarioIndex = currentScenario + 1;
    setCurrentScenario(nextScenarioIndex);

    if (nextScenarioIndex < scenarios.length) {
      sendMessage(nextScenarioIndex);
    } else {
       setTimeout(() => setShowSuccessMessage(true), 1000);
    }
  };

  const restartSimulation = (): void => {
    startSimulation();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Instasafe
        </h1>
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-md mx-auto">
        {!gameStarted ? (
          /* Başlangıç Ekranı */
          <div className="p-6 text-center mt-8">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Güvenli İnternet Simülatörü</h2>
            <p className="text-gray-600 leading-relaxed">Bu simülasyon, internette karşılaşabileceğin iyi ve kötü mesajları ayırt etmene yardımcı olacak.</p>
            <div className="bg-blue-50 p-4 rounded-lg my-6 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">📚 Öğrenilecekler:</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Kötü niyetli mesajları tanımak</li>
                <li>Kişisel bilgileri korumak</li>
                <li>Güvenli mesajları ayırt etmek</li>
                <li>Zorbalığa karşı durmak</li>
              </ul>
            </div>
            <button
              onClick={startSimulation}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🚀 Simülasyonu Başlat
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar - Sticky */}
            <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-40">
              <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">İlerleme: {currentScenario} / {scenarios.length}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(currentScenario / scenarios.length) * 100}%` }}
                  ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="font-semibold text-green-600">✅ Doğru: {correctAnswers}</span>
                <span className="font-semibold text-red-600">❌ Yanlış: {wrongAnswers}</span>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-1 pb-20">
              {posts.map(post => (
                <div key={post.id} className="bg-white border-b">
                  <div className="flex items-center p-3">
                    <div className="text-3xl mr-3">{post.avatar}</div>
                    <h3 className="font-semibold text-sm">{post.username}</h3>
                  </div>
                  <div className="aspect-square bg-gray-100 flex items-center justify-center text-8xl">{post.image}</div>
                  <div className="p-3">
                    <div className="flex space-x-4 mb-2">
                      <Heart className="w-6 h-6" /> <MessageCircle className="w-6 h-6" /> <Send className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-sm mb-1">{post.likes} beğeni</p>
                    <p className="text-sm">
                      <span className="font-semibold">{post.username}</span> {post.caption}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{post.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Notification Popups */}
      {notifications.map(notification => {
        const isRevealed = revealedNotifications.has(notification.id);
        return (
          <div
            key={notification.id}
            className="fixed top-20 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-50"
            style={{
              animation: 'slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both'
            }}
          >
            <div className="flex items-start space-x-3">
              <div className="text-3xl">{notification.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{notification.sender}</h4>
                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                </div>
                
                <div className="mb-3">
                  {notification.isBlurred && !isRevealed ? (
                    <div className="text-center py-3 bg-red-50 rounded border-2 border-dashed border-red-200">
                      <div className="text-red-600 font-bold text-lg">⚠️</div>
                      <div className="text-red-700 font-semibold text-sm">{notification.blurredText}</div>
                      <div className="text-xs text-red-600 mt-1">Bu mesaj uygunsuz olabilir.</div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800 bg-gray-100 p-2 rounded">{notification.message}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  {notification.type === 'bad' ? (
                    <>
                      {isRevealed ? (
                         <button onClick={() => handleMessageAction(notification.id, 'hide')} className="flex-1 bg-gray-400 text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-1 hover:bg-gray-500">
                           <EyeOff className="w-3.5 h-3.5" /> <span>Gizle</span>
                         </button>
                      ) : (
                         <button onClick={() => handleMessageAction(notification.id, 'view')} className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-1 hover:bg-yellow-600">
                           <Eye className="w-3.5 h-3.5" /> <span>Gör</span>
                         </button>
                      )}
                      <button onClick={() => handleMessageAction(notification.id, 'reject')} className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-1 hover:bg-red-700">
                        <X className="w-3.5 h-3.5" /> <span>Reddet</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleMessageAction(notification.id, 'accept')} className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-xs font-semibold hover:bg-green-600">✅ Kabul Et</button>
                      <button onClick={() => handleMessageAction(notification.id, 'reject')} className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-xs font-semibold hover:bg-gray-600">❌ Reddet</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Feedback Message */}
      {feedbackMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[70]" style={{
          animation: 'slideUp 0.3s ease-out both'
        }}>
          <div className={`
            px-6 py-4 rounded-lg shadow-xl border-2 max-w-sm mx-4 text-center
            ${feedbackMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'}
          `}>
            <p className="font-medium text-sm leading-relaxed">
              {feedbackMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center transform transition-all scale-100 opacity-100">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Tebrikler, Simülasyon Bitti!</h2>
            <p className="text-gray-700 mb-2">Artık internette daha güvendesin!</p>
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
                <p className="font-semibold">Sonuçların:</p>
                <p className="text-green-600">✅ {correctAnswers} doğru cevap</p>
                <p className="text-red-600">❌ {wrongAnswers} yanlış deneme</p>
            </div>
            <button
              onClick={restartSimulation}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              🔄 Tekrar Başla
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {gameStarted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 max-w-md mx-auto">
          <div className="flex justify-around py-3">
            <Home className="w-7 h-7 text-black" />
            <Search className="w-7 h-7 text-gray-400" />
            <PlusSquare className="w-7 h-7 text-gray-400" />
            <Heart className="w-7 h-7 text-gray-400" />
            <User className="w-7 h-7 text-gray-400" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InstagramSafetySimulator;
