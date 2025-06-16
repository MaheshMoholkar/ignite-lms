export const validateEmail = (email: string): boolean => {
  const emailRegexPattern: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegexPattern.test(email);
};
