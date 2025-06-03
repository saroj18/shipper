export const envExtrator = (env: any) => {
  console.log('env>>>>>', env);
  const data = env.filter((e: any) => {
    return !e.key.includes('VITE') || !e.key.includes('REACT_APP');
  });
  return data.map((e: any) => {
    return `${e.key}=${e.value}`;
  });
};
