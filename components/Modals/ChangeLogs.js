import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function ChangelogModal({ isOpen, setIsOpen }) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
          static // <-- Add the static prop here
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-90 backdrop-filter backdrop-blur-md" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all bg-secondary shadow-xl rounded-md text-white">
                <h3 className="text-lg font-medium leading-6">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xl">Changelogs</p>
                    <div className="flex gap-2 items-center">
                      <a
                        className="w-6 h-6 hover:opacity-75"
                        href="https://discord.gg/B8YV3nFnDa"
                      >
                        {/* Discord SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          preserveAspectRatio="xMidYMid"
                          viewBox="0 -28.5 256 256"
                        >
                          <path fill="#fff" d="M216.856 16.597A208.502 208.502 0 00164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 00-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0079.735 175.3a136.413 136.413 0 01-21.846-10.632 108.636 108.636 0 005.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 005.355 4.237 136.07 136.07 0 01-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36zM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    Hey! Welcome to the new changelogs section. Here you can see
                    a lists of the latest changes and updates to the site.
                  </p>
                  <p className="inline-block text-sm italic my-2 text-gray-400">
                    *This update is still in its pre-release state; please
                    expect to see some bugs. If you find any, please report
                    them.
                  </p>
                </div>

                {/* Changelog Items */}
                <div className="my-2 flex items-center justify-evenly">
                  <div className="w-full h-[1px] bg-gradient-to-r from-white/5 to-white/40"></div>
                  <p className="relative flex flex-1 whitespace-nowrap font-bold mx-2 font-inter">
                    v4.3.2
                    <span className="flex text-xs font-light font-roboto ml-1 italic">
                      pre
                    </span>
                  </p>
                  <div className="w-full h-[1px] bg-gradient-to-l from-white/5 to-white/40"></div>
                </div>
                <div className="flex flex-col gap-2 text-sm py-2 text-gray-200">
                  <div>
                    <p>- Fix: Auto Next Episode forcing to play sub even if dub is selected</p>
                    <p>- Fix: Episode metadata not showing after switching to dub</p>
                    <p>- Fix: Profile picture weirdly cropped</p>
                    <p>- Fix: Fetching the m3u8 from hanime api</p>
                  </div>
                </div>

                <div className="my-2 flex items-center justify-evenly">
                  <div className="w-full h-[1px] bg-gradient-to-r from-white/5 to-white/40"></div>
                  <p className="relative flex flex-1 whitespace-nowrap font-bold mx-2 font-inter">
                    v4.3.1
                    <span className="flex text-xs font-light font-roboto ml-1 italic">
                      pre
                    </span>
                  </p>
                  <div className="w-full h-[1px] bg-gradient-to-l from-white/5 to-white/40"></div>
                </div>
                <div className="flex flex-col gap-2 text-sm py-2 text-gray-200">
                  <div>
                    <p>- Added changelogs section</p>
                    <p>- Added hanime section</p>
                    <p>- Added: New video player for hanime</p>
                    <p>- Added notifications section (Coming Soon)</p>
                    <p>- And other minor bug fixes!</p>
                  </div>
                </div>

                <div className="mt-2 text-gray-400 text-sm">
                  <p>
                    see more changelogs{" "}
                    <a
                      className="text-blue-500"
                      href="https://github.com/Streamsora/Streamsora-V2/blob/main/release.md"
                    >
                      here
                    </a>
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex-1"></div>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-action/10 px-4 py-2 text-sm font-medium text-action/90 hover:bg-action/20 focus:outline-none"
                    onClick={closeModal}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
