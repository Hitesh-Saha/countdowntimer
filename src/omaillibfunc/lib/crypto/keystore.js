const OMAIL_GET_SALT = 'https://keys2.vault.ziroh.com/api/v1/UserManagement/Users/User/salt';
const OMAIL_KEYSTORE = 'https://keys2.vault.ziroh.com/api/v1/kss/keystore';
const OMAIL_SESSIONS = 'https://keys.vault.ziroh.com/ss/sessions/token'; // NOT THERE
const OMAIL_USER_MANAGEMENT = 'https://keys2.vault.ziroh.com/api/v1/UserManagement/Users/User';
// const accessToken= "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getCurrentUserInfo, getUserEncryptionKeys } from '../../cache';
import { AESDecrypt } from './AES';
const forge = require('node-forge');

export async function getAllKeyRecordsById(email) {
	try {
		let url = `https://user.vault.ziroh.com/api/v1/org/user/records/org1/${email}`;
		let response = await fetch(url);
		let responseJSON = await response.json();
		console.log(responseJSON);
		return responseJSON;
	} catch (err) {
		console.log("Failed to fetch key records", err);
		return null;
	}
}

export async function getKeyRecordByResourceId(org, email, resourceId) {
	try {
		let url = `https://user.vault.ziroh.com/api/v1/org/user/records/${resourceId}?orgId=${org}&userId=${email}`;
		let response = await fetch(url);
		let responseJSON = await response.json();
		return responseJSON;
	} catch (err) {
		console.log("Failed to get resource key by Id", err);
	}
}
export async function getUserSalt(emailID, accessToken) {
	console.log('getUSersalt');
	try {
		let headers = new Headers();
		// headers.append("Authorization", `Bearer ${accessToken}`);
		let url = `${OMAIL_GET_SALT}/${emailID}`;
		let response = await fetch(url, {
			method: "GET",
			headers: headers,
			redirect: "follow"
		});
		if (!response) throw new Error("Error in fetching User salt");
		console.log(response)
		let responseJson = await response.json();
		return responseJson;
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function getUserKey(emailID, accessToken) {

	try {
		// const session = await getSession(emailID);
		// let headers = new Headers();
		// headers.append("Authorization", `Bearer ${accessToken}`);
		// headers.append("SessionId", session);
		// headers.append("UserId", emailID);
		// let url = `${OMAIL_KEYSTORE}/resource/userKey_${emailID}`;
		// let response = await fetch(url, {
		// 	method: "GET",
		// 	headers: headers,
		// 	redirect: "follow"
		// });
		// if (!response) throw new Error("Error in fetching User's Public Key");
		// let responseJson = await response.json();
		// return responseJson;
		let response = await getKeyRecordByResourceId('org1', emailID, 'userKey');
		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function getPublicKey(emailID, accessToken) {
	try {
		// const session = await getSession(emailID); 
		// let headers = new Headers();
		// headers.append("Authorization", `Bearer ${accessToken}`);
		// headers.append("SessionId", session);
		// headers.append("UserId", emailID);
		// let url = `${OMAIL_KEYSTORE}/resource/publicKey_${emailID}`;
		// let response = await fetch(url, {
		// 	method: "GET",
		// 	headers: headers,
		// 	redirect: "follow"
		// });
		// if (!response) throw new Error("Error in fetching User's Public Key");
		// let responseJson = await response.json();
		// return responseJson;
		let response = await getKeyRecordByResourceId('org1', emailID, 'publicKey');
		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function checkUserRegistered(emailID, accessToken) {
	try {
		// let headers = new Headers(); 
		// headers.append("Authorization", `Bearer ${accessToken}`);
		// let url = `${OMAIL_USER_MANAGEMENT}/${emailID}`;
		// let response = await fetch(url, {
		// 	method: "POST",
		// 	headers: headers,
		// 	redirect: "follow"
		let url = `https://user.vault.ziroh.com/api/v1/org/admin/emailid`;
		let body = JSON.stringify({
			orgId: 'org1', userId: emailID
		});
		// if (!response) throw new Error("Error in checking user registration.");
		// let responseJson = await response.json(); 
		// return responseJson;
		const response = await fetch(url, {
			method: "POST",
			body: body
		});
		const responseJSON = await response.json();
		console.log(responseJSON);
		if (responseJSON.isPresent === false) return null;
		else return true;
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function getSession(emailID) {
	try {
		let url = `${OMAIL_SESSIONS}/${emailID}`;
		let response = await fetch(url);
		let responseJSON = await response.json();
		return responseJSON.Token;
	} catch (err) {
		console.error(err);
		return null;
	}
}


export async function getPrivateKey(emailID, accessToken) {
	try {
		// const session = await getSession(emailID); 
		// let headers = new Headers();
		// headers.append("Authorization", `Bearer ${accessToken}`);
		// headers.append("SessionId", session);
		// headers.append("UserId", emailID);
		// let url = `${OMAIL_KEYSTORE}/resource/privateKey_${emailID}`;
		// let response = await fetch(url, {
		// 	method: "GET",
		// 	headers: headers,
		// 	redirect: "follow"
		// });
		// if (!response) throw new Error("Error in fetching User's Private Key");
		// let responseJson = await response.json();
		// return responseJson;
		let response = await getKeyRecordByResourceId('org1', emailID, 'privateKey');
		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
}

// NOTE: This method is specific to React Native
export async function getMasterKey(emailID) {
	const cacheStorage   = await caches.open(emailID+"")
	        const cachedResponse = await cacheStorage.match( '/omailKey' );
	        let response = ""
	        try{
	             response = await cachedResponse.text()
	           }
	        catch { return  ""}
	        return response
	// let userInfo = await getCurrentUserInfo();
	// let masterKey = userInfo.masterKey;
	// return masterKey;
}
export async function getFheKey(emailID, accessToken) {
	// do the flow to decrypt key.om
	// AES decrypt fhe key && return
	try {
		// let { privateKey, iv, userKey } = await getUserEncryptionKeys();
		let masterKey = await getMasterKey(emailID);
		masterKey = forge.util.decode64(masterKey);
		iv = forge.util.decode64(iv);
		console.log('Get master key', masterKey);
		console.log('Get iv', iv);
		console.log('Get user key', userKey);
		let decryptedUserKey = await AESDecrypt(masterKey, iv, userKey);
		decryptedUserKey = forge.util.decode64(decryptedUserKey);
		const result = await getKeyRecordByResourceId('org1', emailID, 'fheKey');
		if (result !== undefined) {
			const fheKey = result.KeyRecords[0].ResourceKey;
			console.log("GET FHE KEY", fheKey);
			let decryptedFheKey = await AESDecrypt(decryptedUserKey, iv, fheKey);
			decryptedFheKey = decryptedFheKey.split(',');
			return decryptedFheKey;
		}
		else throw new Error("Couldn't find fhe key from server");
	} catch (err) {
		console.log('Error in fetching FHE key', err);
		return null;
	}
}
export async function getTempKey(senderId, receiverId) {
	try {
		let requestOptions = { method: 'GET', redirect: 'follow' };
		const response = await fetch(
			`https://omail.vault.ziroh.com/api/v1/omail/keys/${senderId}/${receiverId}`,
			requestOptions,
		);
		const tempKeyObj = await response.json();
		return tempKeyObj.tempKeys;
	} catch (err) {
		console.log('Error in fetching temp key');
	}
}
export async function deleteTempKey(senderId, receiverId) {
	try {
		let requestOptions = { method: 'DELETE', redirect: 'follow' };
		let response = await fetch(
			`https://omail.vault.ziroh.com/api/v1/omail/keys/${senderId}/${receiverId}`,
			requestOptions,
		);
		if (response.ok) return true;
		else return false;
	} catch (err) {
		console.log('Error in deleting temp key');
	}
}