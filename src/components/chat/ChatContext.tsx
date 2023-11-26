import { type ChangeEvent, createContext, type ReactNode, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';

type StreamResponse = {
   addMessage: () => void;
   message: string;
   handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
   isLoading: boolean;
};

const ChatContext = createContext<StreamResponse>({
   addMessage: () => {},
   message: '',
   handleInputChange: () => {},
   isLoading: false
});

interface ChatContextProps {
   fileId: string;
   children: ReactNode;
}

const ChatContextProvider = ({ fileId, children }: ChatContextProps) => {
   const [message, setMessage] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const { toast } = useToast();

   const { mutate: sendMessage } = useMutation({
      mutationFn: async ({ message }: { message: string }) => {
         const response = await fetch('/api/message', {
            method: 'POST',
            body: JSON.stringify({
               fileId,
               message
            })
         });
         if (!response.ok) {
            throw new Error('Failed to send message');
         }
         return response.body;
      }
   });

   const addMessage = () => sendMessage({ message });
   const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
   };

   return (
      <ChatContext.Provider value={{ addMessage, message, handleInputChange, isLoading }}>
         {children}
      </ChatContext.Provider>
   );
};

export default ChatContextProvider;
