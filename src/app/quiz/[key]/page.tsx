import pool from '@/database/pool';
import { notFound, redirect, RedirectType } from 'next/navigation';
import Image from 'next/image';
import QuizForm from '@/app/quiz/[key]/quiz.form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import decryptKey from '@/utils/decrypt-key/decryptKey';
import encryptKey from '@/utils/encrypt-key/encryptKey';
import QuizRainCheck from '@/app/quiz/[key]/rain-check';
import { COOKIE_KEY } from '@/constant/common';
import { cookies } from 'next/headers';
import { sendHintFoundSlackMessage } from '@/utils/noti-slack-tving-event/notiSlackTvingEvent';

const Quiz = async ({ params }: { params: { key: string } }) => {
  const { key } = params;

  const decryptedKey = decryptKey(key);
  if (!decryptedKey) {
    notFound();
  }

  const [answerIndex, hintIndex] = decryptedKey.split(',');
  const queryResult = await pool.query(
    'SELECT answers.name as answer, answers.employee_number as correctEmployeeNumber, h.* FROM workshop.answers FULL JOIN workshop.hints h on answers.index = h.answer_index WHERE h.answer_index = $1 AND h.index = $2',
    [answerIndex, hintIndex],
  );
  if (queryResult.rowCount === 0) {
    notFound();
  }
  const correctEmployeeNumber = queryResult.rows[0].correctEmployeeNumber;
  const hintEmployeeNumber = queryResult.rows[0].employee_number;

  const nextCookies = cookies();
  const cookieEmployeeNumber = nextCookies.get(COOKIE_KEY.WORKSHOP_TOKEN)?.value || '';

  // 정답자의 경우 상품 페이지
  if (correctEmployeeNumber?.toUpperCase() === cookieEmployeeNumber?.toUpperCase()) {
    redirect(`/result/${encryptKey(answerIndex)}/prize`, RedirectType.replace);
  }

  // 이미 맞춘 사람 있으면 다음 기회 페이지
  if (correctEmployeeNumber) {
    redirect(`/result/${encryptKey(answerIndex)}/rain-check`, RedirectType.replace);
  }

  // 이미 힌트 가져간 사람 있으면 예외처리
  if (hintEmployeeNumber && hintEmployeeNumber?.toUpperCase() !== cookieEmployeeNumber?.toUpperCase()) {
    return <QuizRainCheck employeeNumber={hintEmployeeNumber} />;
  }

  if (!hintEmployeeNumber) {
    // 힌트 선점
    await pool.query('UPDATE workshop.hints SET employee_number = $1 WHERE answer_index = $2 AND index = $3', [
      cookieEmployeeNumber.toUpperCase(),
      answerIndex,
      hintIndex,
    ]);

    const userQueryResult = await pool.query('SELECT * FROM workshop.users WHERE employee_number = $1', [cookieEmployeeNumber]);
    const user = userQueryResult.rows[0];

    await sendHintFoundSlackMessage(user.slack_id, Number(answerIndex), Number(hintIndex));
  }

  const answer: string = queryResult.rows[0].answer;
  const hint = queryResult.rows[0].name;

  let indexForBlank = Number(hintIndex);
  const maskedAnswer = answer
    .split('')
    .map((keyword: string, index: number) => {
      if (keyword === ' ') {
        indexForBlank += 1;
        return ' ';
      }

      if (indexForBlank === index) {
        return hint;
      }

      return '?';
    })
    .join('');

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Asia/Seoul');

  const serverNow = dayjs.tz();
  const quizAnswerDate = dayjs.tz('2024-07-11 22:00:00');

  const leftSeconds = quizAnswerDate.diff(serverNow, 'second');
  return (
    <section className={'w-screen min-h-screen p-12 bg-black text-white flex flex-col justify-center items-center'}>
      <header className={'flex'}>
        <h1 className={'text-4xl font-bold flex justify-center items-center'}>
          문제({Number(answerIndex) + 1}-{Number(hintIndex) + 1})
        </h1>
        <Image width={64} height={64} src={'/images/quiz_box.png'} alt={'문제'} className={'ml-2 w-12'} />
      </header>
      <main className={'flex flex-col text-white mt-12'}>
        <article className={'flex font-bold'}>
          {maskedAnswer.split('').map((keyword, index) =>
            keyword === '?' ? (
              <span
                key={`keyword-${keyword}-${index}`}
                className={'flex justify-center items-center mx-1 w-8 h-8 border border-solid border-white rounded'}
              >
                ?
              </span>
            ) : keyword === ' ' ? (
              <span key={`keyword-${keyword}-${index}`} className={'flex justify-center items-center mx-1 w-2 h-8'}></span>
            ) : (
              <span
                key={`keyword-${keyword}-${index}`}
                className={'flex justify-center items-center mx-1 w-8 h-8 border border-solid border-white rounded'}
              >
                {keyword}
              </span>
            ),
          )}
        </article>
        <QuizForm serverLeftFullSeconds={leftSeconds} answerIndex={answerIndex} />
      </main>
    </section>
  );
};

export default Quiz;
