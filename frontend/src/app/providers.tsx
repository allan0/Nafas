'use client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider 
      manifestUrl="https://raw.githubusercontent.com/allan0/Nafas/main/frontend/public/tonconnect-manifest.json"
      // This helps reduce some of the network noise
      actionsConfiguration={{
          twaReturnUrl: 'https://t.me/NafasUAE_bot'
      }}
    >
      {children}
    </TonConnectUIProvider>
  );
}
