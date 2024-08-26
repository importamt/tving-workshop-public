'use client';

import { FormEventHandler, useEffect, useRef, useState } from 'react';
import Popup, { PopupType } from '@/components/popup/Popup';
import { createPortal, useFormState } from 'react-dom';
import Loading from '@/components/loading/Loading';
import quizAction from '@/app/quiz/[key]/quiz.action';

const getAnswerButtonText = (leftFullSeconds: number) => {
  if (leftFullSeconds <= 0) {
    return '정답제출';
  }

  const leftDays = Math.floor(leftFullSeconds / 60 / 60 / 24);
  const leftHours = Math.floor(leftFullSeconds / 60 / 60) % 24;
  const leftMinutes = Math.floor(leftFullSeconds / 60) % 60;
  const leftActualSeconds = Math.floor(leftFullSeconds) % 60;

  return `${leftDays ? leftDays + '일 ' : ''}${leftHours ? leftHours + '시간 ' : ''} ${leftMinutes ? leftMinutes + '분 ' : ''} ${leftActualSeconds}초 뒤 시작!`;
};

export interface QuizActionResult {
  sequence: number;
  isCorrect: boolean;
  isError: boolean;
  resultMessage?: string;
}

interface QuizFormProps {
  serverLeftFullSeconds: number;
  answerIndex: string;
}
const QuizForm = ({ serverLeftFullSeconds, answerIndex }: QuizFormProps) => {
  const [leftFullSeconds, setLeftFullSeconds] = useState(serverLeftFullSeconds);
  const [clientErrorMessage, setClientErrorMessage] = useState('');
  const [clientSequence, setClientSequence] = useState(0);

  useEffect(() => {
    const intervalKey = setInterval(() => {
      setLeftFullSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalKey);
  }, []);

  const [actionState, formAction] = useFormState(quizAction, {
    sequence: 0,
    isCorrect: false,
    isError: false,
    resultMessage: '',
  } as QuizActionResult);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    // 유효성 체크
    const formData = new FormData(e.currentTarget);
    const answer = formData.get('answer');
    if (!answer) {
      setClientErrorMessage('정답을 입력해주세요.');
      e.preventDefault();
      return;
    }

    setClientSequence((prev) => prev + 1);
    setIsLoading(true);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [actionState]);

  const formRef = useRef<HTMLFormElement>(null);
  const isStarted = leftFullSeconds <= 0;
  return (
    <form ref={formRef} className={'mt-8 flex flex-col justify-center'} action={formAction} onSubmit={handleSubmit}>
      <label htmlFor="answer">정답</label>
      <input type={'hidden'} value={answerIndex} id={'answerIndex'} name={'answerIndex'} />
      <input disabled={!isStarted} className={'text-black mb-2 py-1 text-center'} type="text" id="answer" name="answer" />
      <button
        disabled={!isStarted}
        className={'w-full bg-white text-black px-4 py-1 active:scale-95 disabled:active:scale-100 disabled:bg-gray-400'}
        type="submit"
      >
        {getAnswerButtonText(leftFullSeconds)}
      </button>
      {clientErrorMessage ? (
        <Popup popupType={PopupType.ERROR} title={'이런!'} message={clientErrorMessage} onClose={() => setClientErrorMessage('')} />
      ) : null}

      {clientSequence && clientSequence === actionState.sequence
        ? createPortal(
            <Popup
              popupType={actionState.isError ? PopupType.ERROR : PopupType.WARNING}
              message={actionState.resultMessage || ''}
              buttonText={!actionState.isCorrect ? '재시도' : ''}
              onClose={() => {
                formRef.current?.reset();
              }}
            />,
            document.body,
          )
        : null}

      {isLoading && createPortal(<Loading text={'채점중...'} />, document.body)}
    </form>
  );
};

export default QuizForm;
