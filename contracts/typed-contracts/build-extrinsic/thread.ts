/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types';
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/thread';
import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';



export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		apiPromise: ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__apiPromise = apiPromise;
	}
	/**
	 * like
	 *
	*/
	"like" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "like", [], __options);
	}

	/**
	 * getLikes
	 *
	*/
	"getLikes" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getLikes", [], __options);
	}

	/**
	 * getMessage
	 *
	*/
	"getMessage" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getMessage", [], __options);
	}

	/**
	 * getCreator
	 *
	*/
	"getCreator" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getCreator", [], __options);
	}

	/**
	 * comment
	 *
	 * @param { string } message,
	*/
	"comment" (
		message: string,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "comment", [message], __options);
	}

	/**
	 * getInfo
	 *
	*/
	"getInfo" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getInfo", [], __options);
	}

	/**
	 * getComments
	 *
	*/
	"getComments" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getComments", [], __options);
	}

	/**
	 * getCreatedAt
	 *
	*/
	"getCreatedAt" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getCreatedAt", [], __options);
	}

	/**
	 * setMessage
	 *
	 * @param { string } newMessage,
	*/
	"setMessage" (
		newMessage: string,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "setMessage", [newMessage], __options);
	}

}