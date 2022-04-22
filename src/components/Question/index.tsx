import { ReactNode } from 'react';
// classnames 'yarn add classnames' para simplificar o className em um componente
import cx from 'classnames';

import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  // ReactNode = qualquer conteudo JSX
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false
}: QuestionProps) {
  return (
    <div
      // classanames como explicado no import, facilita a criação de classe com condições
      // evitando um monte de if ternário
      className={cx(
        'question',
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered },
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}