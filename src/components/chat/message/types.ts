
import { Message } from '@/lib/firebase/messages';

export interface FormattedMessage extends Message {
  formattedTime?: string;
}
