import { boundedChannel } from "diagnostics_channel";

const SERVER_URL = 'http://localhost:3000';
const TIMEOUT_MS = 5 * 1000;

/**
 * Send POST '/v1/admin/auth/register' request
 * 
 * @param email        
 * @param password     
 * @param nameFirst    
 * @param nameLast     
 * @param programName  
 * @param age        
 * @param school
 *   
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminAuthRegister(
        email: string, 
        password: string, 
        nameFirst: string, 
        nameLast: string, 
        programName: string, 
        age: number,
        school: string
    ) {
    const res = await fetch(SERVER_URL + '/v1/admin/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            nameFirst,
            nameLast,
            programName,
            age,
            school,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}

/**
 * Send POST '/v1/admin/auth/login' request
 *
 * @param email
 * @param password
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminAuthLogin(email: string, password: string) {
    const res = await fetch(SERVER_URL + '/v1/admin/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}

/**
 * Send GET '/v1/admin/studentuser/details'
 * 
 * @param controlUserSessionId
 * 
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminStudentUserDetails(controlUserSessionId: string) {
    const res = await fetch(SERVER_URL + '/v1/admin/studentuser/details', {
        method: 'GET',
        headers: { controlUserSessionId },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}

/**
 * Send PUT '/v1/admin/studentuser/details'
 * 
 * @param controlUserSessionId
 * 
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminStudentDetailsUpdate(controlUserSessionId: string, 
    email: string, 
    nameFirst: string, 
    nameLast: string, 
    age: number, 
    programName: string, 
    school: string
) {

    const res = await fetch(SERVER_URL + '/v1/admin/studentuser/details', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            controlUserSessionId 
        },
        body: JSON.stringify({
            email, 
            nameFirst,
            nameLast, 
            age, 
            programName,
            school,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}

/**
 * Send PUT '/v1/admin/studentuser/details'
 * 
 * @param controlUserSessionId
 * 
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminStudentUserPasswordUpdate(controlUserSessionId: string, oldPassword: string, newPassword: string) {
    const res = await fetch(SERVER_URL + '/v1/admin/studentuser/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            controlUserSessionId 
        },
        body: JSON.stringify({
            oldPassword,
            newPassword,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}

/**
 * Send POST '/v1/admin/auth/logout'
 * 
 * @param controlUserSessionId
 * 
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminAuthLogout(controlUserSessionId: string) {

    const res = await fetch(SERVER_URL + '/v1/admin/auth/logout', {
        method: 'POST',
        headers: { controlUserSessionId },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}
