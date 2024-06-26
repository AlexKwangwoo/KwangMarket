"use server";

import "server-only";

export async function fetchFromAPI() {
  let data = await fetch("https://nomad-movies.nomadcoders.workers.dev/movies");
  data = await data.json();
  return data;
}

export async function fetchFromAPI2() {
  let data = await fetch("https://nomad-movies.nomadcoders.workers.dev/movies");
  data = await data.json();
  return data;
}
