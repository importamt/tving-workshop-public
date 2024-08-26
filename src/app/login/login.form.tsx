'use client';

import { createPortal, useFormState } from 'react-dom';

import loginAction from '@/app/login/login.action';
import { FormEventHandler, useEffect, useState } from 'react';
import Loading from '@/components/loading/Loading';
import Popup, { PopupType } from '@/components/popup/Popup';
import { useRouter } from 'next/navigation';

export interface LoginActionResult {
  sequence: number;
  isSuccess: boolean;
  isError: boolean;
  resultMessage?: string;
  prevPath?: string;
}

const LoginForm = () => {
  const [actionState, formAction] = useFormState(loginAction, {
    sequence: 0,
    isSuccess: false,
    isError: false,
    resultMessage: '',
  });

  const [clientErrorMessage, setClientErrorMessage] = useState('');

  const [clientSequence, setClientSequence] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    // 유효성 체크
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const employeeNumber = formData.get('employee_number');
    console.log('name', name);
    console.log('employeeNumber', employeeNumber);
    if (!name) {
      setClientErrorMessage('이름을 입력해주세요.');
      e.preventDefault();
      return;
    }

    if (!employeeNumber) {
      setClientErrorMessage('사번을 입력해주세요.');
      e.preventDefault();
      return;
    }

    setClientSequence((prev) => prev + 1);
    setIsLoading(true);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [actionState]);

  const router = useRouter();

  return (
    <form className={'flex flex-col'} action={formAction} onSubmit={handleSubmit}>
      <label htmlFor="name">이름</label>
      <input className={'text-black'} type="name" id="name" name="name" />
      <label className={'mt-2'} htmlFor="employee_number">
        사번
      </label>
      <input className={'text-black'} type="employee_number" id="employee_number" name="employee_number" />

      <button className={'mt-8 bg-white text-black py-1 active:scale-95'} type="submit">
        로그인하기
      </button>

      {clientErrorMessage ? (
        <Popup popupType={PopupType.ERROR} title={'이런!'} message={clientErrorMessage} onClose={() => setClientErrorMessage('')} />
      ) : null}

      {clientSequence && clientSequence === actionState.sequence
        ? createPortal(
            <Popup
              popupType={actionState.isError ? PopupType.ERROR : actionState.isSuccess ? PopupType.INFO : PopupType.WARNING}
              message={actionState.resultMessage || ''}
              buttonText={actionState.isSuccess ? '시작하기' : '닫기'}
              onClose={() => {
                if (actionState.isSuccess) {
                  console.log('??', actionState.prevPath);
                  void router.replace(actionState.prevPath || '/');
                }
              }}
            />,
            document.body,
          )
        : null}
      {isLoading && createPortal(<Loading text={'로그인중...'} />, document.body)}
    </form>
  );
};

export default LoginForm;
