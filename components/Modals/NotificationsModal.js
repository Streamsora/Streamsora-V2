import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useAniList } from "@/lib//anilist/useAnilist"; // Update the path accordingly

export default function NotificationsModal({ isOpen, setIsOpen }) {
  const { userNotifications } = useAniList(); // Fetch AniList user notifications
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Ensure that AniList user notifications are loaded before displaying them
    if (userNotifications && userNotifications.length > 0) {
      setLoaded(true);
    }
  }, [userNotifications]);

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
          static
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

            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                    <p className="text-xl">AniList Notifications</p>
                    {/* Add any other header elements you need */}
                  </div>
                </h3>

                {/* AniList Notifications Section */}
                {loaded && (
                  <div className="flex flex-col gap-2 text-sm py-2 text-gray-200">
                    {userNotifications.map((notification) => (
                      <p key={notification.id}>{notification.text}</p>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-gray-400 text-sm">
                  <p>
                    See more on{" "}
                    <a
                      className="text-blue-500"
                      href="https://anilist.co/notifications"
                    >
                      AniList
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
