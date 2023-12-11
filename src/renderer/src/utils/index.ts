// 序号补零
export function indexFilter(index: number) {
  index += 1
  let result = ''
  if (index < 10) {
    result = '0' + index
  } else {
    result = index + ''
  }
  return result
}

// 毫秒时间转换 mm:ss
export function millisecondsToMinutesAndSeconds(milliseconds: number) {
  // 将毫秒转换为秒
  const totalSeconds = Math.floor(milliseconds / 1000);

  // 计算分钟和剩余秒数
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // 将分钟和秒格式化为 mm:ss 形式
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

// 时间戳转日期
export function timestampToDate(timestamp: number) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
