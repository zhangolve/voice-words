export async function setKv(key, value) {
  await fetch(`${process.env.voice_words_REST_API_URL}/set/${key}/${value}`, {
    headers: {
      Authorization: `Bearer ${process.env.voice_words_REST_API_TOKEN}`,
    },
  });
}

export async function hgetKv(setName, key) {
  const res = await fetch(
    `${process.env.voice_words_REST_API_URL}/hget/${setName}/${key}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.voice_words_REST_API_TOKEN}`,
      },
    },
  );
  const result = await res.json();
  return result.result;
}
