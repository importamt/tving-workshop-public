import { notFound } from 'next/navigation';
import pool from '@/database/pool';
import Image from 'next/image';
import decryptKey from '@/utils/decrypt-key/decryptKey';

const RainCheck = async ({ params }: { params: { key: string } }) => {
  const { key } = params;

  const answerIndex = decryptKey(key);
  if (!answerIndex) {
    notFound();
  }

  const answerQueryResult = await pool.query('SELECT * FROM workshop.answers WHERE index = $1', [answerIndex]);
  if (answerQueryResult.rowCount === 0) {
    notFound();
  }
  const answer = answerQueryResult.rows[0];
  const employeeNumber = answer.employee_number;
  const userQueryResult = await pool.query('SELECT * FROM workshop.users WHERE employee_number = $1', [employeeNumber]);
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
        <h2 className={'font-bold flex justify-center items-center mt-4'}>{`${team}팀 ${userName}`}님께서 이미 보물을 챙기셨습니다!</h2>
        <h2 className={'font-bold flex justify-center items-center mt-4'}>{`정답: ${answer.name}`}</h2>
      </main>
    </section>
  );
};

export default RainCheck;
