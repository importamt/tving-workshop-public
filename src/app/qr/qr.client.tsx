'use client';

import QRCodeStyling from 'qr-code-styling';
import Hint from '@/domain/hint';
import encryptKey from '@/utils/encrypt-key/encryptKey';

interface QrClientProps {
  protocol: string;
  domain: string;
  hints: Hint[];
}

const QrClient = ({ protocol, domain, hints }: QrClientProps) => {
  return (
    <section className={'w-screen min-h-screen p-4 bg-black text-white flex justify-center items-center relative flex-wrap gap-4'}>
      {hints.map((hint) => {
        console.log('url', `${protocol}://${domain}/quiz/${encryptKey(`${hint.answer_index},${hint.index}`)}`);

        const qr = new QRCodeStyling({
          width: 256,
          height: 256,
          data: `${protocol}://${domain}/quiz/${encryptKey(`${hint.answer_index},${hint.index}`)}`,
          image: '/images/tving.webp',
          dotsOptions: {
            color: '#000000',
            type: 'square',
          },
          backgroundOptions: {
            color: '#FF153C',
          },
          imageOptions: {
            imageSize: 0.3,
            crossOrigin: 'anonymous',
            margin: 1,
          },
        });

        return (
          <figure
            key={`hint-${hint.id}`}
            ref={(ref) => {
              if (ref) {
                qr.append(ref);
              }
            }}
          ></figure>
        );
      })}
    </section>
  );
};

export default QrClient;
