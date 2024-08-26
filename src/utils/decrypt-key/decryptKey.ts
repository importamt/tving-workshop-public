const decryptKey = (key: string) => {
  try {
    const decodedKey = atob(decodeURIComponent(key));
    const [, , decryptedKey] = decodedKey.split('@@');
    return decryptedKey;
  } catch (error) {
    return '';
  }
};

export default decryptKey;
