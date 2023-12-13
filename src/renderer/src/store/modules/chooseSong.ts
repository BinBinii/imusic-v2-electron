import { defineStore } from 'pinia'

export type ChooseSong = {
  songId: number;
  from: string;
}

export type ChooseSongState = {
  songList: ChooseSong[]
}

export const useChooseSongStore = defineStore('home', {
  state: (): ChooseSongState => ({
    songList: []
  }),
  actions: {
    addSong(chooseSong: ChooseSong) {
      this.songList.push(chooseSong)
    }
  },
})