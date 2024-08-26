import Image from 'next/image';
import Dim from '@/components/dim/Dim';

interface LoadingProps {
  text?: string;
}
const Loading = ({ text }: LoadingProps) => {
  return (
    <Dim>
      <main className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex'}>
        <p className={'text-white'}>{text || '로딩중...'}</p>
        <Image width={64} height={64} src={'/images/loading.gif'} alt={'로딩중'} className={'ml-2 w-6'} />
      </main>
    </Dim>
  );
};

export default Loading;
