import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useProdsSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [prods, setProds] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setProds([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: 'http://localhost:9002/items',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      console.log(res)
      setProds(prevProds => {
        return [...new Set([...prevProds, ...res.data.map(b => b.title)])]
      })
      setHasMore(res.data.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, prods, hasMore }
}
