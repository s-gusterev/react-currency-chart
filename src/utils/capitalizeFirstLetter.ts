// Функция для преобразования первой буквы в заглавную
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default capitalizeFirstLetter;
