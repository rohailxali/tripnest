import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Modal as UIModal, Button } from './index';

export const GlobalModal: React.FC = () => {
  const { modal, closeModal } = useAppStore();

  if (!modal.isOpen) return null;

  return (
    <UIModal isOpen={modal.isOpen} onClose={closeModal} title="Notification Detail">
      {modal.type === 'notificationDetail' && modal.data && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${modal.data.bg}`}>
                <modal.data.icon className={`w-6 h-6 ${modal.data.color}`} />
             </div>
             <div>
               <h4 className="font-bold text-gray-900">{modal.data.title}</h4>
               <p className="text-xs text-gray-500">{modal.data.time}</p>
             </div>
          </div>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">{modal.data.message}</p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={closeModal}>Got it</Button>
          </div>
        </div>
      )}
    </UIModal>
  );
};
