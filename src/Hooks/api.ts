import axios from "axios";

const API_KEY = "844dc95d3ddc96f564cf9a2e16cd5545";
const BASE_URL = "https://api.themoviedb.org";

interface IMovie {
    backdrop_path: string,
    id: number,
    poster_path: string,
    title: string,
    overview: string,
}

export interface IGetMoviesResult {
    dates: {
        maximum: string,
        minimum: string,
    }
    pages: number,
    results: IMovie[],
    total_pages: number,
    total_results: number,
}


export async function getMovies(){
    const movies = await axios.get(`${BASE_URL}/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);

    return movies.data;
}
