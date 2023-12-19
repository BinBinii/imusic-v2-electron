import { defineStore } from 'pinia'

export type ChooseSong = {
  song: any;
  from: string;
}

export type ChooseSongState = {
  songList: ChooseSong[]
}

export const useChooseSongStore = defineStore('home', {
  state: (): ChooseSongState => ({
    songList: []
  }),
  getters: {
    getSongList(): ChooseSong[] {
      return this.songList;
    },
  },
  actions: {
    addSong(chooseSong: any) {
      this.songList.push(chooseSong)
    },
    syncSong(chooseSongList: ChooseSong[]) {
      this.songList = chooseSongList
    }
  },
})