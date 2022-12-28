import { getVideoID } from "../utils";
import PlayerFactory from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";

export default class VideoManager {
  public static player: YouTubePlayer;
  public static initialized = false;

  public static init(url: string, domId: string) {
    const id = getVideoID(url);

    this.player = PlayerFactory(domId);
    this.player.loadVideoById(id);
    this.initialized = true;
  }
}
