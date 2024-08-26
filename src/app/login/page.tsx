import Image from 'next/image';
import LoginForm from '@/app/login/login.form';

const Login = async () => {
  return (
    <section className={'w-screen min-h-screen p-12 bg-black text-white flex flex-col justify-center items-center'}>
      <header className={'flex'}>
        <h1 className={'text-4xl font-bold flex justify-center items-center'}>로그인</h1>
        <Image width={64} height={64} src={'/images/key.webp'} alt={'열쇠'} className={'ml-2 w-6'} />
      </header>

      <main className={'mt-8'}>
        <LoginForm />
      </main>
    </section>
  );
};

export default Login;
