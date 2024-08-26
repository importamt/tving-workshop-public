'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const RouletteClient = () => {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    const intervalKey = setInterval(() => {
      // 1~212 Random
      setNumber(Math.floor(Math.random() * 212) + 1);
    }, 100);

    const timeoutKey = setTimeout(() => {
      clearInterval(intervalKey);
    }, 5000);

    return () => {
      clearInterval(intervalKey);
      clearTimeout(timeoutKey);
    };
  }, []);

  return (
    <section className={'w-screen min-h-screen p-12 bg-black text-white flex flex-col justify-center items-center relative'}>
      <figure className={'w-[80%] max-w-[512px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}>
        <Image width={236} height={252} src={'/images/abs.png'} alt={'ABS'} className={'w-full'} />
        <b className={'text-black w-full h-12 flex justify-center items-center bg-white text-2xl'}>{number}/km</b>
      </figure>
    </section>
  );
};

export default RouletteClient;
