export async function sendAnswerFoundSlackMessage(
  userId: string,
  answerIndex: number,
  answer: string,
  present: string,
  answerDescription: string,
  imageUrl: string,
) {
  const message = {
    blocks: [
      {
        type: 'header',
        block_id: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 축하합니다! 🎉',
          emoji: true,
        },
      },
      {
        type: 'section',
        block_id: 'winner',
        text: {
          type: 'mrkdwn',
          text: `<@${userId}> 님께서 \`${answerIndex + 1}번 문제\`의 정답(\`${answer}\`)을 맞히셨습니다! 🎉🥳`,
        },
      },
      {
        type: 'section',
        block_id: 'prize',
        text: {
          type: 'mrkdwn',
          text: `*상품*: ${present} 💳`,
        },
      },
      {
        type: 'section',
        block_id: 'pickup_info',
        text: {
          type: 'mrkdwn',
          text: '*상품 수령 안내:*\n - 🕙 *시간*: 7/12 오전 10:45\n - 📍 *장소*: 2층 볼룸 홀\n - 🧑‍💼 *담당자*: 인사팀',
        },
      },
      {
        type: 'section',
        block_id: 'content_info',
        text: {
          type: 'mrkdwn',
          text: `> \`${answer}\`은(는) ${answerDescription} 🌟📺`,
        },
      },
      {
        type: 'image',
        image_url: imageUrl,
        alt_text: answer,
      },
    ],
  };
  await sendWorkshopSlackMessage(message);
}

export async function sendHintFoundSlackMessage(userId: string, answerIndex: number, hintIndex: number) {
  const messageBody = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<@${userId}>님이 \`${answerIndex + 1}번\` 문제의 \`${convertIndexToOrder(hintIndex)}\` 힌트를 획득했습니다`,
        },
      },
    ],
  };
  await sendWorkshopSlackMessage(messageBody);
}

function convertIndexToOrder(index: number): string {
  switch (index) {
    case 0:
      return '첫 번째';
    case 1:
      return '두 번째';
    case 2:
      return '세 번째';
    case 3:
      return '네 번째';
    case 4:
      return '다섯 번째';
    case 5:
      return '여섯 번째';
    case 6:
      return '일곱 번째';
    case 7:
      return '여덟 번째';
    case 8:
      return '아홉 번째';
    case 9:
      return '열 번째';
    default:
      return `${index} 번째`;
  }
}

async function sendWorkshopSlackMessage(messageBody: any) {
  try {
    await fetch('https://hooks.slack.com/services/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', {
      // await fetch('https://hooks.slack.com/services/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', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    });
  } catch (e) {
    console.log(e);
  }
}
