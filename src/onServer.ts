/* eslint-disable import/no-anonymous-default-export */

/**
 *  throw error if running from client side
 */
if (typeof window !== 'undefined') {
    throw new Error('This function should not be called from the client side');
}

export default {}