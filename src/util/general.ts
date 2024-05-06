export function stringToPrize(s: string) {
  const lastIndex = s.lastIndexOf('*');
  if (lastIndex === -1) {
    return { name: s, amount: '1' };
  } else {
    let name = s.substring(0, lastIndex);
    let amount = s.substring(lastIndex + 1);
    if (isNaN(Number(amount)) || amount === '') {
      name += amount
      amount = '1'
    }
    return { name: name, amount: amount };
  }
}

export async function generateUniqueCode(existingCodes: string[]): Promise<string> {
  let newCode
  do {
    newCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  } while (existingCodes.includes(newCode))
  return newCode
}
