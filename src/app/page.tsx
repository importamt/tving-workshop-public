import Image from 'next/image';

export default function Home() {
  return (
    <section className="w-screen min-h-screen py-16 px-8 bg-black text-white flex flex-col items-center justify-center">
      <header className={'flex items-center'}>
        <h1 className="text-4xl font-bold flex justify-center items-center">티빙 보물찾기</h1>
        <Image width={64} height={64} src={'/images/diamond.png'} alt={'보석'} className={'ml-2 w-8 h-8'} />
      </header>
      <main className={'mt-8 bt-4'}>
        <h2 className="text-xl font-bold flex justify-center items-center mb-3">보물찾기에 오신걸 환영합니다!</h2>
        <h2 className="text-xl font-bold flex justify-center items-center mb-3">보물은 먼저 찾은 사람이 임자!</h2>

        <figure className="flex justify-center items-center my-8">
          <Image width={512} height={512} src="/images/workshop_logo.png" alt="티빙" />
        </figure>

        <p className={'font-bold flex justify-center items-center mb-3'}>보물 확인은 22시부터 가능하며</p>
        <p className={'font-bold flex justify-center items-center mb-3'}>내일 10:45 부터 상품 수령가능합니다.</p>
      </main>
      <footer className="flex justify-center items-center">
        <figure className="flex justify-center items-center">
          <Image width={512} height={128} src="/images/workshop_sponsor.png" alt="티빙" />
        </figure>
      </footer>
    </section>
  );
}
