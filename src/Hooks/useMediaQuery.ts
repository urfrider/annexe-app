import { useEffect, useState } from 'react'

function useMediaQuery(query: string) {
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() =>{
    const media = window.matchMedia(query);
    const onResize = () => setIsMatching(media.matches);

    if (media.matches !== isMatching) {
      setIsMatching(media.matches);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMatching, query])

  return isMatching;
}

export default useMediaQuery;