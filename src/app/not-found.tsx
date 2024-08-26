import Image from 'next/image';

const NotFound = () => {
  return (
    <section className={'w-screen min-h-screen p-12 bg-black text-white flex flex-col justify-center items-center'}>
      <header className={'flex'}>
        <h1 className={'text-4xl font-bold flex justify-center items-center'}>Page not found</h1>
      </header>
      <main className={'flex'}>
        <h2 className={'text-2xl font-bold flex justify-center items-center mt-4'}>돌아가세요!</h2>
        <Image width={64} height={64} src={'/images/skull.webp'} alt={'해골'} className={'ml-2 w-10 object-contain'} />
      </main>
    </section>
  );
};

export default NotFound;
