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
                        className="w-5 h-5 hover:opacity-75"
                        href="https://hypertabs.zt0ht.repl.co/uv/service/hvtrs8%2F-mmora%2Clkvg%2Feivhwb"
                      >
                        {/* GitHub SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#fff"
                          viewBox="0 0 20 20"
                        >
                          {/* ... GitHub SVG content */}
                        </svg>
                      </a>
                      <a
                        className="w-6 h-6 hover:opacity-75"
                        href="https://hypertabs.zt0ht.repl.co/uv/service/hvtrs8%2F-mmora%2Clkvg%2Ffiqcmrf"
                      >
                        {/* Discord SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          preserveAspectRatio="xMidYMid"
                          viewBox="0 -28.5 256 256"
                        >
                          {/* ... Discord SVG content */}
                        </svg>
                      </a>
                    </div>
                  </div>
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    Hi! Welcome to the new changelogs section. Here you can see
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
                    v4.3.1
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
                    <p>- Fix: Weird padding on the navbar in profile page</p>
                  </div>
                </div>

                <div className="my-2 flex items-center justify-evenly">
                  <div className="w-full h-[1px] bg-gradient-to-r from-white/5 to-white/40"></div>
                  <p className="relative flex flex-1 whitespace-nowrap font-bold mx-2 font-inter">
                    v4.3.0
                    <span className="flex text-xs font-light font-roboto ml-1 italic">
                      pre
                    </span>
                  </p>
                  <div className="w-full h-[1px] bg-gradient-to-l from-white/5 to-white/40"></div>
                </div>
                <div className="flex flex-col gap-2 text-sm py-2 text-gray-200">
                  <div>
                    <p>- Added changelogs section</p>
                    <p>- Added recommendations based on user lists</p>
                    <p>- New Player!</p>
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
