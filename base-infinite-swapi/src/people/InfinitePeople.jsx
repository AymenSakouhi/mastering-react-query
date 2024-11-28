import InfiniteScroll from 'react-infinite-scroller'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Person } from './Person'

const initialUrl = 'https://swapi.dev/api/people/'
const fetchUrl = async (url) => {
  const response = await fetch(url)
  return response.json()
}

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error,
    isError
  } = useInfiniteQuery({
    queryKey: ['sw-people'],
    // page params is basically the api fetch url.
    queryFn: ({ pageParams = initialUrl }) => fetchUrl(pageParams),
    // hasNext page is going to be either undefiend or the nextpage url for fetching
    getNextPageParam: (lastPage) => lastPage.next || undefined
  })
  // TODO: get data for InfiniteScroll via React Query
  if (isLoading) return <h2 className="loading">Loading....!</h2>
  if (isError) return <h2>{error.toString()}</h2>

  return (
    <>
      {isFetching && <h2 className="loading">Loading....!</h2>}
      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) fetchNextPage()
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            )
          })
        })}
      </InfiniteScroll>
    </>
  )
}
