import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { QueryFunction, useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = null }) => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam
      }
    });

    return response.data;
  }
  
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => {
      return lastPage?.after || null;
    },
  });

  const formattedData = useMemo(() => {
    const formattedDataArray = data?.pages.map((page) => {
      return page.data;
    }).flat();

    return formattedDataArray;
  }, [data]);


  if (isLoading && !isError) {
    return <Loading />
  }

  if (!isLoading && isError) {
    return <Error />
  }
  
  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        { hasNextPage &&
          <Button 
            mt="40px"
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage
             ? 'Carregando...'
             : hasNextPage &&'Carregar mais'
            }
          </Button>
        }
      </Box>
    </>
  );
}
