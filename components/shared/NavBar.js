import { useSearch } from "@/lib/context/isOpenState";
import { getCurrentSeason } from "@/utils/getTimes";
import { ArrowLeftIcon, ArrowUpCircleIcon } from "@heroicons/react/20/solid";
/*import { UserIcon } from "@heroicons/react/24/solid";*/
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/*import NotificationsModal from "../Modals/NotificationsModal";*/


const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
});

export function NewNavbar({
  info,
  scrollP = 200,
  toTop = false,
  withNav = false,
  paddingY = "py-3",
  home = false,
  back = false,
  manga = false,
  shrink = false,
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState();
  const { setIsOpen } = useSearch();

  const year = new Date().getFullYear();
  const season = getCurrentSeason();

  /*const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);*/

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(getScrollPosition());
    };

    // Add a scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
{/*       Changelog Modal
      <NotificationsModal isOpen={isNotificationModalOpen} setIsOpen={setIsNotificationModalOpen} />*/}
      <nav
        className={`${home ? "" : "fixed"} z-[200] top-0 px-5 w-full ${
          scrollPosition?.y >= scrollP
            ? home
              ? ""
              : `bg-tersier shadow-tersier shadow-sm ${
                  shrink ? "py-1" : `${paddingY}`
                }`
            : `${paddingY}`
        } transition-all duration-200 ease-linear`}
      >
        <div
          className={`flex items-center justify-between mx-auto ${
            home ? "lg:max-w-[90%] gap-10" : "max-w-screen-2xl"
          }`}
        >
          <div
            className={`flex items-center ${
              withNav ? `${home ? "" : "w-[20%]"} gap-8` : " w-full gap-4"
            }`}
          >
            {info ? (
              <>
                <button
                  type="button"
                  className="flex-center w-7 h-7 text-white"
                  onClick={() => {
                    back
                      ? router.back()
                      : manga
                      ? router.push("/en/search/manga")
                      : router.push("/en");
                  }}
                >
                  <ArrowLeftIcon className="w-full h-full" />
                </button>
                <span
                  className={`font-inter font-semibold w-[50%] line-clamp-1 select-none ${
                    scrollPosition?.y >= scrollP + 80
                      ? "opacity-100"
                      : "opacity-0"
                  } transition-all duration-200 ease-linear`}
                >
                  {info.title.romaji}
                </span>
              </>
            ) : (
              <Link
                href={"/en"}
                className={`flex-center font-outfit font-semibold pb-2 ${
                  home ? "text-4xl text-action" : "text-white text-3xl"
                }`}
              >
                Streamsora
              </Link>
            )}
          </div>

          {withNav && (
            <ul
              className={`hidden w-full items-center gap-10 pt-2 font-outfit text-[14px] lg:pt-0 lg:flex ${
                home ? "justify-start" : "justify-center"
              }`}
            >
              <li>
                <Link
                  href={`/en/search/anime?season=${season}&year=${year}`}
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  This Season
                </Link>
              </li>
              <li>
                <Link
                  href="/en/search/manga"
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  Manga
                </Link>
              </li>
              <li>
                <Link
                  href="/en/search/anime"
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  Anime
                </Link>
              </li>
              <li>
                <Link
                  href="/en/schedule"
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  Schedule
                </Link>
              </li>

              {!session && (
                <li>
                  <button
                    onClick={() => signIn("AniListProvider")}
                    className="hover:text-action/80 transition-all duration-150 ease-linear"
                  >
                    Sign In
                  </button>
                </li>
              )}
            </ul>
          )}

          <div className="flex w-[20%] justify-end items-center gap-4">
            <button
              type="button"
              title="Search"
              onClick={() => setIsOpen(true)}
              className="flex-center w-[26px] h-[26px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"
                ></path>
              </svg>
            </button>
           {/* <button
              type="button"
              title="Notifications"
              onClick={() => setIsNotificationModalOpen(true)}
              className="flex-center w-[26px] h-[26px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                stroke="#fff"
                height="800px"
                width="800px"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 611.999 611.999"
                xmlSpace="preserve"
              >
                <path
                  fill="#fff"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203 C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578 c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626 h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856 c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626 C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32 c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082 c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826 c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485 c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"/> <path d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258 c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258 C323.259,126.96,315.532,119.235,306.001,119.235z"
                ></path>
              </svg>
            </button>*/}
            {session ? (
              <div className="w-7 h-7 relative flex flex-col items-center group shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/en/profile/${session?.user.name}`)
                  }
                  className="rounded-full bg-white/30 overflow-hidden"
                >
                  <Image
                    src={session?.user.image.large}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="hidden absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl opacity-0 bg-secondary p-1 py-2 rounded-md font-karla font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all md:grid place-items-center gap-1">
                  <Link
                    href={`/en/profile/${session?.user.name}`}
                    className="hover:text-action"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut("AniListProvider")}
                    className="hover:text-action"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signIn("AniListProvider")}
                title="Login With AniList"
                className="w-7 h-7 bg-white/30 rounded-full overflow-hidden shrink-0"
              >
                <Image
                  className="h-7 w-7 rounded-full"
                  width={0}
                  height={0}
                  src={`https://avatar.vercel.sh/1`}
                  alt="pfp"
                />
              </button>
            )}
            {/* </div> */}
          </div>
        </div>
      </nav>
      {toTop && (
        <button
          type="button"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className={`${
            scrollPosition?.y >= 180
              ? "-translate-x-6 opacity-100"
              : "translate-x-[100%] opacity-0"
          } transform transition-all duration-300 ease-in-out fixed bottom-24 lg:bottom-14 right-0 z-[500]`}
        >
          <ArrowUpCircleIcon className="w-10 h-10 text-white" />
        </button>
      )}
    </>
  );
}
