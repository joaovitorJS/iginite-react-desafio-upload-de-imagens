import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="pGray.800">
        <ModalBody p='0'>
          <Image maxH="600px" maxW="900px"  h="100%" w="100%" src={imgUrl} objectFit="contain" objectPosition="center" />
        </ModalBody>
        <ModalFooter justifyContent="flex-start">
          <Link href={imgUrl} target="_blank" textAlign="left">Abrir original</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
