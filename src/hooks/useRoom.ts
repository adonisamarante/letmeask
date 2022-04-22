import { useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type Author = {
  readonly name: string;
  readonly avatar: string;
}

type QuestionType = {
  readonly id: string;
  readonly author: Author;
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

// para declarar tipagem de objeto (com chave e valor) (lembra dictionary)
type FirebaseQuestions = Record<string, {
  readonly author: Author;
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>;
}>

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    // .on vai ficar "ouvindo" e executar sempre que houver alguma alteração em roomRef (que no caso é a `rooms/${roomId}`)
    // se usar o .once, este trexo é executado apenas uma vez (ou nesse caso, somente quando hovesse alteração do state roomId)
    // com o .on nesse caso, sempre serão buscadas todas as informações da sala, em caso de muitas questions, ficaria lento por conta do evento 'value'
    // existem outros eventos como 'child_added' no firebase que escutaria apenas o child(question) que foi adicionado no parent(room)
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      // "const firebaseQuestions: FirebaseQuestions" seria a mesma coisa se usar "databaseRoom.questions as FirebaseQuestions"
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })

    // funciona como o esquema do unsibscribe, mas nesse caso é um atributo do próprio database do firebase
    return () => {
      roomRef.off('value');
    }

    // os atributos neste array, pode-se dizer que são dependencias deste useEffect, para que ele performe da melhor forma
  }, [roomId, user?.id])

  return { questions, title };
}