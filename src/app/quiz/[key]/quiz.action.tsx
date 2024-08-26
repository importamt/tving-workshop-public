'use server';

import pool from '@/database/pool';
import { QuizActionResult } from '@/app/quiz/[key]/quiz.form';
import { redirect } from 'next/navigation';
import encryptKey from '@/utils/encrypt-key/encryptKey';
import { cookies } from 'next/headers';
import { COOKIE_KEY } from '@/constant/common';
import { sendAnswerFoundSlackMessage } from '@/utils/noti-slack-tving-event/notiSlackTvingEvent';

const quizAction = async (prev: QuizActionResult, formData: FormData): Promise<QuizActionResult> => {
  // wait for seconds (모래시계 보여주려고 ㅋㅋ)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const answerIndex = formData.get('answerIndex') as string;
  const answer = formData.get('answer') as string;

  const answerQueryResult = await pool.query('SELECT * FROM workshop.answers WHERE index = $1', [answerIndex]);

  const correctAnswer = answerQueryResult.rows[0].name;
  const alreadyAnswered = answerQueryResult.rows[0].employee_number;

  const nextCookies = cookies();
  const cookieEmployeeNumber = nextCookies.get(COOKIE_KEY.WORKSHOP_TOKEN)?.value || '';

  if (alreadyAnswered) {
    redirect(`/result/${encryptKey(answerIndex)}/rain-check`);
  }

  const correctAnswerWithoutSpace = correctAnswer.replace(/\s/g, '');
  const answerWithoutSpace = answer.replace(/\s/g, '');

  if (correctAnswerWithoutSpace.toUpperCase() === answerWithoutSpace.toUpperCase()) {
    // 이미 정답을 맞춘 사용자의 경우, 중복 참여 불가 팝업 띄우기
    const checkAlreadyCorrectedAnotherQuizQueryResponse = await pool.query('SELECT * FROM workshop.answers WHERE employee_number = $1', [
      cookieEmployeeNumber.toUpperCase(),
    ]);
    if (checkAlreadyCorrectedAnotherQuizQueryResponse.rowCount !== 0) {
      return {
        sequence: prev.sequence + 1,
        isCorrect: false,
        isError: false,
        resultMessage: '정답입니다! 하지만...\n보물은 한 개만 가질 수 있어요.\n다른 분께 기회를 양보해주세요!',
      };
    }

    await pool.query('UPDATE workshop.answers SET employee_number = $1 WHERE index = $2', [cookieEmployeeNumber?.toUpperCase(), answerIndex]);

    const userQueryResult = await pool.query('SELECT * FROM workshop.users WHERE employee_number = $1', [cookieEmployeeNumber?.toUpperCase()]);
    const user = userQueryResult.rows[0];

    await sendAnswerFoundSlackMessage(
      user.slack_id,
      Number(answerIndex),
      answer,
      answerQueryResult.rows[0].present,
      answerQueryResult.rows[0].description,
      answerQueryResult.rows[0].image,
    );

    redirect(`/result/${encryptKey(answerIndex)}/prize`);
  } else {
    return {
      sequence: prev.sequence + 1,
      isCorrect: false,
      isError: false,
      resultMessage: '정답이 아닙니다.\n다시 한번 시도해주세요.',
    };
  }
};

export default quizAction;
