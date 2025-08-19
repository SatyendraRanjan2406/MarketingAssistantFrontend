import React, { useState } from 'react';
import Header from './Header';
import ChatInterface from './ChatInterface';
import InsightsSidebar from './InsightsSidebar';
import ActionModal from './ActionModal';
import { Platform } from '../types';

const Dashboard: React.FC = () => {
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('google');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const handlePlatformSwitch = (platform: Platform) => {
    setCurrentPlatform(platform);
  };

  const handleTakeAction = (action: any) => {
    setSelectedAction(action);
    setShowActionModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPlatform={currentPlatform} 
        onPlatformSwitch={handlePlatformSwitch} 
      />
      
      <div className="flex">
        <main className="flex-1 p-6 pr-0">
          <ChatInterface 
            platform={currentPlatform} 
            onTakeAction={handleTakeAction}
          />
        </main>
        
        <InsightsSidebar platform={currentPlatform} />
      </div>

      {showActionModal && (
        <ActionModal
          action={selectedAction}
          platform={currentPlatform}
          onClose={() => setShowActionModal(false)}
          onConfirm={() => {
            setShowActionModal(false);
            // Handle action implementation
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;