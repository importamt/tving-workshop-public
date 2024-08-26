import { NextResponse } from 'next/server';
import pool from '@/database/pool';
import encryptKey from '@/utils/encrypt-key/encryptKey';

type Hint = {
  answer_index: number;
  name: string;
  employee_number: string;
  index: number;
};

export async function GET(req: Request, res: Response) {
  const queryResult = await pool.query('SELECT * FROM workshop.hints');

  const hints: Hint[] = queryResult.rows;
  const urls = hints.map((hint) => `/quiz/${encryptKey(`${hint.answer_index},${hint.index}`)}`);

  return NextResponse.json({
    urls,
  });
}
