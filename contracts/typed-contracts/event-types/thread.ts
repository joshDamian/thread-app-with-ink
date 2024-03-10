import type {ReturnNumber} from "@727-ventures/typechain-types";
import type * as ReturnTypes from '../types-returns/thread';

export interface ThreadCreated {
	creator: ReturnTypes.AccountId;
	message: string;
	parent: ReturnTypes.AccountId | null;
}

export interface MessageUpdated {
	previousMessage: string;
	newMessage: string;
}

