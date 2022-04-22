import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

// todos os tipos possiveis de enviar a um button html está dentro de ButtonHTMLAttributes, que é um HTMLButtonElement
// assim não precisa declarar cada tipo manualmente aqui no type
// & para adicionar mais atributos além daqueles padões do botão, já declarados com HTMLButtonElement
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props}
    />
  )
}