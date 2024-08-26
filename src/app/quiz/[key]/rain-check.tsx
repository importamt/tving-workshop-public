import { notFound } from 'next/navigation';
import pool from '@/database/pool';
import Image from 'next/image';
import decryptKey from '@/utils/decrypt-key/decryptKey';

interface QuizRainCheckProps {
  employeeNumber: string;
}

const QuizRainCheck = async ({ employeeNumber }: QuizRainCheckProps) => {
  const userQueryResult = await pool.query('SELECT * FROM workshop.users WHERE employee_number = $1', [employeeNumber.toUpperCase()]);
  if (userQueryResult.rowCount === 0) {
    notFound();
  }

  const user = userQueryResult.rows[0];
  const { name: userName, team } = user;

  return (
    <section className={'w-screen min-h-screen p-12 bg-black text-white flex flex-col justify-center items-center'}>
      <header className={'flex'}>
        <h1 className={'text-2xl font-bold flex justify-center items-center'}>한 발 늦었어요! </h1>
        <Image width={64} height={64} src={'/images/empty_block.png'} alt={'빈돌'} className={'ml-2 w-12'} />
      </header>
      <main>
        <h2 className={'font-bold flex justify-center items-center mt-4'}>{`${team}팀 ${userName}`}님께서 이미 해당 힌트를 챙기셨습니다!</h2>
      </main>
    </section>
  );
};

export default QuizRainCheck;
