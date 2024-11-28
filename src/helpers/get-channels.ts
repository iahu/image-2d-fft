export const getChannels = (image: ImageData, channel = 4) => {
  const channels: number[][] = new Array(channel).fill(0).map(() => []);

  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    data.subarray(i, i + 4).forEach((x, i) => channels[i].push(x));
  }

  return channels;
};

export const buildPixels = (channels: number[][]) => {
  const data: number[] = [];
  const length = channels[0].length;
  const channelLength = channels.length;

  for (let i = 0; i < length; ++i) {
    for (let j = 0; j < channelLength; ++j) {
      data.push(channels[j][i]);
    }
  }

  return data;
};
