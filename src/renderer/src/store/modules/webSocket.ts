import { defineStore } from "pinia";
import { useUserStore } from './user'
import { useChooseSongStore } from "./chooseSong";
import { getOnlineUser } from '../../api/user'
import { getChooseSong } from '../../api/song'

const userStore = useUserStore()
const chooseSongStore = useChooseSongStore()

export const useSocketStore = defineStore({
  id: 'websocket',
  state: () => ({
    socket: null as WebSocket | null,
    limitConnect: 3
  }),
  actions: {
    connect(url: string): void {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };

      this.socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.cmd) {
          case "000":
            setInterval(() => { this.sendMessage("heartbeat") }, 30 * 1000);
            getChooseSong().then(res => {
              chooseSongStore.syncSong(res.data.result)
              setTimeout(() => {
                const songList = chooseSongStore.getSongList
                if (songList.length == 1) {
                  chooseSongStore.setIsPlaySong(songList[0])
                  chooseSongStore.release()
                }
              }, 300)
            })
            break;
          case "001":
            if (msg.data === 'updateSong') {
              getChooseSong().then(res => {
                chooseSongStore.lock()
                chooseSongStore.syncSong(res.data.result)
                setTimeout(() => {
                  const songList = chooseSongStore.getSongList
                  if (songList.length == 1) {
                    chooseSongStore.setIsPlaySong(songList[0])
                    chooseSongStore.release()
                  }
                }, 300)
              })
            }
            if (msg.data === 'nextSong') {
              getChooseSong().then(res => {
                chooseSongStore.lock()
                chooseSongStore.syncSong(res.data.result)
                setTimeout(() => {
                  const songList = chooseSongStore.getSongList
                  if (songList.length > 0) {
                    chooseSongStore.setIsPlaySong(songList[0])
                  } else {
                    chooseSongStore.setIsPlaySong({
                      song: null,
                      from: ''
                    })
                  }
                  chooseSongStore.release()
                }, 300)
              })
            }
            break;
          case "003":
            getOnlineUser().then(res => {
              userStore.setOnlineUsers(res.data.result)
            })
            break;
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.reconnect(url)
      };
    },
    sendMessage(message: string): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message)
      }
    },
    reconnect(url: string): void {
      if (this.limitConnect > 0) {
        this.limitConnect--
        // 重连
        setTimeout(() => {
          this.connect(url)
        }, 2000)
      } else {
        console.log("TCP连接已超时")
      }
    },
    disconnect(): void {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
    }
  }
})