// Utility function to calculate the expiration date from `exp`
export const calculateExpirationTime = (exp: number) => {
    const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    const expiresIn = exp - currentTimestamp; // Calculate remaining time until expiration
    return expiresIn > 0 ? expiresIn : 0; // Ensure expiration is not negative
};

// Utility function to check if the token is expired
export const isTokenExpired = (exp: number) => {
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp
    return exp < currentTimestamp; // Check if the token is expired
};

// Utility function to decode the JWT token and get the expiration time
export const decodeJwt = (token: string) => {
    const payload = token.split('.')[1]; // JWT payload is the second part of the token
    const decoded = JSON.parse(atob(payload)); // Decode base64 payload    
    return decoded; // Return decoded JWT, which includes the 'exp' field
};