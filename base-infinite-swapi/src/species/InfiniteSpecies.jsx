import InfiniteScroll from 'react-infinite-scroller'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Species } from './Species'

const initialUrl = 'https://swapi.dev/api/species/'
const fetchUrl = async (url) => {
  const response = await fetch(url)
  return response.json()
}

export function InfiniteSpecies() {
  const {
    data,
    // hasNextPage boolean to undicate pageParam content truthy or falsy
    hasNextPage,
    fetchNextPage,
    isFetching,
    isError,
    error,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParams = initialUrl }) => fetchUrl(pageParams),
    // you can get the pageParams from lastPage or allPages depending on api
    getNextPageParam: (lastPage) => lastPage.next || undefined
  })
  // TODO: get data for InfiniteScroll via React Query
  if (isLoading) return <div className="loading">Loading...!</div>
  if (isError) return <div>{error.toString()}</div>
  return (
    <>
      {isFetching && <div className="loading">Loading...!</div>}
      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) fetchNextPage()
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) =>
          pageData.results.map((specie) => (
            <Species
              {...{
                key: specie.name,
                name: specie.name,
                language: specie.language,
                averageLifespan: specie.average_lifespan
              }}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  )
}
