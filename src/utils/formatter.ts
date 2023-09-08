export const formatPhoneNumber = (phone: string) => {
  const formatedNumber: string = phone.replaceAll(/\D/gi, '');
  return `+55${formatedNumber}`;
};
