
//max 期望最大值； min 期望最小值
export function random(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}
