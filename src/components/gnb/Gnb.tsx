'use client';

import Image from 'next/image';
import Cookies from 'js-cookie';
import { COOKIE_KEY } from '@/constant/common';
import { useEffect, useState } from 'react';

interface GnbProps {
  employeeNumber?: string;
}

const Gnb = ({ employeeNumber }: GnbProps) => {
  const [token, setToken] = useState<string | undefined>(employeeNumber);
  useEffect(() => {
    setToken(Cookies.get(COOKIE_KEY.WORKSHOP_TOKEN));
  });

  return (
    <aside className={'absolute top-2 right-0 flex items-center text-white scale-75 origin-top-right'}>
      <button
        onClick={() => {
          window.open('https://tvingcorp.enterprise.slack.com/archives/C07CFL2QMB2', '_blank');
        }}
        className={'mx-4 flex flex-col justify-center items-center opacity-50 active:opacity-100 active:scale-95'}
      >
        <Image width={32} height={32} src={'/images/slack.png'} alt={'슬랙'} />
        보물찾기채널
      </button>

      {token ? (
        <button
          onClick={() => {
            // window.open('https://tvingcorp.enterprise.slack.com/archives/C02DGGJR0F7', '_blank');
            Cookies.remove(COOKIE_KEY.WORKSHOP_TOKEN);
            location.href = '/';
          }}
          className={'mx-4 flex flex-col justify-center items-center opacity-50 active:opacity-100 active:scale-95'}
        >
          <Image width={32} height={32} src={'/images/door.png'} alt={'나가기'} />
          로그아웃
        </button>
      ) : null}
    </aside>
  );
};

export default Gnb;
