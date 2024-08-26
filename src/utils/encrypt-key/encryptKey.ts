const DECOY_LENGTH = 2;

const getDecoys = () => {
  return Array.from({ length: DECOY_LENGTH }, () => Math.floor(Math.random() * 10));
};

const encryptKey = (key: string) => {
  return encodeURIComponent(btoa([getDecoys(), getDecoys(), key, getDecoys()].join('@@')));
};

export default encryptKey;
