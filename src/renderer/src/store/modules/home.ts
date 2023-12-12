import { defineStore } from 'pinia'

export type ChooseSong = {
  songId: string;
  from: string;
}

export type ChooseSongState = {
  songList: ChooseSong[]
}

export const useUserStore = defineStore('home', {
  state: (): ChooseSongState => ({
    songList: []
  }),
  actions: {
    syncSongList(songList: ChooseSong[]) {
      this.songList = songList
    }
  },
})