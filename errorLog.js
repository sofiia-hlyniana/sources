import { objectToJSON } from 'utils';
import { ASANA_WORKSPACE, ASANA_PROJECT_ID, ASANA_TOKEN, ASANA_API_ROOT } from 'static/constants';

/**
 * @param {Object} errorObj - error object
 * @param {string} errorObj.message - message with error description
 * @param {string} errorObj.errorType - internal, api error, etc.
 * @param {string} [errorObj.stack] - error stack
 *
 * This module simply sends object with error description
 * to Asana task manager
 *
 * Additional note: DISABLE_ERROR_LOG is a node env variable
 */

const logError = (errorObj) => {
    if (DISABLE_ERROR_LOG) {
        console.warn(errorObj);
        return false;
    }

    const data = {
        workspace : ASANA_WORKSPACE,
        name      : 'Error log new task',
        notes     : objectToJSON(errorObj),
        projects  : [ASANA_PROJECT_ID],
    };

    return fetch(`${ASANA_API_ROOT}/tasks`, {
        method  : 'POST',
        mode    : 'cors',
        headers : {
            Authorization : `Bearer ${ASANA_TOKEN}`,
        },
        body : objectToJSON({
            data,
        }),
    });
};

export default logError;