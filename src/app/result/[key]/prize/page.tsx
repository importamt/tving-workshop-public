import decryptKey from '@/utils/decrypt-key/decryptKey';
import pool from '@/database/pool';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { COOKIE_KEY } from '@/constant/common';

const Prize = async ({ params }: { params: { key: string } }) => {
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
  const correctEmployeeNumber = answer.employee_number;
  const userQueryResult = await pool.query('SELECT * FROM workshop.users WHERE employee_number = $1', [correctEmployeeNumber]);
  if (userQueryResult.rowCount === 0) {
    notFound();
  }

  const user = userQueryResult.rows[0];
  const { name: userName } = user;

  const nextCookies = cookies();
  const cookieEmployeeNumber = nextCookies.get(COOKIE_KEY.WORKSHOP_TOKEN)?.value || '';

  if (cookieEmployeeNumber !== correctEmployeeNumber) {
    notFound();
  }

  return (
    <section className={'w-screen min-h-screen p-12 bg-black text-white flex flex-col justify-center items-center'}>
      <Image
        width={512}
        height={512}
        src={'/images/shining.gif'}
        alt={'빛'}
        className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50'}
      />
      <header className={'flex'}>
        <h1 className={'text-2xl font-bold flex justify-center items-center'}>축하합니다! </h1>
        <Image width={64} height={64} src={'/images/gems.gif'} alt={'보석들'} className={'ml-2 w-12'} />
      </header>
      <main>
        <h2 className={'text-xl font-bold flex justify-center items-center mt-4'}>보물찾기에 성공하셨습니다!</h2>
        <h2 className={'font-bold flex justify-center items-center mt-4'}>
          {userName}님께서 찾은 보물 [{answer.present}]
        </h2>
        <h2 className={'font-bold flex justify-center items-center mt-4'}>{`정답: ${answer.name}`}</h2>
      </main>
    </section>
  );
};

export default Prize;
