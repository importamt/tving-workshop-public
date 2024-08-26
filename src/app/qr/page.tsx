import pool from '@/database/pool';
import { headers } from 'next/headers';
import QrClient from '@/app/qr/qr.client';
import Hint from '@/domain/hint';

const Qr = async () => {
  const nextHeaders = headers();

  const protocol = nextHeaders.get('x-forwarded-proto') || '';
  const domain = nextHeaders.get('x-forwarded-host') || '';

  console.log('protocol', protocol);
  console.log('domain', domain);

  const queryResult = await pool.query('SELECT * FROM workshop.hints');
  const hints: Hint[] = queryResult.rows;

  return <QrClient protocol={protocol} domain={domain} hints={hints} />;
};

export default Qr;
