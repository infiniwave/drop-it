import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <Slot />
      <footer>
      </footer>
    </>
  );
});
