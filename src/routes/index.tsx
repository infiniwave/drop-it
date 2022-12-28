import { component$, useClientEffect$, useSignal, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import VideoManager from "~/classes/VideoManager";
import { Countdown } from "~/components/Countdown";

interface Store {
  primed: boolean;
  currentDate: Date;
  targetDate: Date | null;
  syncTime: number | null;
}

export default component$(() => {
  const store = useStore<Store>({
    primed: true,
    currentDate: new Date(),
    targetDate: null,
    syncTime: null,
  });

  const videoRef = useSignal<HTMLDivElement>();

  useClientEffect$(({ track }) => {
    const state = track(store);
    const ticker = setInterval(() => {
      store.currentDate = new Date();

      if (state.syncTime && state.targetDate && state.primed) {
        if (state.currentDate.getTime() >= state.targetDate!.getTime() - state.syncTime! * 1000) {
          VideoManager.player.playVideo();
        }
      }
    }, 10);

    // DOM loaded, load video
    if (!VideoManager.initialized && videoRef.value) {
      VideoManager.init("https://youtu.be/3_-a9nVZYjk", "video");
    }

    return () => clearInterval(ticker);
  });
  
  return (
    <>
      <Countdown currentDate={store.currentDate} targetDate={store.targetDate} />
      <main class="main">
        <div class="main__video">
          <div id="video" ref={videoRef}></div>
        </div>
        <aside class="main__panel" data-disabled={store.primed}>
          <h2 class="main__heading">Configuration</h2>
          <form action="#" class="main__form">
            <fieldset class="main__fieldset" disabled={store.primed}>
              <label for="url">Video URL</label>
              <input type="url" name="url" id="url" />
            </fieldset>
            <fieldset class="main__fieldset" disabled={store.primed}>
              <div class="main__fieldset-group">
                <label for="target-date">Target Time</label>
                <input type="datetime-local" name="target-date" id="target-date" onInput$={(e) => (store.targetDate = new Date((e.target as HTMLInputElement).value))} />
              </div>
              <div class="main__fieldset-group">
                <label for="drop-time">Video Sync Time</label>
                <input type="number" name="drop-time" id="drop-time" onInput$={(e) => (store.syncTime = (e.target as HTMLInputElement).valueAsNumber)} />
              </div>
            </fieldset>
          </form>
          <main class="main__controls">
            <button class="main__unprime-btn" disabled={!store.primed} onClick$={() => (store.primed = false)}>
              Unprime
            </button>
            <button class="main__prime-btn" disabled={store.primed} onClick$={() => (store.primed = true)}>
              Prime
            </button>
          </main>
        </aside>
      </main>
    </>
  );
});

export const head: DocumentHead = {
  title: "Drop It",
  meta: [
    {
      name: "description",
      content: "Something goes here",
    },
  ],
};
