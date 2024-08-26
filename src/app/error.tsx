'use client';

import Image from 'next/image';

const Error = () => {
  return (
    <section className={'w-screen min-h-screen p-8 bg-black text-white flex flex-col justify-center items-center'}>
      <Image
        width={250}
        height={250}
        src={'/images/crying.png'}
        alt={'우는 남자'}
        className={'opacity-30 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}
      />

      <header className={'flex z-10'}>
        <h1 className={'text-4xl font-bold flex justify-center items-center'}>SERVER ERROR</h1>
      </header>
      <main className={'z-10'}>
        <h2 className={'text-xl font-bold flex justify-center items-center mt-2'}>문제가 생겨 정말 죄송합니다.</h2>
        <h2 className={'text-xl font-bold flex justify-center items-center mt-2'}>아래 담당자에게 문의해주세요.</h2>

        <h2 className={'font-bold flex justify-center items-center mt-1'}>Service Development 임보탬</h2>
        <h2 className={'font-bold flex justify-center items-center mt-1'}>Service Development 이동호</h2>
      </main>
    </section>
  );
};

export default Error;
