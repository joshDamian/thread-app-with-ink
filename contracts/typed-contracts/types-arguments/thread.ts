import type BN from 'bn.js';

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

