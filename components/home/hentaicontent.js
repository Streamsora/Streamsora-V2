// components/HentaiContent.js
import { useRouter } from 'next/router';
import { useRef, useState, useEffect   } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdChevronRight } from 'react-icons/md';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';

export default function HentaiContent({ section }) {
  const router = useRouter();
  const ref = useRef();
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://hanime-api-five.vercel.app/trending/day/${currentPage}`);
        const result = await response.json();
        console.log('API Response:', result);
        setData(result.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    const hasLeftScroll = scrollLeft > 0;
    const hasRightScroll = scrollLeft < scrollWidth - clientWidth;
    setScrollLeft(hasLeftScroll);
    setScrollRight(hasRightScroll);
  };

  const slideLeft = () => {
    const slider = ref.current;
    slider.classList.add('scroll-smooth');
    slider.scrollLeft -= 500;
    slider.classList.remove('scroll-smooth');
  };

  const slideRight = () => {
    const slider = ref.current;
    slider.classList.add('scroll-smooth');
    slider.scrollLeft += 500;
    slider.classList.remove('scroll-smooth');
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between lg:justify-normal lg:gap-3 px-5 z-40 ${
          section === 'Recommendations' ? '' : 'cursor-pointer'
        }`}
        onClick={() => router.push(`/en/hanime/hentaitrending`)}
      >
        <h1 className="font-karla text-[20px] font-bold">{section}</h1>
        <ChevronRightIcon className="w-5 h-5" />
      </div>
      <div className="relative flex items-center lg:gap-2">
        <div
          onClick={slideLeft}
          className={`flex items-center mb-5 cursor-pointer hover:text-action absolute left-0 bg-gradient-to-r from-[#141519] z-40 h-full hover:opacity-100 ${
            scrollLeft ? 'lg:visible' : 'invisible'
          }`}
        >
          <ChevronLeftIcon className="w-7 h-7 stroke-2" />
        </div>
        <div
          id="slider"
          className="flex h-full w-full select-none overflow-x-scroll overflow-y-hidden scrollbar-hide lg:gap-8 gap-4 lg:p-10 py-8 px-5 z-30"
          onScroll={handleScroll}
          ref={ref}
        >
          {data.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 shrink-0 cursor-pointer">
              <Link legacyBehavior href={`/en/hanime/watch/${item.id}`}>
                <a className="flex flex-col gap-3 shrink-0">
                  <div className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] rounded-md z-30">
                    <Image
                      loading="lazy"
                      draggable={false}
                      src={item.cover_url}
                      alt={item.name}
                      width={500}
                      height={300}
                      placeholder="blur"
                      blurDataURL={item.cover_url}
                      className="z-20 h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] object-cover rounded-md brightness-90"
                    />
                  </div>
                  <div className="w-[135px] lg:w-[185px] line-clamp-2" title={item.name}>
                    <h1 className="font-karla font-semibold xl:text-base text-[15px]">{item.name}</h1>
                    <p className="text-sm text-gray-500">Views: {item.views}</p>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          size={30}
          className={`hidden md:block mb-5 cursor-pointer hover:text-action absolute right-0 bg-gradient-to-l from-[#141519] z-40 h-full hover:opacity-100 hover:bg-gradient-to-l ${
            scrollRight ? 'visible' : 'hidden'
          }`}
        />
      </div>
    </div>
  );
}
