import { getData, type DataStore} from './dataStore.js';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import createHttpError from 'http-errors';

/**
 * Creating a new control user ID
 * 
 * @returns {countid} - ID produce by controlUserIdGen
 */
export function studentIdGen(): number {
    const timeid: number = Date.now() / 10000;
    let countid: number = Math.floor(timeid);
    const id: number[] = getData().studentArray.map(i => i.student.studentId);
    while (id.includes(countid)) {
        countid += 1;
    }

    return countid;
}

/**
 * Create a controUserSessionId
 * @returns {string}  - a random string for controlUserSessionId
 */

export function controlUserSessionIdGen(): string {
  const controlUserSessionId = uuidv4();
  return controlUserSessionId;
}

// set the help function of name validity
/**
  * <Check whether the name input is correct>
  *
  * @param {Char} name_first - The first name
  * @param {Char} name_last - The last name
  *
  * @returns {true} -  If is valid input true
  * @returns {false} - If is invalid input, false
*/
export function nameValidity(nameFirst: string, nameLast: string): boolean {
    if (nameFirst.length > 20 || nameLast.length > 20 || nameFirst.length < 2 || nameLast.length < 2) {
        return false;
    } else if (!/^[A-Za-z' -]+$/.test(nameLast)) {
        return false;
    }
    return true;
}

// set the help function of school validity
export function schoolValidity(school: string): boolean {
    if (school.length > 50 || school.length < 2) {
        return false;
    } else if (!/^[A-Za-z' -]+$/.test(school)) {
        return false;
    }
    return true;
}

// set the help function of email validity
/**
 * <Check whether the eamil input is correct>
 * 
 * @param {Char} email - eamil
 * 
 * @return {true} - If is valid input true
 * @return {false} - If is invalid input, false
 */
export function eamilValidity(email: string, currentUserId: number | null = null): string | null {

    if (!validator.isEmail(email)) {
        return 'Wrong format';
    }

    const data = getData();
    const userArray = data.StudentAuthArray;

    // check whether there are another student use same eamil
    const isEmailInUse = userArray.some(element => {
        const user = element.studentAuth;
        return user.email === email && user.studentId !== currentUserId;
    });

    if (isEmailInUse) {
        return 'Email in use';
    }

    return null;
}

/**
 * Checks whether the given password is valid.
 *
 * @param { character } password - The password of the user.
 *
 * @returns { boolean }  - Successful case: when the given password is valid.
 * @returns { boolean } - Error case: when the given password is not valid.
 */
export function passwordValidity(password: string): boolean {

    const length : boolean = (password.length >= 8);
    const letters : boolean = /[a-zA-Z]/.test(password);
    const numbers : boolean = /\d/.test(password);

    if (length && letters && numbers) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks whether the given password is valid.
 *
 * @param { character } programName - The password of the user.
 *
 * @returns { boolean }  - Successful case: when the given password is valid.
 * @returns { boolean } - Error case: when the given password is not valid.
 */
export function programNameValidity(programName: string): boolean {

    if (programName.length > 20) {
        return false;
    } else if (!/^[A-Za-z' -]+$/.test(programName)) {
        return false;
    }

    return true;
}

/**
 * Checks whether the given password is valid.
 *
 * @param { character } age - The password of the user.
 *
 * @returns { boolean }  - Successful case: when the given password is valid.
 * @returns { boolean } - Error case: when the given password is not valid.
 */
export function ageValidity(age: number): boolean {

    if (age < 0 || typeof age !== 'number') {
        return false;
    } 
    
    return true;
}

/**
 * Find the userid from sessionid
 *
 * @param {string} controlUserSessionId - via unique controuserSessionId to find its studentId
 *
 * @returns {number} studentId  - Successful find studentId which match its unique controlUserSessionId
 */
export function findStudentIdFromSession(controlUserSessionId: string): number {
    const data: DataStore = getData();

    const findStudentId = data.controlUserSessionsArray.find(f => f.controlUserSession.controlUserSessionId === controlUserSessionId);
    if (!findStudentId) {
        throw createHttpError(401, 'Invalid studentId');
    }

    return findStudentId.controlUserSession.studentId;
}