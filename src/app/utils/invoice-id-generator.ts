export const generateInvoiceId = () => {
    const numberPart = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    const upperChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random uppercase letter
    const lowerChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random lowercase letter
    return `inv-${numberPart}${upperChar}${lowerChar}`;
  };