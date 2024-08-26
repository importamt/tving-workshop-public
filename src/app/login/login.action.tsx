'use server';

import pool from '@/database/pool';
import { LoginActionResult } from '@/app/login/login.form';
import { cookies } from 'next/headers';
import { COOKIE_KEY } from '@/constant/common';

const loginAction = async (prev: LoginActionResult, formData: FormData): Promise<LoginActionResult> => {
  try {
    // wait for seconds (모래시계 보여주려고 ㅋㅋ)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const name = formData.get('name');
    let employeeNumber = formData.get('employee_number') as string;
    const queryResult = await pool.query('SELECT * FROM workshop.users WHERE name = $1 AND employee_number = $2', [
      name,
      employeeNumber.toUpperCase(),
    ]);

    const user = queryResult.rows[0];
    if (!queryResult || queryResult.rowCount === 0) {
      return {
        sequence: prev.sequence + 1,
        isSuccess: false,
        isError: false,
        resultMessage: '사용자 정보가 일치하지 않습니다.',
      };
    } else {
      const nextCookies = cookies();
      const prevPath = nextCookies.get(COOKIE_KEY.PREV_PATH);
      nextCookies.set(COOKIE_KEY.WORKSHOP_TOKEN, `${employeeNumber.toUpperCase()}`);
      const messages = [
        `${user.team}팀, ${user.name}님!\n 보물찾기에 참여하신걸 환영합니다!`,
        `${user.team}팀, ${user.name}님!\n 보물찾기 모험을 떠나볼까요?`,
        `${user.team}팀, ${user.name}님!\n 진심으로 환영합니다!`,
      ];
      return {
        sequence: prev.sequence + 1,
        isSuccess: true,
        isError: false,
        resultMessage: messages[Math.floor(Math.random() * messages.length)],
        prevPath: prevPath?.value || '/',
      };
    }
  } catch (e) {
    console.error(e);
    return {
      sequence: prev.sequence + 1,
      isSuccess: false,
      isError: true,
      resultMessage: '로그인 중 오류가 발생했습니다!\n 인사팀에 문의해주세요.',
    };
  }
};

export default loginAction;
