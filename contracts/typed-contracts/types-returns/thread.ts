import type BN from 'bn.js';
import type {ReturnNumber} from '@727-ventures/typechain-types';

export type AccountId = string | number[]

export type ThreadRef = {
	inner: CallBuilder
}

export type CallBuilder = {
	accountId: AccountId
}

export type Hash = string | number[]

export enum LangError {
	couldNotReadInput = 'CouldNotReadInput'
}

