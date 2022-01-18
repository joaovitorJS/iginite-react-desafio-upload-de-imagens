import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure();

  const [imgUrl, setImgUrl] = useState<string>('')


  function handleViewImage(url: string) {  
    setImgUrl(url);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={[1,2,3]} spacing="40px">
        { cards?.map(card => {
            return (
              <Card key={card.id} data={card} viewImage={handleViewImage}/>
            );
          })
        }
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={imgUrl}/>
    </>
  );
}
