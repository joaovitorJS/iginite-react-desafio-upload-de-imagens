import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type NewDataImage = {
  url: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const sizeMaxImage = 10485760; //10 MB
  const regexTypeImage = /[\/.](gif|jpeg|png)/;
  const formValidations = {
    image: {
      required: {
        value: true,
        message: "Arquivo obrigatório"
      },
      validate: {
        lessThan10MB: (file: FileList) => {
          return file.item(0).size <= sizeMaxImage || 'O arquivo deve ser menor que 10MB'
        },
        acceptedFormats: (file: FileList) => {
          return (regexTypeImage).test(file.item(0).type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
        }
      }
    },
    title: {
      required: "Título obrigatório",
      minLength: {
        value: 2,
        message: "Mínimo de 2 caracteres"
      },
      maxLength : {
        value: 20,
        message: 'Máximo de 20 caracteres' 
      }
    },
    description: {
      required: "Descrição obrigatória",
      maxLength : {
        value: 65,
        message: 'Máximo de 65 caracteres' 
      }
    },
  };

  const handleNewImageUpload = async (newDataImage: NewDataImage) => {
    return await api.post('/api/images', newDataImage);
  }

  const queryClient = useQueryClient();
  const mutation = useMutation((data: NewDataImage) => handleNewImageUpload(data), 
  {
    onSuccess: async () => {
      await queryClient.invalidateQueries('images');
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    
    try {
      if (imageUrl?.trim() === '') {
        toast({
          title: "Imagem não adicionada",
          description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
          status: "error",
          duration: 3000, // 3s
          isClosable: true
        });

        return;
      }

      const newImage = {
        title: data.title,
        description: data.description,
        url: imageUrl
      } as NewDataImage;
     
      await mutation.mutateAsync(newImage);
     
      toast({
        title: "Imagem cadastrada",
        description: "Sua imagem foi cadastrada com sucesso.",
        status: "success",
        duration: 3000, // 3s
        isClosable: true
      });

    } catch {
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
        status: "error",
        duration: 3000, // 3s
        isClosable: true
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name='image'
          {...register("image", {...formValidations.image})}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          {...register("title", formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          {...register("description", formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
